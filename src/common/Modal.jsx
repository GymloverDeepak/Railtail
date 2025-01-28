import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import axios from "axios";
import SpinnerLoader from "./SpinnerLoader";

function Modal({ isOpen, onClose, id = "" }) {
  const [message, setMessage] = useState("");
  const envAPI_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [task, setTask] = useState("");
  const [botChat, setBotChat] = useState([
    { type: "", text: "" }
  ]);

  const suggestions = [
    "count of vendors",
    "Provide summary about the data in 100 words",
    "Name of top vendor",
    "Highest value Tender no",
    "Highest value PO",
  ];

  const chatContainerRef = useRef(null);

  const handleSend = () => {
    if (!task.trim()) return; // Prevent sending empty messages
    chatBotResponse(task);
    setTask(""); // Clear the input after sending
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
        setLoading(false); // Stop loading on error
      });
  };
  const handleSuggestionClick = (suggestion) => {
    setTask(suggestion);
    chatBotResponse(suggestion);
  };
  // Scroll to the bottom of the chat container when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [botChat]);

  return (
    isOpen && (
      <div
        className="modal modal-show"
        style={{ width: "100%" }}
        id={id}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!isOpen}
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title bot-title" style={{ fontSize: "20px" }}>
                My Assistant
              </h5>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onClose(!isOpen)}
              >
                Close
              </button>
            </div>

            <div
              ref={chatContainerRef}
              className="modal-body chat-container d-flex flex-column"
            >
              {botChat.map((chat, index) => (
                <div key={index} className={`chat-bubble chat-${chat.type}`}>
                  {chat.text}
                </div>
              ))}
            </div>

            {showSuggestions && (
              <div className="suggestions-container">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}

            {/* Loading spinner */}
            {loading && <SpinnerLoader />}

            <div className="modal-footer chat-footer">
              <input
                type="text"
                placeholder="Type a message..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button type="button" onClick={handleSend}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Modal;
