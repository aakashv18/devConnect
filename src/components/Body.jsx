import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import Navbar from "./Navbar";
import { setUser } from "../store/userSlice";

const Body = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;
    // the cookie is httpOnly, so asking the API is the only way to know
    // whether we're logged in
    api
      .get("/profile/view")
      .then((res) => dispatch(setUser(res.data)))
      .catch(() => navigate("/login"));
  }, [user, dispatch, navigate]);

  return (
    <div className="bg-base-100 min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {user ? (
          <Outlet />
        ) : (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg" />
          </div>
        )}
      </main>
    </div>
  );
};

export default Body;
