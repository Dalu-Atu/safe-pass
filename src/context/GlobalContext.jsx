// GlobalContext.js
import React, { createContext, useState } from "react";

// 1. Create Context
export const GlobalContext = createContext();

// 2. Create Provider Component
export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    avatar: "AJ",
    totalBalance: 5825.42,
    spendingByPeriod: {
      Day: 125.36,
      Week: 432.89,
      Month: 1244.02,
      Year: 14568.75,
    },
    // Transaction categories with spending breakdown for chart
    categories: [
      { name: "Shopping", color: "#7C3AED", percentage: 15 }, // Purple
      { name: "Food", color: "#EF4444", percentage: 22 }, // Red
      { name: "Entertainment", color: "#3B82F6", percentage: 8 }, // Blue
      { name: "Housing", color: "#F59E0B", percentage: 35 }, // Yellow
      { name: "Others", color: "#10B981", percentage: 20 }, // Green
    ],
    transactions: [
      {
        id: 1,
        name: "Ben Wayne",
        description: "Thanks for the dinner!",
        amount: "128.00",
        time: "1:22PM",
        icon: "B",
        color: "bg-gray-300",
        isPositive: true,
        date: "2025-04-29",
      },
      {
        id: 2,
        name: "Carhartt",
        description: "Dubai Mall",
        amount: "234.00",
        time: "12:45PM",
        icon: "C",
        color: "bg-purple-500",
        isPositive: false,
        date: "2025-04-29",
      },
      {
        id: 3,
        name: "Subscription",
        description: "Netflix",
        amount: "18.00",
        time: "12:32PM",
        icon: "N",
        color: "bg-red-500",
        isPositive: false,
        date: "2025-04-29",
      },
      {
        id: 4,
        name: "Damien Light",
        description: "You won!",
        amount: "20.00",
        time: "12:22PM",
        icon: "D",
        color: "bg-blue-400",
        isPositive: false,
        date: "2025-04-29",
      },
      {
        id: 5,
        name: "Salary",
        description: "Monthly income",
        amount: "3500.00",
        time: "9:05AM",
        icon: "$",
        color: "bg-green-500",
        isPositive: true,
        date: "2025-04-28",
      },
      {
        id: 6,
        name: "Grocery Store",
        description: "Weekly shopping",
        amount: "87.32",
        time: "6:45PM",
        icon: "G",
        color: "bg-yellow-500",
        isPositive: false,
        date: "2025-04-28",
      },
    ],
    messages: [
      {
        id: 1,
        sender: "agent",
        name: "Emma Thompson",
        text: "Hi there! Welcome to Acme Support. How can I help you today?",
        time: "10:03 AM",
      },
    ],
  });

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
