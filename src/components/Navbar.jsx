import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import Avatar from "./Avatar";
import { clearUser } from "../store/userSlice";
import { clearFeed } from "../store/feedSlice";
import { clearRequests } from "../store/requestsSlice";
import { clearConnections } from "../store/connectionsSlice";

const links = [
  { to: "/", label: "Feed" },
  { to: "/requests", label: "Requests" },
  { to: "/connections", label: "Connections" },
];

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } finally {
      // drop cached data so the next login doesn't see this user's lists
      dispatch(clearUser());
      dispatch(clearFeed());
      dispatch(clearRequests());
      dispatch(clearConnections());
      navigate("/login");
    }
  };

  return (
    <div className="navbar bg-base-200 px-4 shadow-sm">
      <div className="flex-1">
        <NavLink to="/" className="text-xl font-bold">
          devConnect
        </NavLink>
      </div>
      <ul className="menu menu-horizontal hidden gap-1 sm:flex">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink to={to} end className={({ isActive }) => (isActive ? "menu-active" : "")}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      {user && (
        <div className="dropdown dropdown-end ml-2">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <Avatar user={user} size="w-10" />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li className="menu-title">Hi, {user.firstName}</li>
            {links.map(({ to, label }) => (
              <li key={to} className="sm:hidden">
                <NavLink to={to}>{label}</NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
