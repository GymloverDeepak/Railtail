import React, { useState, useEffect } from "react";
import "./Chat.css";
import axios from "axios";

function Modal({ isOpen, onClose, modalTitle = "", id = "" }) {
  const [message, setMessage] = useState("");
  const envAPI_URL = import.meta.env.VITE_API_URL;
  const [result, setResult] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [task, setTask] = useState("");
  const [botChat, setBotChat] = useState([
    { type: "bot", text: "Hello! How can I assist you today?" },
    { type: "user", text: "I need some help with my project." },
    { type: "bot", text: "Sure, please share the details." },
  ]);

  const suggestions = [
    'count of unique vendors.',
    'Provide summary about the data inserted in 100 words.',
    'Name of top vendor',
    'Highest value Tender no',
    'Highest value PO'
  ];

  const handleSend = () => {
    chatBotResponse(task);
  };

  const chatBotResponse = (input) => {
    // Make sure you're passing the input to the API
    axios
      .post(`${envAPI_URL}/ask`, { task: task })
      .then((response) => {
        console.log("Bot response: ", response);
        // You can handle the response data here
        // setPurchaseData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };

  useEffect(() => {
    chatBotResponse(task);
  }, [botChat]);

  // Function to handle the click of a suggestion
  const handleSuggestionClick = (suggestion) => {
    setTask(suggestion);
  };

  return (
    isOpen && (
      <div
        className="modal modal-show"
        id={id}
        tabIndex="-1"
        role="dialog"
        aria-hidden={!isOpen}
      >
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title bot-title">{modalTitle}</h5>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onClose(!isOpen)}
              >
                Close
              </button>
            </div>

            {/* Suggestions Section moved to the top */}
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

            <div className="modal-body chat-container d-flex flex-column">
              {botChat.map((chat, index) => (
                <div key={index} className={`chat-bubble chat-${chat.type}`}>
                  {chat.text}
                </div>
              ))}
            </div>

            <div className="modal-footer chat-footer">
              {/* Input field for task */}
              <input
                type="text"
                placeholder="Type a message..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
