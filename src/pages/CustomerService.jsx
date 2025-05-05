import { useState, useEffect, useRef } from "react";
import {
  SendHorizontal,
  Phone,
  Video,
  Info,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Smile,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { useAuth } from "../context/AuthContext";
import { addMessage, findUserByEmail } from "../services/userService";

export default function ModernCustomerSupport() {
  const { user, setUser } = useAuth();
  const messagesEndRef = useRef(null);
  const [input, setInput] = useState("");
  const [lastSavedState, setLastSavedState] = useState(null);
  // Track whether an auto-reply has been sent in this session
  const [autoReplySent, setAutoReplySent] = useState(false);

  const messages = user.messages;

  // Periodically check user data against source and update localStorage every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!user || !user.email) return;

      // Find the latest user data from the source
      const latestUserData = await findUserByEmail(user.email);
      console.log(latestUserData);

      if (!latestUserData) {
        console.warn("User not found in database during periodic check");
        return;
      }

      // Remove password for security before comparing
      const { password: _, ...safeLatestUser } = latestUserData;

      // Get current state from localStorage
      const currentStoredUser = localStorage.getItem("currentUser")
        ? JSON.parse(localStorage.getItem("currentUser"))
        : null;

      // Compare latest source data with current user state
      const latestUserString = JSON.stringify(safeLatestUser);
      const currentUserString = JSON.stringify(user);
      const storedUserString = currentStoredUser
        ? JSON.stringify(currentStoredUser)
        : null;

      // Update state if source data is different from current state
      if (latestUserString !== currentUserString) {
        console.log("Source data changed - updating user state");
        setUser(safeLatestUser);
      }

      // Update localStorage if it's different from current state
      if (currentUserString !== storedUserString) {
        console.log("Updating localStorage with current user state");
        localStorage.setItem("currentUser", currentUserString);
      }
    }, 3000); // Check every 3 seconds

    // Clean up the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [user, setUser]);

  // Update the messages list and persist to backend
  const updateMessages = (updater) => {
    // First update the local state
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        messages:
          typeof updater === "function" ? updater(prevUser.messages) : updater,
      };

      // Then call the backend function with only the new message
      // Not passing entire messages array
      if (typeof updater === "function") {
        // Get the latest message (last one in the array)
        const latestMessages = updater(prevUser.messages);
        const latestMessage = latestMessages[latestMessages.length - 1];

        // Only add the new message to the backend if it's not a typing indicator
        if (
          latestMessage &&
          latestMessage !== prevUser.messages[prevUser.messages.length - 1] &&
          latestMessage.sender !== "typing"
        ) {
          addMessage(prevUser.email, latestMessage);
        }
      }

      return updatedUser;
    });
  };

  // Helper function to check if we should send an auto-reply
  const shouldSendAutoReply = () => {
    // If no auto-reply has been sent in this session, send one
    if (!autoReplySent) {
      return true;
    }

    // Find the last message
    const userMessages = messages.filter((m) => m.sender === "user");
    const agentMessages = messages.filter((m) => m.sender === "agent");

    if (userMessages.length === 0) return false;

    // If there are no agent messages yet, send an auto-reply
    if (agentMessages.length === 0) return true;

    // Check if the last user message was sent more than 2 hours ago
    const lastUserMessageTime = new Date(
      userMessages[userMessages.length - 1].timestamp
    );
    const lastAgentMessageTime = new Date(
      agentMessages[agentMessages.length - 1].timestamp
    );

    // If user's message is more recent than agent's last message
    if (lastUserMessageTime > lastAgentMessageTime) {
      const currentTime = new Date();
      const timeDifference = currentTime - lastUserMessageTime;
      const twoHoursInMs = 2 * 60 * 60 * 1000;

      // If the time difference is more than 2 hours
      return timeDifference >= twoHoursInMs;
    }

    return false;
  };

  const handleSendMessage = (e) => {
    if (!input.trim()) return;

    const currentTime = new Date();
    const timeString = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      id: Date.now(), // Using timestamp for unique ID
      sender: "user",
      text: input,
      time: timeString,
      timestamp: currentTime.getTime(), // Store actual timestamp for time calculations
    };

    // Add user's message
    updateMessages((prev) => [
      ...prev.filter((m) => m.sender !== "typing"),
      newMessage,
    ]);
    setInput("");

    // Check if we should send an auto-reply
    if (shouldSendAutoReply()) {
      // Create a temporary typing indicator (UI only)
      const typingIndicator = {
        id: `typing-${Date.now()}`,
        sender: "typing",
        name: "Emma Thompson",
        text: "",
        time: timeString,
      };

      // Show typing indicator in UI only (not persisted)
      setTimeout(() => {
        // Add typing indicator only to UI state
        setUser((prevUser) => ({
          ...prevUser,
          messages: [...prevUser.messages, typingIndicator],
        }));

        setTimeout(() => {
          // Create the actual agent response
          const responseTime = new Date();
          const agentResponse = {
            id: Date.now(),
            sender: "agent",
            name: "Emma Thompson",
            text: "Thank you for reaching out to our support team. An agent will review your request and respond shortly. We appreciate your patience.",
            time: responseTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: responseTime.getTime(), // Store actual timestamp for time calculations
          };

          // Remove typing indicator and add actual response
          updateMessages((prev) => {
            const withoutTyping = prev.filter((m) => m.sender !== "typing");
            return [...withoutTyping, agentResponse];
          });

          // Mark that we've sent an auto-reply in this session
          setAutoReplySent(true);
        }, 2500);
      }, 1000);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header - Fixed at the top */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="p-3 flex items-center">
            <Link to={-1} className="md:hidden p-2 text-gray-300">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-300">
                  ET
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div>
                <h3 className="font-medium text-white">Emma Thompson</h3>
                <p className="text-xs text-green-400">
                  Customer Service • Online
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center space-x-3">
              <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600">
                <Phone size={16} />
              </button>
              <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600">
                <Video size={16} />
              </button>
              <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600">
                <Info size={16} />
              </button>
              <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area - Scrollable middle section */}
      <div
        className="flex-1 overflow-y-auto bg-gray-850"
        style={{ height: "calc(100vh - 140px)", backgroundColor: "#1a1d21" }}
      >
        <div className="max-w-3xl mx-auto space-y-4 p-4">
          {/* Date separator */}
          <div className="flex justify-center">
            <div className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
              Today
            </div>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "agent" && (
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 mr-2 mt-1">
                  ET
                </div>
              )}

              {message.sender === "typing" ? (
                <div className="bg-gray-800 p-3 rounded-lg shadow-md max-w-xs md:max-w-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div
                  className={`p-3 rounded-lg shadow-md max-w-xs md:max-w-md ${
                    message.sender === "user"
                      ? "bg-blue-700 text-white rounded-br-none"
                      : "bg-gray-800 text-gray-200 rounded-bl-none"
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-200"
                        : "text-gray-400"
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - Fixed at the bottom */}
      <div className="bg-gray-800 shadow-md p-3 sticky bottom-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center">
          <button className="p-2 text-gray-400 hover:text-gray-200">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 mx-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-700 bg-gray-700 text-gray-200 placeholder-gray-400"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-200">
            <Smile size={20} />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={`p-2 rounded-full ${
              input.trim() ? "text-blue-400 hover:bg-gray-700" : "text-gray-500"
            }`}
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
