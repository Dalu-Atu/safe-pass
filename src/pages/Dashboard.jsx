import { useContext, useState } from "react";
import {
  Home,
  CreditCard,
  PieChart,
  User,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
  CheckSquare,
  DollarSign,
  Coffee,
  ShoppingBag,
  ArrowRight,
  X,
  Clock,
  Copy,
  UserRound,
  MessageCircle,
  ChartBarIncreasing,
  CircleDollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

import { TrendingUp, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { GlobalContext } from "../context/GlobalContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

function InvestmentROIDashboard() {
  const [activeFilter, setActiveFilter] = useState("All");

  // Sample data for investments
  const investments = [
    {
      name: "Tech Stocks",
      category: "Stocks",
      roi: 15.4,
      profit: 2340.0,
      trend: "up",
      icon: <TrendingUp size={18} className="text-blue-400" />,
    },
    {
      name: "Real Estate Fund",
      category: "Real Estate",
      roi: 8.7,
      profit: 1250.0,
      trend: "up",
      icon: <PieChart size={18} className="text-purple-400" />,
    },
    {
      name: "Crypto Portfolio",
      category: "Cryptocurrency",
      roi: -3.2,
      profit: -450.0,
      trend: "down",
      icon: <TrendingUp size={18} className="text-orange-400" />,
    },
  ];

  return (
    <div className="pt-5">
      {/* ROI Performance */}
      <div className="px-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg text-gray-200">
            Investment Performance
          </h3>
          <button className="text-sm text-blue-400">See all</button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mt-2">
          <button
            className={`text-sm ${
              activeFilter === "All"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-500"
            } pb-1`}
            onClick={() => setActiveFilter("All")}
          >
            All
          </button>
          <button
            className={`text-sm ${
              activeFilter === "Profitable"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-500"
            } pb-1`}
            onClick={() => setActiveFilter("Profitable")}
          >
            Profitable
          </button>
          <button
            className={`text-sm ${
              activeFilter === "Loss"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-500"
            } pb-1`}
            onClick={() => setActiveFilter("Loss")}
          >
            Loss
          </button>
        </div>

        {/* Investments List */}
        <div className="mt-4 space-y-4">
          {investments.map((investment, index) => (
            <div
              key={index}
              className={`flex items-center justify-between ${
                index > 0 ? "pt-4 border-t border-gray-700" : ""
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`${
                    investment.trend === "up" ? "bg-blue-900" : "bg-orange-900"
                  } p-3 rounded-full mr-3`}
                >
                  {investment.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-200">
                    {investment.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {investment.category}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-medium ${
                    investment.trend === "up"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {investment.roi > 0 ? "+" : ""}
                  {investment.roi}%
                </div>
                <div
                  className={`text-sm ${
                    investment.trend === "up"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {investment.profit > 0 ? "+" : ""}$
                  {Math.abs(investment.profit).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QRCode() {
  // QR code data for example.com
  const qrData = [
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
  ];

  const cellSize = 8;
  const margin = 20;
  const size = qrData.length * cellSize + 2 * margin;

  return (
    <div className="bg-gray-800 p-3 border border-gray-700 rounded-xl mb-4">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-48 h-48"
        style={{
          background: "#1f2937",
          padding: "12px",
        }}
      >
        <rect x="0" y="0" width={size} height={size} fill="#1f2937" />
        {qrData.map((row, i) =>
          row.map(
            (cell, j) =>
              cell === 1 && (
                <rect
                  key={`${i}-${j}`}
                  x={j * cellSize + margin}
                  y={i * cellSize + margin}
                  width={cellSize}
                  height={cellSize}
                  fill="white"
                />
              )
          )
        )}
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [fundsAmount, setFundsAmount] = useState("");
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [countdown, setCountdown] = useState(900);
  const { user } = useAuth();
  console.log(user);

  const handleAddFunds = () => {
    setShowAddFundsModal(true);
  };

  const handleCloseModal = () => {
    setShowAddFundsModal(false);
    setFundsAmount("");
  };

  const handleSubmitFunds = () => {
    if (fundsAmount && parseFloat(fundsAmount) > 0) {
      setShowAddFundsModal(false);
      setShowPaymentPage(true);
    }
  };

  const handleBackToHome = () => {
    setShowPaymentPage(false);
    setFundsAmount("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Main Home Screen
  if (!showPaymentPage) {
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans max-w-md mx-auto overflow-hidden relative">
        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="rounded-full overflow-hidden w-10 h-10 mr-3 border-2 border-blue-500">
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2U3NmY1MSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI1MCIgZmlsbD0iI2ZiZDM4YyIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjIzMCIgcj0iMTAwIiBmaWxsPSIjZmJkMzhjIi8+PHRleHQgeD0iMTAwIiB5PSI5MCIgZm9udC1zaXplPSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiI+RVM8L3RleHQ+PC9zdmc+"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-blue-400">Hi, {user.name}</div>
              <div className="text-xs text-gray-400">Welcome back!</div>
            </div>
          </div>
          <Link to={"/cs"} className="relative top--9">
            <MessageCircle color="#9ca3af" size={"20px"} />
          </Link>
        </div>
        {/* Balance Card */}
        <div className="mx-6 rounded-xl p-5 text-white bg-gradient-to-r from-blue-800 to-purple-900">
          <div className="text-lg font-medium">Balance</div>

          <div className="flex items-center mt-1">
            <div className="text-3xl font-bold">
              {showBalance ? `$${user.total_balance}` : "••••••••••"}
            </div>
            <button
              className="ml-2"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-300">**** **** **** 4312</div>
            <div className="bg-gray-800 rounded w-10 h-6 flex items-center justify-center">
              <svg
                viewBox="0 0 1000 324.68"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-4"
              >
                <path
                  fill="#0066B2"
                  d="M651.17,0c-70.94,0-134.33,36.91-134.33,104.7c0,77.55,112.29,83.17,112.29,122.15 c0,16.47-18.89,31.22-50.89,31.22c-45.99,0-80.4-20.6-80.4-20.6l-14.72,68.55c0,0,39.58,17.42,91.95,17.42 c78.05,0,141.58-38.53,141.58-107.87c0-82.71-112.74-88.13-112.74-123.57c0-12.85,15.51-26.91,47.37-26.91 c36.06,0,65.77,14.92,65.77,14.92l14.33-66.03C731.36,14,696.42,0,651.17,0z"
                />
                <polygon
                  fill="#0066B2"
                  points="321.22,8.9 321.22,8.88 254.16,8.88 182.32,232.62 118.53,8.88 55.17,8.9 0.09,8.9 0.1,8.93 0,8.9 0,9.04 0.02,9.06 0.09,9.39 0.09,9.41 117.16,317.41 117.16,317.43 185.25,317.43 185.42,316.73 185.47,316.74 241.63,116.35 241.68,116.35 267.95,9.34 321.22,9.31 321.22,9.13 321.22,9.1 "
                />
                <polygon
                  fill="#0066B2"
                  points="976.04,8.88 875.7,8.88 873.37,9.52 860.76,54.57 855.71,73.57 855.71,73.55 798.76,317.41 798.76,317.46 866.78,317.46 866.78,317.41 931.43,8.93 976.04,8.93 "
                />
                <path
                  fill="#0066B2"
                  d="M536.49,8.88l-99.32,308.55h-65.55l49.28-252.48c0,0-1.93-20.74-24.45-36.96c-8.71-6.29-28.27-12.32-49.46-16.41 c0,0,2.95-8.3,5.74-13.55h85.26c22.91,0,28.33,17.45,28.33,17.45L536.49,8.88z"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 px-6 mt-4">
          <button
            className="flex items-center bg-gray-800 rounded-xl p-3"
            onClick={handleAddFunds}
          >
            <div className="bg-blue-900 p-2 rounded-full mr-2">
              <Plus size={16} className="text-blue-400" />
            </div>
            <span className="text-sm font-medium">Add Funds</span>
          </button>
          <Link
            to={"/stocks"}
            className="flex items-center bg-gray-800 rounded-xl p-3"
          >
            <div className="bg-blue-900 p-2 rounded-full mr-2">
              <ArrowUpRight size={16} className="text-blue-400" />
            </div>
            <span className="text-sm font-medium">View Stocks</span>
          </Link>
          <Link
            to={"/cryptos"}
            className="flex items-center bg-gray-800 rounded-xl p-3"
          >
            <div className="bg-blue-900 p-2 rounded-full mr-2">
              <CheckSquare size={16} className="text-blue-400" />
            </div>
            <span className="text-sm font-medium">View Cryptos</span>
          </Link>
          <Link
            to={"/transfer"}
            className="flex items-center bg-gray-800 rounded-xl p-3"
          >
            <div className="bg-blue-900 p-2 rounded-full mr-2">
              <CircleDollarSign size={16} className="text-blue-400" />
            </div>
            <span className="text-sm font-medium">Transfer to Bank</span>
          </Link>
          {/* <button className="flex items-center bg-gray-800 rounded-xl p-3">
            <div className="bg-blue-900 p-2 rounded-full mr-2">
              <DollarSign size={16} className="text-blue-400" />
            </div>
            <span className="text-sm font-medium">Withdraw</span>
          </button> */}
        </div>

        {/* Transaction History */}
        <InvestmentROIDashboard />
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-800 border-t border-gray-700 z-50">
          <div className="flex justify-between items-center px-6 py-4">
            <Link to={"/dashboard"} className="flex flex-col items-center">
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to={"/stocks"}
              className="flex flex-col items-center text-gray-500"
            >
              <ChartBarIncreasing size={20} />
              <span className="text-xs mt-1">Insight</span>
            </Link>
            <Link
              to={"/report"}
              className="flex flex-col items-center text-gray-500"
            >
              <PieChart size={20} />
              <span className="text-xs mt-1">Report</span>
            </Link>
            <Link
              to={"/cs"}
              className="flex flex-col items-center text-gray-500"
            >
              <User size={20} />
              <span className="text-xs mt-1">Customer service</span>
            </Link>
          </div>
        </div>

        {/* Add padding to prevent content from being hidden behind the navigation bar */}
        <div className="pb-20"></div>
        {/* Add Funds Modal */}
        {showAddFundsModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black bg-opacity-70"
              onClick={handleCloseModal}
            ></div>
            <div className="bg-gray-800 rounded-2xl p-6 w-11/12 max-w-md z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-200">
                  Add Funds
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="funds-amount"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Enter amount to add (USD)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="funds-amount"
                    id="funds-amount"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 py-3 sm:text-sm border-gray-600 rounded-md border bg-gray-700 text-white"
                    placeholder="0.00"
                    aria-describedby="funds-amount-currency"
                    value={fundsAmount}
                    onChange={(e) => setFundsAmount(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span
                      className="text-gray-400 sm:text-sm"
                      id="funds-amount-currency"
                    >
                      USD
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                You will be redirected to the payment page after confirmation.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFunds}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!fundsAmount || parseFloat(fundsAmount) <= 0}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // USDT Payment Page
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans max-w-md mx-auto overflow-hidden relative">
      <div className="px-6 pt-4 pb-2 flex items-center">
        <button onClick={handleBackToHome} className="text-blue-400 mr-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-center flex-1">
          USDT Payment
        </h1>
        <div className="w-6"></div> {/* For balance in the header */}
      </div>
      {/* Payment Information */}
      <div className="px-6 py-4">
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-gray-300">Amount</div>
            <div className="text-xl font-bold">${fundsAmount}</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-gray-300">USDT (TRC20)</div>
            <div className="text-lg font-medium">
              {parseFloat(fundsAmount).toFixed(2)} USDT
            </div>
          </div>
          <div className="flex items-center mt-4 text-orange-400">
            <Clock size={16} className="mr-1" />
            <div className="text-sm">
              Payment expires in: {formatTime(countdown)}
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mb-6">
          <QRCode />
          <div className="text-sm font-medium text-gray-300 mt-2 mb-1">
            SCAN QR CODE TO PAY
          </div>
        </div>

        {/* Wallet Address */}
        <div className="border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-medium text-gray-300">
              USDT Address (TRC20)
            </div>
            <button
              onClick={() =>
                copyToClipboard("TYQraQ1YkCZehxYzRFKCkpWY9QQMYgGAZ8")
              }
              className="text-blue-400"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="text-sm font-mono bg-gray-800 p-3 rounded break-all select-all">
            TYQraQ1YkCZehxYzRFKCkpWY9QQMYgGAZ8
          </div>
          <div className="flex items-center mt-4">
            <div className="bg-yellow-50 p-2 rounded-full">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#F0B90B">
                <path d="M12,0L12,0C18.6274,0 24,5.3726 24,12L24,12C24,18.6274 18.6274,24 12,24L12,24C5.3726,24 0,18.6274 0,12L0,12C0,5.3726 5.3726,0 12,0Z"></path>
                <path
                  d="M7.6455,10.8944L12,6.5399L16.3573,10.8944L18.8,8.4517L12,1.6516L5.2,8.4517L7.6455,10.8944Z"
                  fill="white"
                ></path>
                <path
                  d="M5.2,12L7.6455,9.5572L10.0911,12L7.6455,14.4428L5.2,12Z"
                  fill="white"
                ></path>
                <path
                  d="M7.6455,13.1056L12,17.4601L16.3573,13.1056L18.8,15.5483L12,22.3484L5.2,15.5483L7.6455,13.1056Z"
                  fill="white"
                ></path>
                <path
                  d="M13.9089,12L16.3545,9.5572L18.8,12L16.3545,14.4428L13.9089,12Z"
                  fill="white"
                ></path>
                <path
                  d="M10.0911,12L12,10.0911L13.9089,12L12,13.9089L10.0911,12Z"
                  fill="white"
                ></path>
              </svg>
            </div>
            <div className="ml-2">
              <div className="text-xs text-gray-500">Network</div>
              <div className="text-sm font-medium">Tron (TRC20)</div>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Payment Instructions</h3>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
            <li>
              Send exactly{" "}
              <span className="font-medium">
                {parseFloat(fundsAmount).toFixed(2)} USDT
              </span>{" "}
              to the address above
            </li>
            <li>Only use the TRON (TRC20) network for this transaction</li>
            <li>Payment will be confirmed after network confirmation</li>
            <li>This address is for one-time use only</li>
          </ol>
        </div>

        {/* Payment Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="text-yellow-500 w-5 h-5 mt-0.5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-800">
                Waiting for payment
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                Your account will be credited immediately after the transaction
                is confirmed on the blockchain.
              </p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="text-center mb-6">
          <button className="text-blue-600 text-sm font-medium">
            Need help with your payment?
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 w-full bg-gray-300 border-t border-gray-200 p-6">
        <button
          onClick={handleBackToHome}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
