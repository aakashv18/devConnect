import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { errorMessage } from "../utils/api";
import Avatar from "./Avatar";
import { setConnections } from "../store/connectionsSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/user/connections")
      .then((res) => dispatch(setConnections(res.data.data)))
      .catch((err) => setError(errorMessage(err)));
  }, [dispatch]);

  if (error) return <div className="alert alert-error">{error}</div>;

  if (!connections) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Connections</h1>
      {connections.length === 0 ? (
        <p className="opacity-70">
          No connections yet. Show interest in someone from the feed.
        </p>
      ) : (
        <ul className="list bg-base-200 rounded-box">
          {connections.map((c) => (
            <li key={c._id} className="list-row items-center">
              <Avatar user={c} />
              <div>
                <div className="font-semibold">
                  {c.firstName} {c.lastName}
                </div>
                {c.title && <div className="text-primary text-sm">{c.title}</div>}
                <div className="text-sm capitalize opacity-70">
                  {[c.age, c.gender].filter(Boolean).join(", ")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Connections;
