import React, { useState,useEffect } from "react";
import Dashboard from "./Dashboard";
import Modal from "./Modal";
import axios from "axios";

function Main({ showPageTitle = true }) {
 const envAPI_URL = import.meta.env.VITE_API_URL;
  const [showBot, setShowBot] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
      <main id="main" className="main" style={{ width: "100%" }}>
        {showPageTitle && (
          <div className="pagetitle">
            <section className="section dashboard">
              <div
                className="d-flex justify-content-between align-items-center mt-2 mb-2"
                style={{ paddingBottom: "5px" }}
              >
                <h1 className="card-title ms-0">Dashboard</h1>
                <div className="d-flex align-items-center ms-auto">
                  <label htmlFor="startDate" className="form-label me-2"
                   style={{minWidth: "75px"}}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="form-control me-3"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ minWidth: "100px" }}
                  />
                  <label htmlFor="endDate" className="form-label me-2"
                   style={{minWidth: "75px"}}>
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control me-3"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ minWidth: "100px"}}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  id="ask_buddy"
                  onClick={() => setShowBot(!showBot)}
                  style={{ height: "38px" }}
                >
                  Mr.Assistance
                </button>
              </div>
            </section>
          </div>
        )}
        <Modal
          isOpen={showBot}
          onClose={setShowBot}
          modalTitle="Ask Buddy"
          id="buddy"
        />
      </main>
      <Dashboard startDate={startDate} endDate={endDate} />
    </>
  );
}

export default Main;
