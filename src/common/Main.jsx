import React, { useState } from 'react'
import Dashboard from './Dashboard';
import Modal from './Modal';

function Main({ showPageTitle = true }) {
    const [showBot, setShowBot] = useState(false);
    return (<>
        <main id="main" className="main" style={{width:"100%"}}>
        {showPageTitle && (
  <div className="pagetitle">
    <section className="section dashboard">
      <div
        className="d-flex justify-content-between align-items-center mt-2 mb-2"
        style={{ paddingBottom: "5px" }}
      >
        <h1 className="card-title">Dashboard</h1> {/* Added text "Dashboard" here */}
        <button
          className="btn btn-primary"
          type="button"
          id="ask_buddy"
          onClick={() => setShowBot(!showBot)}
        >
          Ask Buddy
        </button>
      </div>
    </section>
  </div>
)}
            <Modal isOpen={showBot} onClose={setShowBot} modalTitle="Ask Buddy" id='buddy'/>
        </main>
        <Dashboard/>
        </>
    )
}

export default Main
