import { useState, useEffect } from "react";
import "./App.css";
import "./style.scss";
import "./media-query.css";
import Home from "./pages/Home";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Detail from "./pages/Detail";
import AddEditBlog from "./pages/AddEditBlog";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

import Admin from "./pages/Admin";

import UserProfilePage from "./pages/UserProfilePage";

function App() {
  const [active, setActive] = useState("home");
  const [user, setUser] = useState(null);
  const adminID = "nTphmr7G6FUrHHtxOKGMZEg7ENi2";
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setActive("login");
      navigate("/auth");
    });
  };

  return (
    <div className="App">
      <Header
        setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout}
        adminID={adminID}
      />
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route
          path="/"
          element={<Home setActive={setActive} user={user} adminID={adminID} />}
        />
        <Route
          path="/home/:cat"
          element={<Home setActive={setActive} user={user} adminID={adminID} />}
        />
        <Route
          path="/admin"
          element={
            <Admin setActive={setActive} user={user} adminID={adminID} />
          }
        />
        <Route
          path="/user"
          element={
            <UserProfilePage
              setActive={setActive}
              user={user}
              adminID={adminID}
            />
          }
        />
        <Route path="/" element={<Home setActive={setActive} user={user} />} />
        <Route
          path="/detail/:id"
          element={
            <Detail setActive={setActive} user={user} adminID={adminID} />
          }
        />
        <Route
          path="/create"
          element={
            user?.uid && user.emailVerified ? (
              <AddEditBlog user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/update/:id"
          element={
            user?.uid ? (
              <AddEditBlog user={user} setActive={setActive} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/auth"
          element={<Auth setActive={setActive} setUser={setUser} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
