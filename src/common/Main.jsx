import React, { useState } from 'react'
import Dashboard from './Dashboard';
import Modal from './Modal';

function Main({ showPageTitle = false }) {
    const [showBot, setShowBot] = useState(false);
    return (<>
        <main id="main" className="main">
            {showPageTitle && <div className="pagetitle">
                <h1>Dashboard</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                </nav>
            </div>}
            <section className="section dashboard">
                <div className='d-flex justify-content-between align-items-center mt-2 mb-2' style={{ paddingBottom: "5px" }}>
                    <h5 className="card-title"></h5>
                    <button className='btn btn-primary' type='button' id="ask_buddy" onClick={() => setShowBot(!showBot)}>Ask Buddy</button>
                </div>
            </section>
            <Dashboard/>
            <Modal isOpen={showBot} onClose={setShowBot} modalTitle="Ask Buddy" id='buddy'/>
        </main>
        
        </>
    )
}

export default Main
