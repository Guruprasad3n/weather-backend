import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../AiContent/AiText/ai.css";

const Chat = async (input) => {
  const { data } = await axios.post("http://localhost:8000/get-response", {
    message: input,
  });
  console.log(data)
  return data;
};

const Weather = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setloading] = useState(false);
  const ref = useRef(null); // Create a ref for the conversation container

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];

    try {
      setloading(true);
      const data = await Chat(input);
      const assistantMessage = { role: "assistant", content: data };
      updatedMessages.push(assistantMessage); // Add the assistant's response to the messages
    } catch (error) {
      console.error("Error in chat:", error);
      // Handle the error as needed (e.g., show an error message to the user)
    } finally {
      setMessages(updatedMessages); // Update the messages state with both user and assistant messages
      setloading(false);
      setInput("");
    }
  };

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when messages change
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
   <>
    <div className="">
      <h1 style={{ textAlign: "center" }}>AiText</h1>
     <div className="scroll-Container">

     <div 
        ref={ref}
        className=""
        style={{
          maxHeight: "600px",
          overflowY: "scroll",
        }}
      >
        {messages.length
          ? messages.map((el, i) => (
              <div key={i} className="message">
                <p>
                  <span>{el.role}: </span>
                  {el.content}
                </p>
              </div>
            ))
          : "Please start your conversation"}
      </div>

     

     </div>

      <div className="input-btn">
        <input
          type="text"
          onChange={(e) => handleInput(e)}
          value={input}
          placeholder="Ask Something to me"
        />
        <button
          type="submit"
          onClick={(e) => {
            setMessages([...messages, { role: "user", content: input }]);
            handleSubmit(e);
          }}
        >
           {loading ? "Wait For Response":"Submit"}
        </button>
      </div>
    </div>
   </>
  );
};

export default Weather;
