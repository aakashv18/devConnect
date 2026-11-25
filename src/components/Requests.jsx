import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { errorMessage } from "../utils/api";
import Avatar from "./Avatar";
import { removeRequest, setRequests } from "../store/requestsSlice";
import { clearConnections } from "../store/connectionsSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/user/requests")
      .then((res) => dispatch(setRequests(res.data.data)))
      .catch((err) => setError(errorMessage(err)));
  }, [dispatch]);

  const reviewRequest = async (status, requestId) => {
    setError("");
    try {
      await api.post(`/request/review/${status}/${requestId}`);
      dispatch(removeRequest(requestId));
      // a new connection exists, so the cached list is stale
      if (status === "accepted") dispatch(clearConnections());
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  if (!requests) {
    return error ? (
      <div className="alert alert-error">{error}</div>
    ) : (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Requests</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      {requests.length === 0 ? (
        <p className="opacity-70">No pending requests.</p>
      ) : (
        <ul className="list bg-base-200 rounded-box">
          {requests.map(({ _id, fromUserId: from }) => (
            <li key={_id} className="list-row items-center">
              <Avatar user={from} />
              <div>
                <div className="font-semibold">
                  {from.firstName} {from.lastName}
                </div>
                {from.title && (
                  <div className="text-primary text-sm">{from.title}</div>
                )}
                <div className="text-sm capitalize opacity-70">
                  {[from.age, from.gender].filter(Boolean).join(", ")}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => reviewRequest("rejected", _id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => reviewRequest("accepted", _id)}
                >
                  Accept
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Requests;
