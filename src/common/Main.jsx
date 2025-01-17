import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Modal from "./Modal";

function Main({ showPageTitle = true }) {
  const [showBot, setShowBot] = useState(false);
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  return (
    <>
      <main id="main" className="main" style={{ width: "100%" }}>
        {showPageTitle && (
            <div className="pagetitle">
  <section className="section dashboard">
    <div className="d-flex justify-content-between align-items-center mt-2 mb-2" style={{ paddingBottom: "5px" }}>
      <h1 className="card-title ms-0">Dashboard</h1> {/* ms-0 to ensure the title is aligned to the left */}

      <div className="d-flex align-items-center ms-auto"> {/* ms-auto to push this div to the right */}
        <label htmlFor="startDate" className="form-label me-2">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          className="form-control me-3"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ maxWidth: '200px' }} 
        />

        <label htmlFor="endDate" className="form-label me-2">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          className="form-control me-3"
          value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
          style={{ maxWidth: '200px' }} 
        />
      </div>
      <button
        className="btn btn-primary"
        type="button"
        id="ask_buddy"
        onClick={() => setShowBot(!showBot)}
        style={{ height: '38px' }}
      >
        Mr. Assistant
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
      <Dashboard startDate={startDate} endDate={endDate}/>
    </>
  );
}

export default Main;
