import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
const Header = ({ active, setActive, user, handleLogout, adminID }) => {
  const userId = user?.uid;

  const navigate = useNavigate();
  const gotohome = async (cat) => {
    if (cat === "home") {
      navigate("/");
      window.location.reload(true);
    } else {
      navigate(`/home/${cat}`);
      window.location.reload(true);
    }
  };
  const gotocreate = async () => {
    if (!user.emailVerified) {
      toast("Please Verify Your Email");
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid bg-faded padding-media">
        <div className="container padding-media">
          <nav className="navbar navbar-toggleable-md navbar-light">
            <button
              className="navbar-toggler mt-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              data-bs-parent="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="true"
              aria-label="Toggle Navigation"
            >
              <span className="fa fa-bars"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li
                  className={`nav-item nav-link ${
                    active === "home" ? "active" : ""
                  }`}
                  onClick={() => gotohome("home")}
                >
                  Home
                </li>

                <Navbar.Collapse id="navbar-dark-example">
                  <Nav>
                    <NavDropdown
                      id="nav-dropdown-dark-example"
                      title="Write"
                      menuVariant="dark"
                    >
                      <NavDropdown.Item onClick={() => gotohome("Food")}>
                        Post
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => gotohome("Technology")}>
                        Book
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>

                <Link to="/create" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "create" ? "active" : ""
                    }`}
                    onClick={() => gotocreate()}
                  >
                    Create
                  </li>
                </Link>
                <Link to="/about" style={{ textDecoration: "none" }}>
                  <li
                    className={`nav-item nav-link ${
                      active === "about" ? "active" : ""
                    }`}
                    onClick={() => setActive("about")}
                  >
                    About
                  </li>
                </Link>

                <Navbar.Collapse id="navbar-dark-example">
                  <Nav>
                    <NavDropdown
                      id="nav-dropdown-dark-example"
                      title="Category"
                      menuVariant="dark"
                    >
                      <NavDropdown.Item onClick={() => gotohome("Food")}>
                        Food
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => gotohome("Technology")}>
                        Technology
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>

                {userId === adminID ? (
                  <Link to="/admin" style={{ textDecoration: "none" }}>
                    <li
                      className={`nav-item nav-link ${
                        active === "admin" ? "active" : ""
                      }`}
                      onClick={() => setActive("admin")}
                    >
                      Admin
                    </li>
                  </Link>
                ) : (
                  <></>
                )}
              </ul>
              <div className="row g-3">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  {userId ? (
                    <>
                      <div className="profile-logo">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          alt="logo"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            marginTop: "12px",
                          }}
                        />
                      </div>
                      <Link to="/user" style={{ textDecoration: "none" }}>
                        <p style={{ marginTop: "12px", marginLeft: "5px" }}>
                          {user?.displayName}
                        </p>
                      </Link>
                      <li className="nav-item nav-link" onClick={handleLogout}>
                        Logout
                      </li>
                    </>
                  ) : (
                    <Link to="/auth" style={{ textDecoration: "none" }}>
                      <li
                        className={`nav-item nav-link ${
                          active === "login" ? "active" : ""
                        }`}
                        onClick={() => setActive("login")}
                      >
                        Login
                      </li>
                    </Link>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Header;
