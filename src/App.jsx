import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Requests from "./components/Requests";
import Connections from "./components/Connections";
import Profile from "./components/Profile";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Body />}>
        <Route index element={<Feed />} />
        <Route path="requests" element={<Requests />} />
        <Route path="connections" element={<Connections />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
