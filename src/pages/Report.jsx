import { useState } from "react";
import { ArrowLeft, Calendar, ChartBarIncreasing } from "lucide-react";
import { Home, CreditCard, PieChart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { useAuth } from "../context/AuthContext";

export default function Report() {
  const { user } = useAuth();

  // User data including transactions and financial summary

  // Get current date for UI
  const currentDate = new Date();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonthYear = `${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  // Time period selection
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  const periods = ["Day", "Week", "Month", "Year"];

  // Calculate total spent for selected period
  const spentAmount = user.spending_by_period[selectedPeriod];

  // Group transactions by date for display
  const groupedTransactions = user.transactions.reduce(
    (groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {}
  );

  // Get today's date in YYYY-MM-DD format for labeling
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Function to get readable date label
  const getDateLabel = (dateStr) => {
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="">
      {/* Navigation header */}
      <div className="px-4 py-3 flex justify-between items-center">
        <Link to={-1} className="flex items-center">
          <ArrowLeft size={20} className="mr-2 text-gray-700" />
          <span className="font-medium text-gray-900">Home</span>
        </Link>
        <button className="flex items-center bg-gray-100 px-2 py-1 rounded-lg">
          <Calendar size={16} className="mr-1 text-gray-600" />
          <span className="text-sm text-gray-700">{currentMonthYear}</span>
        </button>
      </div>

      {/* Spending circle chart */}
      <div className="px-4 py-6 flex flex-col items-center justify-center bg-gray-50">
        <div className="relative w-48 h-48 flex items-center justify-center mb-4">
          {/* Circle segments */}
          <svg className="absolute w-full h-full" viewBox="0 0 100 100">
            {user.categories.map((category, index) => {
              // Calculate stroke lengths for each segment
              const strokeLength = category.percentage * 2.51; // 251.2 is approx circumference with r=40
              let strokeOffset = 0;

              // Calculate offset based on previous segments
              for (let i = 0; i < index; i++) {
                strokeOffset -= user.categories[i].percentage * 2.51;
              }

              return (
                <circle
                  key={category.name}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={category.color}
                  strokeWidth="10"
                  strokeDasharray={`${strokeLength} ${251.2 - strokeLength}`}
                  strokeDashoffset={strokeOffset}
                  transform="rotate(-90 50 50)"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="z-10 text-center">
            <div className="text-sm text-gray-500 mb-1">
              Spent this {selectedPeriod.toLowerCase()}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${spentAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Time period selector */}
        <div className="bg-white rounded-full px-1 py-1 flex space-x-1 shadow">
          {periods.map((period) => (
            <button
              key={period}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedPeriod === period
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div className="flex-1 px-4 mt-2 overflow-y-auto pb-5">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="font-medium text-gray-900">Transactions</h2>
          </div>

          {Object.keys(groupedTransactions)
            .sort()
            .reverse()
            .map((date) => (
              <div key={date}>
                <div className="text-xs text-gray-500 mb-2 mt-4">
                  {getDateLabel(date)}
                </div>

                <div className="space-y-4">
                  {groupedTransactions[date].map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${transaction.color} flex items-center justify-center mr-3`}
                        >
                          <span className="text-white">{transaction.icon}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {transaction.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={
                            transaction.isPositive
                              ? "text-green-500"
                              : "text-gray-800"
                          }
                        >
                          {transaction.isPositive ? "+" : "-"}$
                          {transaction.amount}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50">
        <div className="flex justify-between items-center px-6 py-4">
          <Link to={"/dashboard"} className="flex flex-col items-center">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to={"/stocks"}
            className="flex flex-col items-center text-gray-400"
          >
            <ChartBarIncreasing size={20} />
            <span className="text-xs mt-1">Insight</span>
          </Link>
          <Link
            to={"/report"}
            className="flex flex-col items-center text-gray-400"
          >
            <PieChart size={20} />
            <span className="text-xs mt-1">Report</span>
          </Link>
          <Link to={"/cs"} className="flex flex-col items-center text-gray-400">
            <User size={20} />
            <span className="text-xs mt-1">Customer service</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
