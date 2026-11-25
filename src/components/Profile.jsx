import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { errorMessage } from "../utils/api";
import UserCard from "./UserCard";
import { setUser } from "../store/userSlice";

// full class names so Tailwind finds them when scanning
const alertClass = { success: "alert-success", error: "alert-error" };

// "React, node.js , React" -> ["React", "node.js"], dropping blanks and repeats
const parseSkills = (text) => {
  const seen = new Set();
  return text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => {
      const key = s.toLowerCase();
      if (!s || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    age: user.age ?? "",
    gender: user.gender ?? "",
    photoUrl: user.photoUrl ?? "",
    title: user.title ?? "",
    about: user.about ?? "",
    skills: (user.skills ?? []).join(", "),
  });
  const [status, setStatus] = useState({ type: "", text: "" });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    // empty age/gender would fail the schema's number/enum checks
    // an empty photoUrl is sent as "" so the backend clears it
    const body = {
      firstName: form.firstName,
      lastName: form.lastName,
      photoUrl: form.photoUrl.trim(),
      title: form.title.trim(),
      about: form.about.trim(),
      skills: parseSkills(form.skills),
    };
    if (form.age !== "") body.age = Number(form.age);
    if (form.gender) body.gender = form.gender;

    try {
      const res = await api.patch("/profile/edit", body);
      dispatch(setUser(res.data.data));
      setStatus({ type: "success", text: "Profile saved" });
    } catch (err) {
      setStatus({ type: "error", text: errorMessage(err) });
    }
  };

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-start">
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
        <h2 className="text-lg font-semibold">Edit profile</h2>
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
        <input
          name="age"
          type="number"
          min="18"
          max="100"
          placeholder="Age"
          className="input w-full"
          value={form.age}
          onChange={update}
        />
        <input
          name="photoUrl"
          type="url"
          placeholder="Photo URL (https://...)"
          className="input w-full"
          value={form.photoUrl}
          onChange={update}
        />
        <select
          name="gender"
          className="select w-full"
          value={form.gender}
          onChange={update}
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          name="title"
          placeholder="Title (e.g. AI Engineer, Frontend Engineer)"
          className="input w-full"
          maxLength={100}
          value={form.title}
          onChange={update}
        />
        <textarea
          name="about"
          placeholder="About you"
          className="textarea w-full"
          rows={4}
          maxLength={1000}
          value={form.about}
          onChange={update}
        />
        <input
          name="skills"
          placeholder="Skills, comma separated (React, Node.js, MongoDB)"
          className="input w-full"
          value={form.skills}
          onChange={update}
        />
        {status.text && (
          <div className={`alert ${alertClass[status.type]} text-sm`}>
            {status.text}
          </div>
        )}
        <button className="btn btn-primary">Save</button>
      </form>
      {/* live preview of how others see you in their feed */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm opacity-60">Preview</span>
        <UserCard user={{ ...form, skills: parseSkills(form.skills) }} />
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState({ type: "", text: "" });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    try {
      await api.patch("/profile/password", form);
      setForm({ currentPassword: "", newPassword: "" });
      setStatus({ type: "success", text: "Password updated" });
    } catch (err) {
      setStatus({ type: "error", text: errorMessage(err) });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <h2 className="text-lg font-semibold">Change password</h2>
      <input
        name="currentPassword"
        type="password"
        placeholder="Current password"
        className="input w-full"
        value={form.currentPassword}
        onChange={update}
        required
      />
      <input
        name="newPassword"
        type="password"
        placeholder="New password"
        className="input w-full"
        value={form.newPassword}
        onChange={update}
        required
      />
      {status.text && (
        <div className={`alert ${alertClass[status.type]} text-sm`}>
          {status.text}
        </div>
      )}
      <button className="btn">Update password</button>
    </form>
  );
};

const Profile = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="flex flex-col gap-10">
      <EditProfile user={user} />
      <div className="divider" />
      <ChangePassword />
    </div>
  );
};

export default Profile;
