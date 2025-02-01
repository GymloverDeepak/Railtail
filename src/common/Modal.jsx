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
    "Highest value Tender No",
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
  }, [botChat]);

  return (
    isOpen && (
      <div className="modal modal-show" style={{ width: "100%" }} id={id} tabIndex="-1" role="dialog">
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
                <div key={index} className="suggestion-item" style={{backgroundColor:"#5D76A9",color:"white"}} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion}
                </div>
              ))}
            </div>

            {/* New Animated Loading */}
            {loading && (
  <div className="loading-container">
    <Lottie 
      animationData={loadingAnimation} 
      loop={true} 
      style={{ width: "100px", height: "100px" }}
      renderSettings={{
        // Change stroke or fill color if applicable
        fillColor: "#FF5733", // Customize color here
      }}
    />
  </div>
)}



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
