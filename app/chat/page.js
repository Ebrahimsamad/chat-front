"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { FaSignOutAlt } from "react-icons/fa"; // Import the logout icon

const socket = io("http://localhost:3000/");

const Chat = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && user) {
      const newMessage = {
        username: user.fullName || "Unknown User",
        message: message.trim(),
        time: new Date().toISOString(),
        avatar: user.IDImage || "/default-avatar.png",
      };
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data from local storage
    localStorage.removeItem("token"); // Clear user data from local storage
    router.push("/login"); // Redirect to the login page
  };

  return (
    <div className="flex h-screen bg-light-blue">
      <div className="w-1/4 bg-white shadow-lg p-4">
        <h2 className="text-lg font-bold mb-4">Chats</h2>
        <div className="search-bar mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Search or start new chat"
          />
        </div>
        <div className="chat-list">
          <div className="flex items-center mb-4 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
            <img
              src={user?.IDImage || "/default-avatar.png"}
              alt="Avatar"
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex flex-col">
              <span className="font-semibold">
                {user?.fullName || "Unknown User"}
              </span>
              {/* <span className="text-sm text-gray-500">{lastMessage}</span> */}
            </div>
            <span className="ml-auto text-sm text-gray-500">08:00 AM</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center mt-4 p-2 hover:bg-gray-200 rounded-lg w-full"
        >
          <FaSignOutAlt className="mr-2" /> {/* Logout Icon */}
          Logout
        </button>
      </div>

      <div className="w-3/4 bg-white flex flex-col">
        <div className="chat-header p-4 bg-light-blue border-b">
          <h2 className="text-lg font-semibold">{user?.fullName || "Chat"}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-chat-bg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-3 rounded-lg max-w-[70%] flex flex-col ${
                msg.message.username === user?.fullName
                  ? "bg-green-500 text-white ml-auto"
                  : "bg-gray-200 text-black mr-auto"
              }`}
            >
              <div className="flex items-center mb-2">
                <img
                  src={msg.message.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <h1 className="font-bold text-sm">
                  {msg.message.username || "Unknown User"}
                </h1>
              </div>
              <p className="text-md">
                {typeof msg.message.message === "string"
                  ? msg.message.message
                  : "Message not available"}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex items-center bg-light-blue">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
