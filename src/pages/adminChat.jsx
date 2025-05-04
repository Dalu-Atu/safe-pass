import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Search,
  Bell,
  User,
  Send,
  Phone,
  Video,
  MoreHorizontal,
  ChevronLeft,
  Paperclip,
  SendHorizontal,
  Menu,
  MessageSquare,
} from "lucide-react";
import {
  getAllUsers,
  addMessage,
  findUserByEmail,
} from "../services/userService"; // Import user services

// Customer Service Chat Component
export default function CustomerServiceChat() {
  const [chattingUser, setChattingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState("list"); // "list" or "chat"
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Add a ref to track if we've done initial user selection
  const initialUserSelectionDone = useRef(false);

  // Format user data for the chat interface
  const formatUserForChat = useCallback((user) => {
    if (!user) return null;

    // Get the last message from the user's messages array (if any)
    const lastMessage =
      user.messages && user.messages.length > 0
        ? user.messages[user.messages.length - 1]
        : { text: "No messages yet", time: "N/A" };

    // Count unread messages (messages from users without a response are unread)
    const unreadCount = countUnreadMessages(user.messages || []);

    return {
      id: user.email, // Using email as the unique ID
      name: user.name || "Unknown User",
      status: user.status || "active", // Default to active if not specified
      avatar: user.avatar || (user.name ? user.name.substring(0, 2) : "??"),
      lastMessage: lastMessage.text,
      time: lastMessage.time,
      unread: unreadCount,
    };
  }, []);

  // Count unread messages with improved logic
  const countUnreadMessages = useCallback((messages) => {
    if (!messages || messages.length === 0) return 0;

    // Find the last user message
    const userMessages = messages.filter((m) => m.sender === "user");
    if (userMessages.length === 0) return 0;

    const lastUserMessageIndex = messages.findLastIndex(
      (m) => m.sender === "user"
    );

    // If there's no agent message after the last user message, it's unread
    const hasAgentResponseAfter = messages.some(
      (m, idx) => idx > lastUserMessageIndex && m.sender === "agent"
    );

    return hasAgentResponseAfter ? 0 : 1;
  }, []);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        // Get all users from the service
        const userData = await getAllUsers();

        if (!userData || userData.length === 0) {
          setLoading(false);
          return;
        }

        // Map users to format expected by the chat interface
        const formattedUsers = userData
          .filter((user) => user && user.email) // Filter out invalid users
          .map(formatUserForChat)
          .filter((user) => user !== null); // Filter out null results

        setUsers(formattedUsers);

        // Only select the first user by default if available and none selected
        // AND we haven't already done an initial selection
        if (
          formattedUsers.length > 0 &&
          !selectedUserId &&
          !initialUserSelectionDone.current
        ) {
          initialUserSelectionDone.current = true;
          const firstUserId = formattedUsers[0].id;
          setSelectedUserId(firstUserId);

          try {
            const userDetails = await findUserByEmail(firstUserId);
            if (userDetails) {
              setChattingUser(userDetails);
              setMessages(userDetails.messages || []);
            }
          } catch (error) {
            console.error("Error loading initial user details:", error);
          }
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();

    // Set up an interval to refresh the user list every 30 seconds
    const userListInterval = setInterval(loadUsers, 30000);

    return () => clearInterval(userListInterval);
  }, [formatUserForChat, selectedUserId]);

  // Effect to load messages when selected user changes
  useEffect(() => {
    const loadSelectedUserMessages = async () => {
      if (!selectedUserId) return;

      try {
        setLoading(true);
        const userDetails = await findUserByEmail(selectedUserId);

        if (userDetails) {
          setChattingUser(userDetails);
          setMessages(userDetails.messages || []);
        } else {
          console.warn(`User with ID ${selectedUserId} not found`);
          setMessages([]);
        }
      } catch (error) {
        console.error(
          `Error loading messages for user ${selectedUserId}:`,
          error
        );
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadSelectedUserMessages();
  }, [selectedUserId]);

  // Real-time message polling for the currently selected user
  useEffect(() => {
    if (!selectedUserId) return;

    // Store the current selectedUserId for the closure
    const currentSelectedUserId = selectedUserId;

    // Poll for new messages every 3 seconds
    const messagePollingInterval = setInterval(async () => {
      try {
        // Make sure we're still polling for the same user
        if (currentSelectedUserId !== selectedUserId) return;

        const latestUserData = await findUserByEmail(currentSelectedUserId);

        if (!latestUserData) {
          console.warn(
            `User ${currentSelectedUserId} not found during message polling`
          );
          return;
        }

        const newMessages = latestUserData.messages || [];
        const currentMessages = chattingUser?.messages || [];

        // Compare messages to detect changes
        if (JSON.stringify(newMessages) !== JSON.stringify(currentMessages)) {
          console.log("New messages detected, updating chat");

          // Only update messages and chattingUser, not selectedUserId
          setMessages(newMessages);
          setChattingUser(latestUserData);

          // Also update this user in the users list without changing selected user
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === currentSelectedUserId
                ? formatUserForChat(latestUserData)
                : user
            )
          );
        }
      } catch (error) {
        console.error("Error during message polling:", error);
      }
    }, 3000);

    return () => clearInterval(messagePollingInterval);
  }, [selectedUserId, chattingUser, formatUserForChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message with optimistic updates and error handling
  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() === "" || !selectedUserId || isSending) return;

    setIsSending(true);

    // Store the current selectedUserId to ensure we don't lose context
    const currentUserId = selectedUserId;

    // Create the new message object with timestamp for time calculations
    const currentTime = new Date();
    const messageObj = {
      id: Date.now(), // Using timestamp for unique ID
      sender: "agent",
      name: "Customer Support Agent",
      text: newMessage,
      time: currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: currentTime.getTime(),
    };

    try {
      // Optimistically update UI first
      const updatedMessages = [...messages, messageObj];
      setMessages(updatedMessages);
      setNewMessage("");

      // Update in background to avoid UI freezing
      setTimeout(async () => {
        try {
          // Add the message to the user's messages
          await addMessage(currentUserId, messageObj);

          // Fetch the latest user data after adding the message
          const updatedUser = await findUserByEmail(currentUserId);

          if (updatedUser) {
            // Only update if we're still on the same user
            if (currentUserId === selectedUserId) {
              // Update the chatting user state
              setChattingUser(updatedUser);
            }

            // Update the user in the users list without changing selection
            const formattedUser = formatUserForChat(updatedUser);
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === currentUserId ? formattedUser : user
              )
            );
          }
        } catch (error) {
          console.error("Failed to save message:", error);
          // Revert the optimistic update on error
          if (currentUserId === selectedUserId) {
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.id !== messageObj.id)
            );
          }
          alert("Failed to send message. Please try again.");
        } finally {
          setIsSending(false);
        }
      }, 0);
    } catch (error) {
      console.error("Error preparing message:", error);
      setIsSending(false);
    }
  }, [newMessage, selectedUserId, isSending, messages, formatUserForChat]);

  // Handle selecting a user with improved error handling
  const handleSelectUser = useCallback(
    async (userId) => {
      if (selectedUserId === userId) {
        // If on mobile, just switch to chat view
        if (mobileView === "list") {
          setMobileView("chat");
        }
        return;
      }

      setSelectedUserId(userId);
      setLoading(true);
      setMessages([]); // Clear messages while loading

      try {
        const userDetails = await findUserByEmail(userId);

        if (userDetails) {
          setChattingUser(userDetails);
          setMessages(userDetails.messages || []);
        } else {
          console.warn(`User with ID ${userId} not found`);
          setChattingUser(null);
          setMessages([]);
        }
      } catch (error) {
        console.error(`Error loading user ${userId}:`, error);
        setChattingUser(null);
        setMessages([]);
      } finally {
        setLoading(false);
        setMobileView("chat");
      }
    },
    [selectedUserId, mobileView]
  );

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Find selected user from the users array
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  // Format messages for display with improved message processing
  const formattedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return [];

    return messages.map((message, index) => ({
      id: message.id || `msg-${index}-${Date.now()}`,
      sender: message.sender,
      message: message.text,
      time: message.time,
    }));
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Menu
              className="h-6 w-6 text-gray-500 md:hidden mr-4 cursor-pointer"
              onClick={() =>
                setMobileView(mobileView === "list" ? "chat" : "list")
              }
            />
            <h1 className="text-xl font-semibold text-gray-800">
              Customer Support
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Customer List Sidebar */}
        <div
          className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${
            mobileView === "chat" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Customer List with Loading State */}
          <div className="flex-1 overflow-y-auto">
            {loading && users.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mb-2"></div>
                <p>Loading customers...</p>
              </div>
            ) : (
              <>
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex items-start ${
                      selectedUserId === user.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleSelectUser(user.id)}
                  >
                    <div className="relative mr-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                        {user.avatar &&
                        typeof user.avatar === "string" &&
                        user.avatar.length <= 2
                          ? user.avatar
                          : user.name.substring(0, 2)}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === "active"
                            ? "bg-green-400"
                            : "bg-gray-400"
                        }`}
                      ></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {user.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {user.lastMessage}
                      </p>
                    </div>
                    {user.unread > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {user.unread}
                      </span>
                    )}
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No customers found
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col ${
            mobileView === "list" ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center">
                  <div className="md:hidden mr-2">
                    <ChevronLeft
                      className="h-6 w-6 text-gray-500 cursor-pointer"
                      onClick={() => setMobileView("list")}
                    />
                  </div>
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                      {selectedUser.avatar &&
                      typeof selectedUser.avatar === "string" &&
                      selectedUser.avatar.length <= 2
                        ? selectedUser.avatar
                        : selectedUser.name.substring(0, 2)}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        selectedUser.status === "active"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      }`}
                    ></span>
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-900">
                      {selectedUser.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedUser.status === "active" ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="text-gray-500 hover:text-gray-700">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Video className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages with Loading State */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-2"></div>
                      <p className="text-gray-500">Loading messages...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formattedMessages.length > 0 ? (
                      formattedMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "agent"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          {message.sender === "agent" && (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 mt-1">
                              <User className="h-4 w-4" />
                            </div>
                          )}

                          <div
                            className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                              message.sender === "agent"
                                ? "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                : "bg-blue-500 text-white rounded-br-none"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === "agent"
                                  ? "text-gray-500"
                                  : "text-blue-100"
                              }`}
                            >
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4 text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    disabled={isSending || loading}
                  />
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      isSending || loading || !newMessage.trim()
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={handleSendMessage}
                    disabled={isSending || loading || !newMessage.trim()}
                  >
                    {isSending ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <SendHorizontal className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Select a customer to start chatting
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a customer from the list to view messages
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Empty State for mobile when no chat is selected */}
        {filteredUsers.length === 0 &&
          mobileView === "chat" &&
          !selectedUser && (
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No customers found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
