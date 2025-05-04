// // src/services/userService.js
// import { Low } from "lowdb";
// import { LocalStorage } from "lowdb/browser";
// import usersData from "../data/user.json";
// console.log("ll");
// // Initialize lowdb with localStorage adapter and default data
// const adapter = new LocalStorage("userData");
// // Create a database instance with defaultData
// const db = new Low(adapter, { users: usersData }); // Initialize with empty users array

// // Initialize database with default data if it doesn't exist yet
// const initializeDb = async () => {
//   try {
//     await db.read();

//     // If the database is empty or doesn't exist, populate it with default data
//     if (!db.data || !db.data.users) {
//       db.data = { users: usersData };
//       await db.write();
//       console.log("Database initialized with default data");
//     }

//     return db.data;
//   } catch (error) {
//     console.error("Error initializing database:", error);
//     // Make sure we have a valid data structure even if initialization fails
//     if (!db.data) {
//       db.data = { users: usersData };
//       try {
//         await db.write();
//       } catch (writeError) {
//         console.error("Error writing initial data:", writeError);
//       }
//     }
//     return db.data;
//   }
// };

// // Initialize the database immediately
// initializeDb();

// // Get all users
// export const getAllUsers = async () => {
//   try {
//     await db.read();
//     return db.data.users || [];
//   } catch (error) {
//     console.error("Error getting users:", error);
//     return [];
//   }
// };

// // Find user by email
// export const findUserByEmail = async (email) => {
//   try {
//     const users = await getAllUsers();
//     return users.find(
//       (user) => user.email.toLowerCase() === email.toLowerCase()
//     );
//   } catch (error) {
//     console.error("Error finding user:", error);
//     return null;
//   }
// };

// // Authenticate user
// export const loginUser = async (email, password) => {
//   try {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 300));

//     const user = await findUserByEmail(email);
//     console.log(user);

//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     if (user.password !== password) {
//       return { success: false, message: "Invalid password" };
//     }

//     const { password: _, ...safeUser } = user;
//     localStorage.setItem("currentUser", JSON.stringify(safeUser));

//     return { success: true, user: safeUser };
//   } catch (error) {
//     console.error("Login error:", error);
//     return { success: false, message: "An error occurred during login" };
//   }
// };

// // Get current logged in user
// export const getCurrentUser = () => {
//   const userJson = localStorage.getItem("currentUser");
//   return userJson ? JSON.parse(userJson) : null;
// };

// // Logout user
// export const logoutUser = () => {
//   localStorage.removeItem("currentUser");
//   return { success: true };
// };

// // Update user data
// export const updateUser = async (email, updatedData) => {
//   try {
//     await db.read();

//     if (!db.data || !db.data.users) {
//       await initializeDb();
//     }

//     const users = db.data.users;

//     const userIndex = users.findIndex(
//       (user) => user.email.toLowerCase() === email.toLowerCase()
//     );

//     if (userIndex === -1) {
//       return { success: false, message: "User not found" };
//     }

//     // Update user data
//     const updatedUser = { ...users[userIndex], ...updatedData };
//     users[userIndex] = updatedUser;

//     console.log(updatedUser);

//     // Save changes to the database
//     await db.write();

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
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return { success: false, message: "Failed to update user data" };
//   }
// };

// // Register new user
// export const registerUser = async (userData) => {
//   try {
//     await db.read();

//     if (!db.data || !db.data.users) {
//       await initializeDb();
//     }

//     // Using our helper function to find user by email
//     const existingUser = await findUserByEmail(userData.email);

//     // Check if user already exists
//     if (existingUser) {
//       return { success: false, message: "User already exists" };
//     }

//     // Create new user with default fields if not provided
//     const newUser = {
//       email: userData.email,
//       password: userData.password,
//       name: userData.name || "New User",
//       avatar:
//         userData.avatar ||
//         userData.name
//           ?.split(" ")
//           .map((n) => n[0])
//           .join("") ||
//         "NU",
//       totalBalance: userData.totalBalance || 0,
//       spendingByPeriod: userData.spendingByPeriod || {
//         Day: 0,
//         Week: 0,
//         Month: 0,
//         Year: 0,
//       },
//       categories: userData.categories || [
//         { name: "Shopping", color: "#7C3AED", percentage: 0 },
//         { name: "Food", color: "#EF4444", percentage: 0 },
//         { name: "Entertainment", color: "#3B82F6", percentage: 0 },
//         { name: "Housing", color: "#F59E0B", percentage: 0 },
//         { name: "Others", color: "#10B981", percentage: 100 },
//       ],
//       transactions: userData.transactions || [],
//       messages: userData.messages || [],
//     };

//     // Add to users array
//     db.data.users.push(newUser);

//     // Save changes to the database
//     await db.write();

//     return { success: true, user: newUser };
//   } catch (error) {
//     console.error("Error registering user:", error);
//     return { success: false, message: "Failed to register user" };
//   }
// };

// // Add transaction for a user
// export const addTransaction = async (email, transaction) => {
//   try {
//     const user = await findUserByEmail(email);

//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     // Generate a new unique ID for the transaction
//     const newId =
//       user.transactions.length > 0
//         ? Math.max(...user.transactions.map((t) => t.id)) + 1
//         : 1;

//     const newTransaction = {
//       id: newId,
//       ...transaction,
//       date: transaction.date || new Date().toISOString().split("T")[0],
//     };

//     // Update user transactions
//     return updateUser(email, {
//       transactions: [...user.transactions, newTransaction],
//     });
//   } catch (error) {
//     console.error("Error adding transaction:", error);
//     return { success: false, message: "Failed to add transaction" };
//   }
// };

// // Remove transaction for a user
// export const removeTransaction = async (email, transactionId) => {
//   try {
//     const user = await findUserByEmail(email);

//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     const filteredTransactions = user.transactions.filter(
//       (t) => t.id !== transactionId
//     );

//     // Update user transactions
//     return updateUser(email, {
//       transactions: filteredTransactions,
//     });
//   } catch (error) {
//     console.error("Error removing transaction:", error);
//     return { success: false, message: "Failed to remove transaction" };
//   }
// };

// // Update category percentages
// export const updateCategories = async (email, categories) => {
//   return updateUser(email, { categories });
// };

// // Add message for a user
// export const addMessage = async (email, message) => {
//   try {
//     const user = await findUserByEmail(email);

//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     // If message is already an object with id, use it directly
//     if (message.id) {
//       // Update user messages
//       console.log(message);

//       return updateUser(email, {
//         messages: [...user.messages, message],
//       });
//     }
//     // If message is an array, handle differently (deprecated approach)
//     else if (Array.isArray(message)) {
//       console.warn(
//         "Passing array to addMessage is deprecated. Pass single message object instead."
//       );
//       const lastMessage = message[message.length - 1];
//       if (lastMessage) {
//         return updateUser(email, {
//           messages: [...user.messages, lastMessage],
//         });
//       }
//       return { success: false, message: "No valid message found in array" };
//     }
//     // Otherwise, create a new message with an ID
//     else {
//       const newId =
//         user.messages.length > 0
//           ? Math.max(...user.messages.map((m) => m.id)) + 1
//           : 1;

//       const newMessage = {
//         id: newId,
//         ...message,
//         time:
//           message.time ||
//           new Date().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//       };

//       // Update user messages
//       return updateUser(email, {
//         messages: [...user.messages, newMessage],
//       });
//     }
//   } catch (error) {
//     console.error("Error adding message:", error);
//     return { success: false, message: "Failed to add message" };
//   }
// };

// // Recalculate total balance based on transactions
// export const recalculateBalance = async (email) => {
//   try {
//     const user = await findUserByEmail(email);

//     if (!user) {
//       return { success: false, message: "User not found" };
//     }

//     let balance = 0;
//     user.transactions.forEach((transaction) => {
//       const amount = parseFloat(transaction.amount);
//       if (transaction.isPositive) {
//         balance += amount;
//       } else {
//         balance -= amount;
//       }
//     });

//     return updateUser(email, { totalBalance: balance });
//   } catch (error) {
//     console.error("Error recalculating balance:", error);
//     return { success: false, message: "Failed to recalculate balance" };
//   }
// };

// // Export database to JSON file (for backup/migration)
// export const exportDatabase = () => {
//   try {
//     const jsonString = JSON.stringify(db.data, null, 2);
//     const blob = new Blob([jsonString], { type: "application/json" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "userData.json";
//     a.click();

//     URL.revokeObjectURL(url);
//     return { success: true, message: "Database exported successfully" };
//   } catch (error) {
//     console.error("Error exporting database:", error);
//     return { success: false, message: "Failed to export database" };
//   }
// };

// // Import database from JSON file
// export const importDatabase = () => {
//   return new Promise((resolve, reject) => {
//     try {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.accept = ".json,application/json";

//       input.onchange = async (event) => {
//         const file = event.target.files[0];
//         if (!file) {
//           reject({ success: false, message: "No file selected" });
//           return;
//         }

//         const reader = new FileReader();
//         reader.onload = async (e) => {
//           try {
//             const importedData = JSON.parse(e.target.result);

//             // Validate that it has the expected structure, or create it
//             if (!importedData.users) {
//               // Try to handle the case where the JSON might be just an array of users
//               if (Array.isArray(importedData)) {
//                 db.data = { users: importedData };
//               } else {
//                 reject({ success: false, message: "Invalid data format" });
//                 return;
//               }
//             } else {
//               // Normal case - we have a {users: [...]} structure
//               db.data = importedData;
//             }

//             await db.write();
//             resolve({
//               success: true,
//               message: "Database imported successfully",
//             });
//           } catch (error) {
//             console.error("Error parsing JSON:", error);
//             reject({ success: false, message: "Invalid JSON file" });
//           }
//         };

//         reader.onerror = () =>
//           reject({ success: false, message: "Error reading file" });
//         reader.readAsText(file);
//       };

//       input.click();
//     } catch (error) {
//       console.error("Import error:", error);
//       reject({ success: false, message: "Failed to import database" });
//     }
//   });
// };

//USER SERVICE
import usersData from "../data/user.json";
import { saveToJsonFile, loadFromJsonFile } from "./jsonFileService";

// Flag to track if file service is enabled
let fileServiceEnabled = false;

// Initialize and sync with JSON file
export const initializeFileAccess = async () => {
  try {
    // Try to load data from JSON file
    const fileData = await loadFromJsonFile();

    if (fileData) {
      // Use data from file and update localStorage
      localStorage.setItem("users", JSON.stringify(fileData));
      fileServiceEnabled = true;
      console.log("File service initialized successfully");
      return true;
    } else {
      // If file service not available, fall back to localStorage
      if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify(usersData));
      }
      console.log("Using localStorage only (file service unavailable)");
      return false;
    }
  } catch (error) {
    console.error("Error initializing file service:", error);
    // Fall back to localStorage with initial data
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(usersData));
    }
    return false;
  }
};

// Write data back to the JSON file
const writeToFile = async (data) => {
  if (!fileServiceEnabled) {
    console.log("File service not enabled, changes saved only to localStorage");
    return false;
  }

  try {
    const result = await saveToJsonFile(data);
    if (result) {
      console.log("Data successfully saved to JSON file");
    } else {
      console.warn("Failed to save data to JSON file");
    }
    return result;
  } catch (error) {
    console.error("Error writing to file:", error);
    return false;
  }
};

// Get all users
export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || initializeUsers();
};

// Initialize user data in localStorage if it doesn't exist
const initializeUsers = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(usersData));
  }
  return JSON.parse(localStorage.getItem("users"));
};

// Find user by email
export const findUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

// Authenticate user
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const user = findUserByEmail(email);

      if (!user) {
        reject({ success: false, message: "User not found" });
        return;
      }

      if (user.password !== password) {
        reject({ success: false, message: "Invalid password" });
        return;
      }

      const { password: _, ...safeUser } = user;
      localStorage.setItem("currentUser", JSON.stringify(safeUser));

      resolve({ success: true, user: safeUser });
    }, 300); // Simulate network delay
  });
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
export const updateUser = async (email, updatedData) => {
  console.log(email, updatedData);

  const users = getAllUsers();
  const userIndex = users.findIndex(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (userIndex === -1) {
    return { success: false, message: "User not found" };
  }

  // Update user data
  const updatedUser = { ...users[userIndex], ...updatedData };
  users[userIndex] = updatedUser;

  // Update in localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Write changes to file
  await writeToFile(users);

  // If this is the current user, update current user too
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
    const { password: _, ...safeUser } = updatedUser;
    localStorage.setItem("currentUser", JSON.stringify(safeUser));
  }

  return { success: true, user: updatedUser };
};

// Register new user
export const registerUser = async (userData) => {
  const users = getAllUsers();

  // Check if user already exists
  if (findUserByEmail(userData.email)) {
    return { success: false, message: "User already exists" };
  }

  // Create new user with default fields if not provided
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
    spendingByPeriod: userData.spendingByPeriod || {
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

  // Add to users array
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Write changes to file
  await writeToFile(users);

  return { success: true, user: newUser };
};

// Add transaction for a user
export const addTransaction = async (email, transaction) => {
  const user = findUserByEmail(email);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  // Generate a new unique ID for the transaction
  const newId =
    user.transactions.length > 0
      ? Math.max(...user.transactions.map((t) => t.id)) + 1
      : 1;

  const newTransaction = {
    id: newId,
    ...transaction,
    date: transaction.date || new Date().toISOString().split("T")[0],
  };

  // Update user transactions
  return updateUser(email, {
    transactions: [...user.transactions, newTransaction],
  });
};

// Remove transaction for a user
export const removeTransaction = async (email, transactionId) => {
  const user = findUserByEmail(email);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const filteredTransactions = user.transactions.filter(
    (t) => t.id !== transactionId
  );

  // Update user transactions
  return updateUser(email, {
    transactions: filteredTransactions,
  });
};

// Update category percentages
export const updateCategories = async (email, categories) => {
  return updateUser(email, { categories });
};

// Add message for a user
export const addMessage = async (email, message) => {
  const user = findUserByEmail(email);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  // If message is already an object with id, use it directly
  if (message.id) {
    // Update user messages
    return updateUser(email, {
      messages: [...user.messages, message],
    });
  }
  // If message is an array, handle differently (deprecated approach)
  else if (Array.isArray(message)) {
    console.warn(
      "Passing array to addMessage is deprecated. Pass single message object instead."
    );
    const lastMessage = message[message.length - 1];
    if (lastMessage) {
      return updateUser(email, {
        messages: [...user.messages, lastMessage],
      });
    }
    return { success: false, message: "No valid message found in array" };
  }
  // Otherwise, create a new message with an ID
  else {
    const newId =
      user.messages.length > 0
        ? Math.max(...user.messages.map((m) => m.id)) + 1
        : 1;

    const newMessage = {
      id: newId,
      ...message,
      time:
        message.time ||
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    // Update user messages
    return updateUser(email, {
      messages: [...user.messages, newMessage],
    });
  }
};

// Recalculate total balance based on transactions
export const recalculateBalance = async (email) => {
  const user = findUserByEmail(email);

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

  return updateUser(email, { totalBalance: balance });
};
