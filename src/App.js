// Create a react component that inputs a text area message then performs a fetch request to localhost:3001, gets back a response as a data.message and displays that message in a box below
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
// import logo from "./logo.svg";
import "./normalize.css";

function App() {
  const [input, setInput] = useState("");
  const [response] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      role: "gpt",
      content:
        "Tell me everything about the forecast you want to create. Or I can guide you through the process step by step.",
    },
    // { role: "me", content: "I want to forecast revenue for a new drug" },
  ]); // [ {role: "user", content: "Hello World"}, {role: "assistant", content: "I am an AI"}

  const chatLogEndRef = useRef(null); // Ref for scrolling to the bottom
  const textareaRef = useRef(null); // Corrected position

  useEffect(() => {
    chatLogEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]); // Dependency on chatLog to trigger scroll on update

  // clear the chat log
  function clearChatLog() {
    setChatLog((chatLog) => []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newUserMessage = { role: "me", content: input };
    setChatLog((currentChatLog) => [...currentChatLog, newUserMessage]);
    setInput("");

    // fetch response to the api combining the chat log array of messages and sending it as a message to localhost:3001 as a post

    try {
      const response = await fetch(`${process.env.REACT_APP_OPENAI_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: [...chatLog, newUserMessage]
            .map((msg) => msg.content)
            .join(" "),
        }),
      });

      const data = await response.json();
      setChatLog((currentChatLog) => [
        ...currentChatLog,
        { role: "gpt", content: data.message },
      ]);
    } catch (error) {
      console.error("Failed to fetch response from OpenAI:", error);
    }
  }
  const handleInputChange = (e) => {
    // Your input change logic here
    const textarea = textareaRef.current;
    setInput(e.target.value);
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="App">
      <aside className="sidemenu">
        <h1>Forecast Structure</h1>
        <div className="sidemenu-button" onClick={clearChatLog}>
          <span>+</span>Add Forecast Element
        </div>
      </aside>
      <section className="chatbox">
        <h1>Chat with Fuzzy</h1>

        <div className="chat-log">
          {chatLog.map((content, index) => (
            <ChatMessage key={index} message={content} />
          ))}
          <div ref={chatLogEndRef} /> {/* Invisible element for scrolling */}
        </div>

        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className="chat-input-text-area"
              value={input}
              onChange={handleInputChange} // Use the modified handler here
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Tell me about your forecast model..."
              style={{ minHeight: "25px", overflow: "hidden" }} // Ensure minHeight is set for initial size
            ></textarea>
          </form>
          {/* </section><button type="submit">Submit</button>} */}
        </div>

        {response && (
          <div>
            <b>Fuzzy:</b> {response}
          </div>
        )}
      </section>
      <section className="forecast-parameters">
        <h1>Current Forecast Parameters</h1>
        <div className="forecast-parameters-box">
          <h2>Revenue</h2>
          <p>Forecasting Revenue for a new drug</p>
          <button type="submit">Generate Model</button>
        </div>
      </section>
      {/* <ChatInput /> This is where you include the ChatInput component */}
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.role === "gpt" && "chatgpt"}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.role === "gpt" && "chatgpt"}`}></div>
        <div className="message">{message.content}</div>
      </div>
    </div>
  );
};
export default App;
