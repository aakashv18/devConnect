import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { errorMessage } from "../utils/api";
import UserCard from "./UserCard";
import { removeFromFeed, setFeed } from "../store/feedSlice";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // always page 1: the backend hides anyone we've already acted on, so
  // the next unseen people are always at the start
  const loadFeed = useCallback(async () => {
    try {
      const res = await api.get("/user/feed", { params: { limit: 10 } });
      dispatch(setFeed(res.data.data));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [dispatch]);

  // refill once the last card is acted on
  const isEmpty = !feed || feed.length === 0;
  useEffect(() => {
    if (isEmpty) loadFeed();
  }, [isEmpty, loadFeed]);

  const sendRequest = async (status, userId) => {
    setError("");
    setSending(true);
    try {
      await api.post(`/request/send/${status}/${userId}`);
      dispatch(removeFromFeed(userId));
    } catch (err) {
      // 409 means a request already exists, so they don't belong in the feed
      if (err.response?.status === 409) dispatch(removeFromFeed(userId));
      else setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  };

  if (!feed) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <p className="py-20 text-center opacity-70">
        No new developers right now. Check back later.
      </p>
    );
  }

  const user = feed[0];
  return (
    <div className="flex flex-col items-center gap-4">
      {error && <div className="alert alert-error">{error}</div>}
      <UserCard
        user={user}
        actions={
          <>
            <button
              className="btn btn-outline"
              disabled={sending}
              onClick={() => sendRequest("ignored", user._id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-primary"
              disabled={sending}
              onClick={() => sendRequest("interested", user._id)}
            >
              Interested
            </button>
          </>
        }
      />
    </div>
  );
};

export default Feed;
