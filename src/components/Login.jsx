import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api, { errorMessage } from "../utils/api";
import { setUser } from "../store/userSlice";

const emptyForm = {
  firstName: "",
  lastName: "",
  emailId: "",
  password: "",
};

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { firstName, lastName, emailId, password } = form;
    try {
      if (isSignup) {
        await api.post("/signup", { firstName, lastName, emailId, password });
      }
      // signup doesn't set the cookie, so log in either way
      await api.post("/login", { emailId, password });
      const res = await api.get("/profile/view");
      dispatch(setUser(res.data));
      navigate(isSignup ? "/profile" : "/");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="card bg-base-200 w-full max-w-sm shadow-md"
      >
        <div className="card-body gap-3">
          <h1 className="text-center text-2xl font-bold">devConnect</h1>
          <p className="mb-2 text-center opacity-70">
            {isSignup ? "Create your account" : "Log in to find developers"}
          </p>

          {isSignup && (
            <div className="flex gap-2">
              <input
                name="firstName"
                placeholder="First name"
                className="input w-full"
                value={form.firstName}
                onChange={update}
                required
              />
              <input
                name="lastName"
                placeholder="Last name"
                className="input w-full"
                value={form.lastName}
                onChange={update}
              />
            </div>
          )}
          <input
            name="emailId"
            type="email"
            placeholder="Email"
            className="input w-full"
            value={form.emailId}
            onChange={update}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input w-full"
            value={form.password}
            onChange={update}
            required
          />
          {isSignup && (
            <p className="text-xs opacity-60">
              8+ characters with uppercase, lowercase, number and symbol.
            </p>
          )}

          {error && <div className="alert alert-error text-sm">{error}</div>}

          <button className="btn btn-primary mt-2" disabled={loading}>
            {loading && <span className="loading loading-spinner" />}
            {isSignup ? "Sign up" : "Log in"}
          </button>
          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup
              ? "Already have an account? Log in"
              : "New here? Create an account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
