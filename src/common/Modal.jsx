import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import axios from "axios";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading.json"; // Add a Lottie JSON file for animation

function Modal({ isOpen, onClose, id = "" }) {
  const envAPI_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState("");
  const [botChat, setBotChat] = useState([{ type: "", text: "" }]);

  const suggestions = [
    "Count of vendors",
    "Provide a summary about the data in 100 words",
    "Name of the top vendor",
    "POs issued in last month",
    "Highest value PO",
  ];

  const chatContainerRef = useRef(null);

  const handleSend = () => {
    if (!task.trim()) return;
    chatBotResponse(task);
    setTask("");
  };

  const chatBotResponse = (task) => {
    setLoading(true);
    axios
      .post(`${envAPI_URL}/ask`, { task: task })
      .then((response) => {
        if (response.status === 200) {
          const botMessage = response.data.response || "";
          setBotChat([
            ...botChat,
            { type: "user", text: task },
            { type: "bot", text: botMessage },
          ]);
        }
        setTask("");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
        setBotChat([
          ...botChat,
          { type: "user", text: task },
          { type: "bot", text: "Unable to understand the query" },
        ]);
        setLoading(false);
      });
  };

  const handleSuggestionClick = (suggestion) => {
    setTask(suggestion);
    chatBotResponse(suggestion);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset scroll when modal closes
    };
  }, [isOpen, botChat]);

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal modal-show" id={id} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title bot-title" style={{ fontSize: "20px" }}>
                  My Assistant
                </h5>
                <button type="button" className="btn btn-secondary" onClick={() => onClose(!isOpen)}>
                  Close
                </button>
              </div>

              <div ref={chatContainerRef} className="modal-body chat-container d-flex flex-column">
                {botChat.map((chat, index) => (
                  <div
                    key={index}
                    className={`chat-bubble chat-${chat.type}`}
                    {...(chat.type === "bot"
                      ? { dangerouslySetInnerHTML: { __html: chat.text } }
                      : {})}
                  >
                    {chat.type !== "bot" ? chat.text : null}
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="suggestions-container">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item" 
                  disabled={loading}
                  style={{ backgroundColor: "#5D76A9", color: "white" }}
                   onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                    
                  </div>
                ))}
              </div>

              {/* Loading Animation */}
              {loading && (
                <div className="loading-container">
                  <Lottie animationData={loadingAnimation} loop={true} style={{ width: "100px", height: "100px" }} />
                </div>
              )}

              <div className="modal-footer chat-footer">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={task}
                  disabled={loading}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button type="button" disabled={loading} onClick={handleSend}>
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Modal;
