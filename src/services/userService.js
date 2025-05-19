// src/services/userService.js
import { supabase, checkSupabaseConnection } from "./supabaseClient";
import usersData from "../data/user.json";

// Flag to track if Supabase service is enabled
let supabaseEnabled = false;

// Initialize Supabase connection
export const initializeSupabase = async () => {
  try {
    supabaseEnabled = await checkSupabaseConnection();

    if (supabaseEnabled) {
      console.log("Supabase service initialized successfully");
      return true;
    } else {
      // If Supabase not available, fall back to localStorage
      if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify(usersData));
      }
      console.log("Using localStorage only (Supabase unavailable)");
      return false;
    }
  } catch (error) {
    console.error("Error initializing Supabase service:", error);
    // Fall back to localStorage with initial data
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(usersData));
    }
    return false;
  }
};

// Helper to format user object from Supabase to match your app's structure
const formatUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    password: user.password, // Note: In production, passwords should never be returned
    name: user.name,
    avatar: user.avatar,
    total_balance: parseFloat(user.total_balance) || 0,
    spending_by_period: user.spending_by_period || {
      Day: 0,
      Week: 0,
      Month: 0,
      Year: 0,
    },
    categories: user.categories || [
      { name: "Shopping", color: "#7C3AED", percentage: 0 },
      { name: "Food", color: "#EF4444", percentage: 0 },
      { name: "Entertainment", color: "#3B82F6", percentage: 0 },
      { name: "Housing", color: "#F59E0B", percentage: 0 },
      { name: "Others", color: "#10B981", percentage: 100 },
    ],
    transactions: [], // Populated separately
    messages: [], // Populated separately
  };
};

// FALLBACK FUNCTIONS FOR LOCAL STORAGE (when Supabase is not available)
// Get all users from localStorage
const getAllUsersLocal = () => {
  return JSON.parse(localStorage.getItem("users")) || initializeUsersLocal();
};

// Initialize user data in localStorage if it doesn't exist
const initializeUsersLocal = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(usersData));
  }
  return JSON.parse(localStorage.getItem("users"));
};

// Find user by email in localStorage
const findUserByEmailLocal = (email) => {
  const users = getAllUsersLocal();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

// SUPABASE FUNCTIONS

// Get all users
export const getAllUsers = async () => {
  try {
    // Get all users
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) throw error;

    return users;
  } catch (error) {
    console.error("Error getting users from Supabase:", error);
    return getAllUsersLocal(); // Fallback to localStorage
  }
};

// Find user by email
// Find user by email function (using Supabase client instead of direct REST)
export const addUser = async (userData) => {
  try {
    // Validate required fields
    if (!userData.email) {
      throw new Error("Email is required");
    }
    if (!userData.name) {
      throw new Error("Name is required");
    }
    if (!userData.password) {
      throw new Error("Password is required");
    }

    // Check if user with this email already exists
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Prepare the complete user object based on the sample JSON structure
    const userToCreate = {
      email: userData.email,
      type: userData.type || "user",
      password: userData.password, // Note: In production, you should hash passwords
      name: userData.name,
      avatar: userData.avatar || "",
      total_balance: userData.total_balance || 0,
      spending_by_period: userData.spending_by_period || {
        Day: 0,
        Week: 0,
        Month: 0,
        Year: 0,
      },
      categories: userData.categories || [
        { name: "Shopping", color: "#7C3AED", percentage: 15 },
        { name: "Food", color: "#EF4444", percentage: 22 },
        { name: "Entertainment", color: "#3B82F6", percentage: 8 },
        { name: "Housing", color: "#F59E0B", percentage: 35 },
        { name: "Others", color: "#10B981", percentage: 20 },
      ],
      transactions: userData.transactions || [],
      messages: userData.messages || [
        {
          id: 1,
          sender: "agent",
          name: "Emma Thompson",
          text: "Hi there! Welcome to Our Support. How can I help you today?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };

    // Insert the new user into the database
    const { data, error } = await supabase
      .from("users")
      .insert([userToCreate])
      .select();

    if (error) {
      console.error("Database error:", error);
      throw new Error(error.message || "Failed to create user");
    }

    if (!data || data.length === 0) {
      throw new Error("Failed to create user");
    }

    return data[0]; // Return the newly created user
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const updateUser = async (email, userData) => {
  console.log(email, userData);

  try {
    if (!email) {
      throw new Error("User email is required for update");
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      throw new Error(`User with email ${email} not found`);
    }

    // Prepare the update payload
    const updatedUser = {
      email: userData.email,
      type: userData.type || existingUser.type || "user",
      name: userData.name,
      avatar: userData.avatar || existingUser.avatar || "",
      total_balance: userData.total_balance || existingUser.total_balance || 0,
      spending_by_period: userData.spending_by_period ||
        existingUser.spending_by_period || {
          Day: 0,
          Week: 0,
          Month: 0,
          Year: 0,
        },
      categories: userData.categories ||
        existingUser.categories || [
          { name: "Shopping", color: "#7C3AED", percentage: 15 },
          { name: "Food", color: "#EF4444", percentage: 22 },
          { name: "Entertainment", color: "#3B82F6", percentage: 8 },
          { name: "Housing", color: "#F59E0B", percentage: 35 },
          { name: "Others", color: "#10B981", percentage: 20 },
        ],
      transactions: userData.transactions || existingUser.transactions || [],
      messages: userData.messages || existingUser.messages || [],
    };

    // Only update password if provided (don't overwrite with blank)
    if (userData.password) {
      updatedUser.password = userData.password; // In production, should be hashed
    } else {
      // Keep existing password
      updatedUser.password = existingUser.password;
    }

    // Handle email change case - if email changed, we need to delete and recreate
    if (email !== userData.email) {
      // First delete the old user
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("email", email);

      if (deleteError) {
        throw new Error(`Failed to update user email: ${deleteError.message}`);
      }

      // Then insert as a new user
      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert([updatedUser])
        .select();

      if (insertError) {
        throw new Error(
          `Failed to create user with new email: ${insertError.message}`
        );
      }

      return insertData[0];
    } else {
      // Regular update if email hasn't changed
      const { data, error } = await supabase
        .from("users")
        .update(updatedUser)
        .eq("email", email)
        .select();

      if (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }

      return data[0];
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    // Validate parameters
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Delete the user
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return true; // Return success
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const findUserByEmail = async (email) => {
  try {
    // The issue is with using .single() when there might be no matching user
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Check if any users were found
    if (!data || data.length === 0) {
      return null; // No user found with this email
    }

    return data[0]; // Return the first matching user
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

// Login user function with proper error handling
export const loginUser = async (email, password) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.password !== password) {
      return { success: false, message: "Invalid password" };
    }

    const { password: _, ...safeUser } = user;
    localStorage.setItem("currentUser", JSON.stringify(safeUser));

    return { success: true, user: safeUser };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Login error: " + error.message };
  }
};

// Get current logged in user
export const getCurrentUser = () => {
  const userJson = localStorage.getItem("currentUser");
  return userJson ? JSON.parse(userJson) : null;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("currentUser");
  return { success: true };
};

// Update user data
// export const updateUser = async (email, updatedData) => {
//   if (!supabaseEnabled) {
//     // Fallback to localStorage update
//     const users = getAllUsersLocal();
//     const userIndex = users.findIndex(
//       (user) => user.email.toLowerCase() === email.toLowerCase()
//     );

//     if (userIndex === -1) {
//       return { success: false, message: "User not found" };
//     }

//     // Update user data
//     const updatedUser = { ...users[userIndex], ...updatedData };
//     users[userIndex] = updatedUser;

//     // Update in localStorage
//     localStorage.setItem("users", JSON.stringify(users));

//     // If this is the current user, update current user too
//     const currentUser = getCurrentUser();
//     if (
//       currentUser &&
//       currentUser.email.toLowerCase() === email.toLowerCase()
//     ) {
//       const { password: _, ...safeUser } = updatedUser;
//       localStorage.setItem("currentUser", JSON.stringify(safeUser));
//     }

//     return { success: true, user: updatedUser };
//   }

//   try {
//     // First, get the user to update
//     const user = await findUserByEmail(email);

//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     // Prepare update data in Supabase format
//     const supabaseUpdateData = {};

//     // Map fields to the correct format
//     if (updatedData.name) supabaseUpdateData.name = updatedData.name;
//     if (updatedData.avatar) supabaseUpdateData.avatar = updatedData.avatar;
//     if (updatedData.password)
//       supabaseUpdateData.password = updatedData.password;
//     if (updatedData.total_balance !== undefined)
//       supabaseUpdateData.total_balance = updatedData.totalBalance;
//     if (updatedData.spending_by_period)
//       supabaseUpdateData.spending_by_period = updatedData.spending_by_period;
//     if (updatedData.categories)
//       supabaseUpdateData.categories = updatedData.categories;

//     // Only update if there's data to update
//     if (Object.keys(supabaseUpdateData).length > 0) {
//       const { error } = await supabase
//         .from("users")
//         .update(supabaseUpdateData)
//         .eq("id", user.id);

//       if (error) throw error;
//     }

//     // Handle transactions update
//     if (updatedData.transactions) {
//       // Clear existing transactions and insert new ones
//       const { error: deleteError } = await supabase
//         .from("transactions")
//         .delete()
//         .eq("user_id", user.id);

//       if (deleteError) throw deleteError;

//       if (updatedData.transactions.length > 0) {
//         // Insert new transactions
//         const transactionsToInsert = updatedData.transactions.map((t) => ({
//           user_id: user.id,
//           amount: t.amount,
//           category: t.category,
//           description: t.description || "",
//           is_positive: t.isPositive,
//           date: t.date || new Date().toISOString().split("T")[0],
//         }));

//         const { error: insertError } = await supabase
//           .from("transactions")
//           .insert(transactionsToInsert);

//         if (insertError) throw insertError;
//       }
//     }

//     // Handle messages update
//     if (updatedData.messages) {
//       // Clear existing messages and insert new ones
//       const { error: deleteError } = await supabase
//         .from("messages")
//         .delete()
//         .eq("user_id", user.id);

//       if (deleteError) throw deleteError;

//       if (updatedData.messages.length > 0) {
//         // Insert new messages
//         const messagesToInsert = updatedData.messages.map((m) => ({
//           user_id: user.id,
//           content: m.content,
//           time:
//             m.time ||
//             new Date().toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//           sender: m.sender,
//           is_read: m.isRead || false,
//         }));

//         const { error: insertError } = await supabase
//           .from("messages")
//           .insert(messagesToInsert);

//         if (insertError) throw insertError;
//       }
//     }

//     // Get the updated user
//     const updatedUser = await findUserByEmail(email);

//     // If this is the current user, update current user in localStorage
//     const currentUser = getCurrentUser();
//     if (
//       currentUser &&
//       currentUser.email.toLowerCase() === email.toLowerCase()
//     ) {
//       const { password: _, ...safeUser } = updatedUser;
//       localStorage.setItem("currentUser", JSON.stringify(safeUser));
//     }

//     return { success: true, user: updatedUser };
//   } catch (error) {
//     console.error("Error updating user in Supabase:", error);

//     if (!supabaseEnabled) {
//       // If Supabase failed and we have localStorage as fallback
//       return updateUser(email, updatedData);
//     }

//     return { success: false, message: "Update error: " + error.message };
//   }
// };

// Register new user
export const registerUser = async (userData) => {
  if (!supabaseEnabled) {
    // Fallback to localStorage
    const users = getAllUsersLocal();

    // Check if user already exists
    if (findUserByEmailLocal(userData.email)) {
      return { success: false, message: "User already exists" };
    }

    // Create new user with default fields
    const newUser = {
      email: userData.email,
      password: userData.password,
      name: userData.name || "New User",
      avatar:
        userData.avatar ||
        userData.name
          ?.split(" ")
          .map((n) => n[0])
          .join("") ||
        "NU",
      totalBalance: userData.totalBalance || 0,
      spending_by_period: userData.spending_by_period || {
        Day: 0,
        Week: 0,
        Month: 0,
        Year: 0,
      },
      categories: userData.categories || [
        { name: "Shopping", color: "#7C3AED", percentage: 0 },
        { name: "Food", color: "#EF4444", percentage: 0 },
        { name: "Entertainment", color: "#3B82F6", percentage: 0 },
        { name: "Housing", color: "#F59E0B", percentage: 0 },
        { name: "Others", color: "#10B981", percentage: 100 },
      ],
      transactions: userData.transactions || [],
      messages: userData.messages || [],
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, user: newUser };
  }

  try {
    // Check if user exists
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Generate initials for avatar if not provided
    const avatar =
      userData.avatar ||
      (userData.name
        ? userData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "NU");

    // Insert new user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email: userData.email,
        password: userData.password, // In prod, should be hashed
        name: userData.name || "New User",
        avatar: avatar,
        total_balance: userData.total_balance || 0,
        spending_by_period: userData.spending_by_period || {
          Day: 0,
          Week: 0,
          Month: 0,
          Year: 0,
        },
        categories: userData.categories || [
          { name: "Shopping", color: "#7C3AED", percentage: 0 },
          { name: "Food", color: "#EF4444", percentage: 0 },
          { name: "Entertainment", color: "#3B82F6", percentage: 0 },
          { name: "Housing", color: "#F59E0B", percentage: 0 },
          { name: "Others", color: "#10B981", percentage: 100 },
        ],
      })
      .select()
      .single();

    if (error) throw error;

    // Handle transactions if provided
    if (userData.transactions && userData.transactions.length > 0) {
      const transactionsToInsert = userData.transactions.map((t) => ({
        user_id: newUser.id,
        amount: t.amount,
        category: t.category,
        description: t.description || "",
        is_positive: t.isPositive,
        date: t.date || new Date().toISOString().split("T")[0],
      }));

      const { error: txError } = await supabase
        .from("transactions")
        .insert(transactionsToInsert);

      if (txError) throw txError;
    }

    // Handle messages if provided
    if (userData.messages && userData.messages.length > 0) {
      const messagesToInsert = userData.messages.map((m) => ({
        user_id: newUser.id,
        content: m.content,
        time:
          m.time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        sender: m.sender,
        is_read: m.isRead || false,
      }));

      const { error: msgError } = await supabase
        .from("messages")
        .insert(messagesToInsert);

      if (msgError) throw msgError;
    }

    // Get the complete user with transactions and messages
    const fullUser = await findUserByEmail(userData.email);

    return { success: true, user: fullUser };
  } catch (error) {
    console.error("Error registering user in Supabase:", error);

    if (!supabaseEnabled) {
      // If Supabase failed but we have localStorage as fallback
      return registerUser(userData);
    }

    return { success: false, message: "Registration error: " + error.message };
  }
};

// Add transaction for a user
export const addTransaction = async (email, transaction) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!supabaseEnabled) {
      // Fallback to localStorage approach - generate an ID and update user
      const newId =
        user.transactions.length > 0
          ? Math.max(...user.transactions.map((t) => t.id)) + 1
          : 1;

      const newTransaction = {
        id: newId,
        ...transaction,
        date: transaction.date || new Date().toISOString().split("T")[0],
      };

      return updateUser(email, {
        transactions: [...user.transactions, newTransaction],
      });
    }

    // Insert transaction in Supabase
    const { data: newTransaction, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description || "",
        is_positive: transaction.isPositive,
        date: transaction.date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) throw error;

    // Update local user data
    const updatedUser = await findUserByEmail(email);

    // Update current user in localStorage if needed
    const currentUser = getCurrentUser();
    if (
      currentUser &&
      currentUser.email.toLowerCase() === email.toLowerCase()
    ) {
      const { password: _, ...safeUser } = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    }

    return { success: true, user: updatedUser, transaction: newTransaction };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, message: "Transaction error: " + error.message };
  }
};

// Remove transaction for a user
export const removeTransaction = async (email, transactionId) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!supabaseEnabled) {
      // Fallback to localStorage approach
      const filteredTransactions = user.transactions.filter(
        (t) => t.id !== transactionId
      );

      return updateUser(email, {
        transactions: filteredTransactions,
      });
    }

    // Delete transaction from Supabase
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (error) throw error;

    // Update local user data
    const updatedUser = await findUserByEmail(email);

    // Update current user in localStorage if needed
    const currentUser = getCurrentUser();
    if (
      currentUser &&
      currentUser.email.toLowerCase() === email.toLowerCase()
    ) {
      const { password: _, ...safeUser } = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error removing transaction:", error);
    return {
      success: false,
      message: "Remove transaction error: " + error.message,
    };
  }
};

// Update category percentages
export const updateCategories = async (email, categories) => {
  return updateUser(email, { categories });
};

// Add message for a user
// export const addMessage = async (email, message) => {
//   console.log(email, message);

//   try {
//     const user = await findUserByEmail(email);

//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     // For Supabase, we need to handle the message format
//     let messageToInsert;

//     // If message is already an object, use it
//     if (typeof message === "object" && !Array.isArray(message)) {
//       messageToInsert = {
//         user_id: user.id,
//         content: message.content,
//         time:
//           message.time ||
//           new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         sender: message.sender,
//         is_read: message.isRead || false,
//       };
//     }
//     // If message is an array (deprecated), use the last one
//     else if (Array.isArray(message)) {
//       console.warn(
//         "Passing array to addMessage is deprecated. Pass single message object instead."
//       );
//       const lastMessage = message[message.length - 1];
//       if (!lastMessage) {
//         return { success: false, message: "No valid message found in array" };
//       }

//       messageToInsert = {
//         user_id: user.id,
//         content: lastMessage.content,
//         time:
//           lastMessage.time ||
//           new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         sender: lastMessage.sender,
//         is_read: lastMessage.isRead || false,
//       };
//     }

//     // Insert message into Supabase
//     const { data: newMessage, error } = await supabase
//       .from("messages")
//       .insert(messageToInsert)
//       .select()
//       .single();

//     if (error) throw error;

//     // Update local user data
//     const updatedUser = await findUserByEmail(email);

//     // Update current user in localStorage if needed
//     const currentUser = getCurrentUser();
//     if (
//       currentUser &&
//       currentUser.email.toLowerCase() === email.toLowerCase()
//     ) {
//       const { password: _, ...safeUser } = updatedUser;
//       localStorage.setItem("currentUser", JSON.stringify(safeUser));
//     }

//     return { success: true, user: updatedUser, message: newMessage };
//   } catch (error) {
//     console.error("Error adding message:", error);
//     return { success: false, message: "Message error: " + error.message };
//   }
// };

// Mark all messages as read for a user
export const markMessagesAsRead = async (email) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!supabaseEnabled) {
      // Fallback to localStorage approach
      const updatedMessages = user.messages.map((m) => ({
        ...m,
        isRead: true,
      }));

      return updateUser(email, {
        messages: updatedMessages,
      });
    }

    // Update messages in Supabase
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("user_id", user.id);

    if (error) throw error;

    // Update local user data
    const updatedUser = await findUserByEmail(email);

    // Update current user in localStorage if needed
    const currentUser = getCurrentUser();
    if (
      currentUser &&
      currentUser.email.toLowerCase() === email.toLowerCase()
    ) {
      const { password: _, ...safeUser } = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return {
      success: false,
      message: "Error marking messages as read: " + error.message,
    };
  }
};

// Recalculate total balance based on transactions
export const recalculateBalance = async (email) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    let balance = 0;
    user.transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.isPositive) {
        balance += amount;
      } else {
        balance -= amount;
      }
    });

    return updateUser(email, { total_balance: balance });
  } catch (error) {
    console.error("Error recalculating balance:", error);
    return {
      success: false,
      message: "Failed to recalculate balance: " + error.message,
    };
  }
};

// Calculate spending analytics for different periods
export const calculatespending_by_period = async (email) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const startOfWeek = new Date(
      today - now.getDay() * 24 * 60 * 60 * 1000
    ).getTime();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();
    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

    let spending_by_period = {
      Day: 0,
      Week: 0,
      Month: 0,
      Year: 0,
    };

    user.transactions.forEach((transaction) => {
      if (!transaction.isPositive) {
        // Only count expenses
        const transactionDate = new Date(transaction.date).getTime();
        const amount = parseFloat(transaction.amount);

        if (transactionDate >= today) {
          spending_by_period.Day += amount;
        }

        if (transactionDate >= startOfWeek) {
          spending_by_period.Week += amount;
        }

        if (transactionDate >= startOfMonth) {
          spending_by_period.Month += amount;
        }

        if (transactionDate >= startOfYear) {
          spending_by_period.Year += amount;
        }
      }
    });

    return updateUser(email, { spending_by_period });
  } catch (error) {
    console.error("Error calculating spending by period:", error);
    return {
      success: false,
      message: "Failed to calculate spending: " + error.message,
    };
  }
};

// Update category percentages based on spending
export const updateCategoryPercentages = async (email) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Get total expense amount
    let totalExpenses = 0;
    const categoryAmounts = {};

    // Initialize categories with zero amounts
    user.categories.forEach((category) => {
      categoryAmounts[category.name] = 0;
    });

    // Sum up expenses by category
    user.transactions.forEach((transaction) => {
      if (!transaction.isPositive) {
        const amount = parseFloat(transaction.amount);
        totalExpenses += amount;

        // Add to category total or to "Others" if category doesn't exist
        if (
          transaction.category &&
          categoryAmounts[transaction.category] !== undefined
        ) {
          categoryAmounts[transaction.category] += amount;
        } else {
          categoryAmounts["Others"] += amount;
        }
      }
    });

    // Calculate percentages
    const updatedCategories = user.categories.map((category) => {
      const amount = categoryAmounts[category.name] || 0;
      const percentage =
        totalExpenses > 0
          ? Math.round((amount / totalExpenses) * 100)
          : category.name === "Others"
          ? 100
          : 0;

      return {
        ...category,
        percentage,
      };
    });

    return updateUser(email, { categories: updatedCategories });
  } catch (error) {
    console.error("Error updating category percentages:", error);
    return {
      success: false,
      message: "Failed to update categories: " + error.message,
    };
  }
};

// Export user data to JSON
export const exportUserData = async (email) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const { password, ...safeUserData } = user;
    const jsonData = JSON.stringify(safeUserData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${user.name.replace(/\s+/g, "_")}_finance_data.json`;
    a.click();

    URL.revokeObjectURL(url);
    return { success: true, message: "User data exported successfully" };
  } catch (error) {
    console.error("Error exporting user data:", error);
    return {
      success: false,
      message: "Failed to export data: " + error.message,
    };
  }
};

// Import user data from JSON
export const importUserData = async (email, jsonData) => {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    let importedData;
    try {
      importedData = JSON.parse(jsonData);
    } catch (parseError) {
      return { success: false, message: "Invalid JSON data" };
    }

    // Verify the imported data has required fields
    if (!importedData.email || importedData.email !== email) {
      return { success: false, message: "Data does not match current user" };
    }

    // Create update object with only valid fields
    const validFields = [
      "name",
      "avatar",
      "total_balance",
      "spending_by_period",
      "categories",
      "transactions",
      "messages",
    ];

    const updateData = {};
    validFields.forEach((field) => {
      if (importedData[field] !== undefined) {
        updateData[field] = importedData[field];
      }
    });

    // Update user with imported data
    return updateUser(email, updateData);
  } catch (error) {
    console.error("Error importing user data:", error);
    return {
      success: false,
      message: "Failed to import data: " + error.message,
    };
  }
};

// // Delete user account
// export const deleteUser = async (email) => {
//   try {
//     const user = await findUserByEmail(email);

//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     if (!supabaseEnabled) {
//       // Fallback to localStorage approach
//       const users = getAllUsersLocal();
//       const filteredUsers = users.filter(
//         (u) => u.email.toLowerCase() !== email.toLowerCase()
//       );

//       localStorage.setItem("users", JSON.stringify(filteredUsers));

//       // If this was the current user, log them out
//       const currentUser = getCurrentUser();
//       if (
//         currentUser &&
//         currentUser.email.toLowerCase() === email.toLowerCase()
//       ) {
//         logoutUser();
//       }

//       return { success: true, message: "User account deleted successfully" };
//     }

//     // For Supabase, we need to delete all related data first

//     // Delete user transactions
//     const { error: txError } = await supabase
//       .from("transactions")
//       .delete()
//       .eq("user_id", user.id);

//     if (txError) throw txError;

//     // Delete user messages
//     const { error: msgError } = await supabase
//       .from("messages")
//       .delete()
//       .eq("user_id", user.id);

//     if (msgError) throw msgError;

//     // Finally delete the user
//     const { error } = await supabase.from("users").delete().eq("id", user.id);

//     if (error) throw error;

//     // If this was the current user, log them out
//     const currentUser = getCurrentUser();
//     if (
//       currentUser &&
//       currentUser.email.toLowerCase() === email.toLowerCase()
//     ) {
//       logoutUser();
//     }

//     return { success: true, message: "User account deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return {
//       success: false,
//       message: "Failed to delete account: " + error.message,
//     };
//   }
// };

// Check database status (Supabase or localStorage)
export const getDatabaseStatus = async () => {
  try {
    const isConnected = await checkSupabaseConnection();

    return {
      success: true,
      usingSupabase: supabaseEnabled,
      status: supabaseEnabled ? "Connected to Supabase" : "Using localStorage",
      isConnected,
    };
  } catch (error) {
    console.error("Error checking database status:", error);
    return {
      success: false,
      usingSupabase: false,
      status: "Error checking connection",
      isConnected: false,
      error: error.message,
    };
  }
};

// Helper function to update the messages array in the user record
const updateUserMessages = async (user, newMessage) => {
  try {
    // Initialize messages array if it doesn't exist
    const messages = user.messages || [];

    // Generate a new ID for the message
    const messageId =
      messages.length > 0 ? Math.max(...messages.map((m) => m.id || 0)) + 1 : 1;

    // Prepare the message with an ID
    const messageWithId = {
      id: messageId,
      text: newMessage.content, // Use text instead of content based on your schema
      time: newMessage.time,
      sender: newMessage.sender,
      name: newMessage.name,
    };

    // Add the new message to the array
    const updatedMessages = [...messages, messageWithId];

    // Update the user record
    const { data, error } = await supabase
      .from("users")
      .update({ messages: updatedMessages })
      .eq("email", user.email)
      .select();

    console.log(data);

    if (error) throw error;

    return { updatedUser: data[0], newMessage: messageWithId };
  } catch (error) {
    console.error("Error updating user messages:", error);
    throw error;
  }
};
// Add message to user
export const addMessage = async (email, message) => {
  console.log(email, message);

  try {
    // Get the user
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Format the message
    let messageToInsert;

    // If message is already an object, use it
    if (typeof message === "object" && !Array.isArray(message)) {
      messageToInsert = {
        user_id: user.id,
        content: message.content || message.text, // Handle both content and text properties
        time:
          message.time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        sender: message.sender,
        name:
          message.name ||
          (message.sender === "user" ? user.name : "Emma Thompson"),
        is_read: message.isRead || false,
      };
    }
    // If message is an array (deprecated), use the last one
    else if (Array.isArray(message)) {
      console.warn(
        "Passing array to addMessage is deprecated. Pass single message object instead."
      );
      const lastMessage = message[message.length - 1];
      if (!lastMessage) {
        return { success: false, message: "No valid message found in array" };
      }

      messageToInsert = {
        user_id: user.id,
        content: lastMessage.content || lastMessage.text,
        time:
          lastMessage.time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        sender: lastMessage.sender,
        name:
          lastMessage.name ||
          (lastMessage.sender === "user" ? user.name : "Emma Thompson"),
        is_read: lastMessage.isRead || false,
      };
    } else {
      // Handle string messages or other formats
      messageToInsert = {
        user_id: user.id,
        content: String(message),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sender: "user",
        name: user.name,
        is_read: false,
      };
    }

    // Update user's messages array
    const { updatedUser, newMessage } = await updateUserMessages(
      user,
      messageToInsert
    );

    // Update current user in localStorage if needed
    const currentUser = getCurrentUser();
    if (
      currentUser &&
      currentUser.email.toLowerCase() === email.toLowerCase()
    ) {
      const { password: _, ...safeUser } = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    }

    return { success: true, user: updatedUser, message: newMessage };
  } catch (error) {
    console.error("Error adding message:", error);
    return { success: false, message: "Message error: " + error.message };
  }
};
