import React, { useState, useEffect } from "react";
import Profile from "../assets/img/profile-img.jpg";
import logo from "../assets/img/logo.png";
import railtel from "../assets/img/railtel.png";
import communications from "../assets/img/communications.png";
import Dashboard from "./Dashboard";
import axios from "axios";
import Modal from "./Modal";
function Header() {
  const envAPI_URL = import.meta.env.VITE_API_URL;
  const [showBot, setShowBot] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;// Today's date in YYYY-MM-DD format

    if (selectedDate > today) {
      return;
    }

    if (endDate && selectedDate > endDate) {
      alert("Start date cannot be later than the end date.");
      return;
    }

    setStartDate(selectedDate);
  };
  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;

    if (selectedDate > today) {
      return;
    }

    if (startDate && selectedDate < startDate) {
      alert("End date cannot be earlier than the start date.");
      return;
    }

    setEndDate(selectedDate);
  };
  const defaultDate = () => {
    axios
      .get(`${envAPI_URL}/default-dates`)
      .then((response) => {
        setStartDate(response.data.start_date);
        setEndDate(response.data.end_date);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  useEffect(() => {
    defaultDate();
  }, []);

  return (
    <>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center"
      >
        <div className="topbar">
          <div className="d-flex align-items-center justify-content-between">
            <img src={railtel} alt="" style={{height:"62px",width:"81px",borderRadius:"2px"}} />
          </div>

          {/* <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle " href="#">
                <i className="bi bi-search"></i>
              </a>
            </li>
            <li className="nav-item dropdown pe-3">
              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                <img src={Profile} alt="Profile" className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">Demo user</span>
              </a>
      
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>Demo user</h6>
                  <span>User</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
      
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
      
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
      
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
      
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav> */}

          {/* Add Inputs and Button here */}
          <div className="d-flex align-items-center">
            <label
              htmlFor="startDate"
              className="form-label me-2"
            >
              From
            </label>
            <input
                type="date"
                id="startDate"
                className="form-control me-3"
                value={startDate}
                max={today}
                onChange={handleStartDateChange}
                onFocus={handleStartDateChange} // Trigger when the calendar is opened
                onClick={handleStartDateChange} // Optionally, also trigger on click
                style={{ width: "150px" }}
              />

            <label
              htmlFor="endDate"
              className="form-label me-2"
            >
              To
            </label>
            <input
              type="date"
              id="endDate"
              className="form-control me-3"
              value={endDate}
              min={startDate}
              max={today}
              onChange={handleEndDateChange}
              style={{ width: "150px" }}
            />
           <button
              className=""
              type="button"
              id="ask_buddy"
              onClick={() => setShowBot(!showBot)}
              style={{
                height: "38px",
                width: "38px", /* Make width equal to height for a circular button */
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "20%", 
                marginRight: "8px",
              }}
            >
              <img
                src={communications}
                alt="Assistant Icon"
                style={{
                  width: "100%", /* Adjust size to fit the button */
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </button>

          </div>
        </div>
      </header>
      <Modal
        isOpen={showBot}
        onClose={setShowBot}
        modalTitle="Ask Buddy"
        id="buddy"
      />
      <Dashboard startDate={startDate} endDate={endDate} />
    </>
  );
}

export default Header;
