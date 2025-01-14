import React, { useState } from "react";
import "./Chat.css";

function Modal({ isOpen, onClose, modalTitle = "", id = "" }) {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { type: "bot", text: "Hello! How can I assist you today?" },
        { type: "user", text: "I need some help with my project." },
        { type: "bot", text: "Sure, please share the details." },
    ]);

    const handleSend = () => {
        if (message.trim()) {
            setChatHistory([...chatHistory, { type: "user", text: message }]);
            setMessage("");
        }
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
                        <div className="modal-body chat-container d-flex flex-column">
                            {chatHistory.map((chat, index) => (
                                <div
                                    key={index}
                                    className={`chat-bubble chat-${chat.type}`}
                                >
                                    {chat.text}
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer chat-footer">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
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
