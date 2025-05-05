import { useState, useEffect } from "react";
import {
  LineChart,
  Area,
  AreaChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  Wallet,
  Layers,
  Globe,
  DollarSign,
  Briefcase,
  TrendingUp,
  Check,
  Shield,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Demo data for charts and tables
const cryptoData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 62784.52,
    change: 2.34,
    volume: "35.2B",
    marketCap: "1.21T",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 3421.87,
    change: -0.78,
    volume: "15.7B",
    marketCap: "409.3B",
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 178.21,
    change: 5.12,
    volume: "8.4B",
    marketCap: "76.8B",
  },
  {
    name: "Cardano",
    symbol: "ADA",
    price: 0.62,
    change: 0.21,
    volume: "1.8B",
    marketCap: "21.7B",
  },
];

const forexData = [
  { pair: "EUR/USD", price: 1.0825, change: -0.15 },
  { pair: "GBP/USD", price: 1.2654, change: 0.23 },
  { pair: "USD/JPY", price: 155.42, change: -0.32 },
  { pair: "AUD/USD", price: 0.6542, change: 0.18 },
];

const stockData = [
  { symbol: "AAPL", price: 231.78, change: 1.45 },
  { symbol: "MSFT", price: 412.65, change: 0.92 },
  { symbol: "GOOG", price: 176.32, change: -0.75 },
  { symbol: "AMZN", price: 182.19, change: 2.34 },
];

const bitcoinHistorical = [
  { date: "Jan", price: 42000 },
  { date: "Feb", price: 44500 },
  { date: "Mar", price: 47000 },
  { date: "Apr", price: 52000 },
  { date: "May", price: 48000 },
  { date: "Jun", price: 54000 },
  { date: "Jul", price: 58000 },
  { date: "Aug", price: 62000 },
  { date: "Sep", price: 59000 },
  { date: "Oct", price: 62784 },
];

const marketHistorical = [
  { date: "Jan", s_p: 4800, nasdaq: 16700, dow: 38500 },
  { date: "Feb", s_p: 4850, nasdaq: 16800, dow: 38700 },
  { date: "Mar", s_p: 4900, nasdaq: 17000, dow: 39000 },
  { date: "Apr", s_p: 4950, nasdaq: 17200, dow: 39300 },
  { date: "May", s_p: 5000, nasdaq: 17400, dow: 39500 },
  { date: "Jun", s_p: 5100, nasdaq: 17600, dow: 39800 },
  { date: "Jul", s_p: 5050, nasdaq: 17500, dow: 39700 },
  { date: "Aug", s_p: 5150, nasdaq: 17800, dow: 40000 },
  { date: "Sep", s_p: 5200, nasdaq: 18000, dow: 40200 },
  { date: "Oct", s_p: 5250, nasdaq: 18200, dow: 40500 },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content:
      "FinanceHub transformed how I manage my business finances. The integrated platform saves me hours each week.",
    avatar: "/api/placeholder/48/48",
  },
  {
    name: "Michael Chen",
    role: "Professional Investor",
    content:
      "The real-time data and analytics have given me an edge in my investment decisions. Best platform I've used.",
    avatar: "/api/placeholder/48/48",
  },
  {
    name: "Emma Rodriguez",
    role: "Crypto Trader",
    content:
      "The crypto trading tools are exceptional. I've increased my portfolio by 34% since switching to FinanceHub.",
    avatar: "/api/placeholder/48/48",
  },
];

export default function FinanceHubLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("markets");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 bg-opacity-70 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="flex items-center">
                  <Wallet className="h-8 w-8 text-blue-400" />
                  <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    FinanceHub
                  </span>
                </span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="#home"
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-700"
                  >
                    Home
                  </a>
                  <a
                    href="#banking"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Banking
                  </a>
                  <a
                    href="#investments"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Investments
                  </a>
                  <a
                    href="#crypto"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Crypto
                  </a>

                  <a
                    href="#testimonial"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Testimonial
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none">
                      <User className="h-8 w-8 rounded-full p-1 bg-gray-700" />
                    </button>
                    <span className="ml-2 text-sm font-medium text-gray-300">
                      Account
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="ml-4 flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">
                  <button
                    onClick={() => navigate("/login")}
                    className="font-medium text-sm"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-700"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Banking
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Investments
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Crypto
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Forex
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                About
              </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 rounded-full p-1 bg-gray-700" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    Account
                  </div>
                </div>
                <button className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none">
                  <Bell className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-8 pb-16 md:pt-16 md:pb-20 lg:pb-28">
            <div className="mt-12 sm:mt-16 lg:mt-20">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                  <h1>
                    <span className="block text-sm font-semibold uppercase tracking-wide text-blue-400">
                      Next Generation Finance
                    </span>
                    <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                      <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Banking, Investments & Crypto
                      </span>
                      <span className="block text-white">
                        All in One Platform
                      </span>
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Access global markets, manage your finances, and grow your
                    wealth with our comprehensive financial platform. Real-time
                    data, advanced analytics, and secure transactions.
                  </p>
                  <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <a
                        href="/login"
                        className="rounded-md border border-transparent px-6 py-3 bg-blue-600 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
                      >
                        Get Started
                      </a>
                      <a
                        href="/login"
                        className="rounded-md border border-gray-300 bg-gray-800 px-6 py-3 text-base font-medium text-gray-100 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                  <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                    <div className="relative block w-full bg-gray-800 rounded-lg overflow-hidden">
                      <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-semibold text-white">
                            Market Overview
                          </h3>
                          <p className="text-sm text-gray-400">
                            {currentTime.toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="space-y-1 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center text-sm font-medium">
                              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                              S&P 500
                            </span>
                            <span className="text-sm font-medium text-green-400">
                              +1.2%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center text-sm font-medium">
                              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                              NASDAQ
                            </span>
                            <span className="text-sm font-medium text-green-400">
                              +0.8%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center text-sm font-medium">
                              <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
                              Bitcoin
                            </span>
                            <span className="text-sm font-medium text-green-400">
                              +2.3%
                            </span>
                          </div>
                        </div>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketHistorical}>
                              <defs>
                                <linearGradient
                                  id="colorS&P"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="colorNasdaq"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor="#a855f7"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor="#a855f7"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#1f2937",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="s_p"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorS&P)"
                              />
                              <Area
                                type="monotone"
                                dataKey="nasdaq"
                                stroke="#a855f7"
                                fillOpacity={1}
                                fill="url(#colorNasdaq)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <button className="text-sm font-medium text-blue-400 hover:text-blue-300">
                            View Details
                          </button>
                          <span className="text-xs text-gray-400">
                            Data updated: May 4, 2025
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="banking" className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase">
              Comprehensive Platform
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Everything you need in one place
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              Manage all your financial needs with our powerful all-in-one
              platform.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-800 rounded-lg px-6 py-8 border border-gray-700 hover:border-blue-500 transition-colors duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-white">Banking</h3>
                <p className="mt-2 text-base text-gray-300">
                  Secure checking and savings accounts with competitive interest
                  rates and no hidden fees.
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg px-6 py-8 border border-gray-700 hover:border-blue-500 transition-colors duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-white">Investments</h3>
                <p className="mt-2 text-base text-gray-300">
                  Access global stocks, ETFs, bonds, and mutual funds with
                  advanced portfolio management tools.
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg px-6 py-8 border border-gray-700 hover:border-blue-500 transition-colors duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white mb-4">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  Cryptocurrency
                </h3>
                <p className="mt-2 text-base text-gray-300">
                  Buy, sell, and store cryptocurrencies with institutional-grade
                  security and real-time market data.
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg px-6 py-8 border border-gray-700 hover:border-blue-500 transition-colors duration-300">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-white">
                  Forex Trading
                </h3>
                <p className="mt-2 text-base text-gray-300">
                  Trade currency pairs with competitive spreads, advanced
                  charting tools, and automated strategies.
                </p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section id="investments" className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase">
              Live Markets
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Real-time market data
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              Stay informed with up-to-the-minute data from global financial
              markets.
            </p>
          </div>

          {/* Market Tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-700">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab("markets")}
                  className={`${
                    activeTab === "markets"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Stock Markets
                </button>
                <button
                  onClick={() => setActiveTab("crypto")}
                  className={`${
                    activeTab === "crypto"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Cryptocurrencies
                </button>
                <button
                  onClick={() => setActiveTab("forex")}
                  className={`${
                    activeTab === "forex"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Forex
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === "markets" && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Major Indices
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">
                            S&P 500
                          </span>
                          <span className="text-green-400 font-semibold">
                            +1.2%
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          5,248.72
                        </div>
                        <div className="text-sm text-gray-400">
                          +62.15 today
                        </div>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">
                            NASDAQ
                          </span>
                          <span className="text-green-400 font-semibold">
                            +0.8%
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          18,204.35
                        </div>
                        <div className="text-sm text-gray-400">
                          +145.25 today
                        </div>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">
                            Dow Jones
                          </span>
                          <span className="text-green-400 font-semibold">
                            +0.9%
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          40,512.68
                        </div>
                        <div className="text-sm text-gray-400">
                          +364.61 today
                        </div>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">
                            FTSE 100
                          </span>
                          <span className="text-red-400 font-semibold">
                            -0.2%
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          8,146.35
                        </div>
                        <div className="text-sm text-gray-400">
                          -16.29 today
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Top Stocks
                    </h3>
                    <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-700">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-800">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                              >
                                Symbol
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                              >
                                Price
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                              >
                                Change
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-900 divide-y divide-gray-700">
                            {stockData.map((stock, index) => (
                              <tr key={index} className="hover:bg-gray-800">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                  {stock.symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">
                                  ${stock.price.toFixed(2)}
                                </td>
                                <td
                                  className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                                    stock.change > 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {stock.change > 0 ? "+" : ""}
                                  {stock.change}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Market Trend
                    </h3>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={marketHistorical}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#374151"
                            />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "none",
                                borderRadius: "0.375rem",
                              }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="s_p"
                              name="S&P 500"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="nasdaq"
                              name="NASDAQ"
                              stroke="#a855f7"
                              strokeWidth={2}
                              dot={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="dow"
                              name="Dow Jones"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          Market data for the past 10 months
                        </div>
                        <button className="text-sm text-blue-400 hover:text-blue-300">
                          See detailed analysis
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "crypto" && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Cryptocurrency Market
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">
                            Bitcoin
                          </span>
                          <span className="text-green-400 font-semibold">
                            +2.34%
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          $62,784.52
                        </div>
                        <div className="text-sm text-gray-400">
                          24h Vol: $35.2B
                        </div>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">
                            Ethereum
                          </span>
                          <span className="text-red-400 font-semibold">
                            -0.78%
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          $3,421.87
                        </div>
                        <div className="text-sm text-gray-400">
                          24h Vol: $15.7B
                        </div>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">
                            Solana
                          </span>
                          <span className="text-green-400 font-semibold">
                            +5.12%
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          $178.21
                        </div>
                        <div className="text-sm text-gray-400">
                          24h Vol: $8.4B
                        </div>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-400">
                            Cardano
                          </span>
                          <span className="text-green-400 font-semibold">
                            +0.21%
                          </span>
                        </div>
                        <div className="text-xl font-bold text-white mb-2">
                          $0.62
                        </div>
                        <div className="text-sm text-gray-400">
                          24h Vol: $1.8B
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Top Cryptocurrencies
                    </h3>
                    <div className="bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-700">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-800">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                              >
                                Symbol
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                              >
                                Price
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                              >
                                24h Change
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                              >
                                Market Cap
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-900 divide-y divide-gray-700">
                            {cryptoData.map((crypto, index) => (
                              <tr key={index} className="hover:bg-gray-800">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                  {crypto.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {crypto.symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">
                                  ${crypto.price.toFixed(2)}
                                </td>
                                <td
                                  className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                                    crypto.change > 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {crypto.change > 0 ? "+" : ""}
                                  {crypto.change}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-300">
                                  ${crypto.marketCap}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Bitcoin Price Trend
                    </h3>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={bitcoinHistorical}>
                            <defs>
                              <linearGradient
                                id="colorBtc"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#f7931a"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#f7931a"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#374151"
                            />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "none",
                                borderRadius: "0.375rem",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="price"
                              name="BTC Price"
                              stroke="#f7931a"
                              fillOpacity={1}
                              fill="url(#colorBtc)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          Bitcoin price for the past 10 months
                        </div>
                        <button className="text-sm text-blue-400 hover:text-blue-300">
                          View trading tools
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "forex" && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Major Currency Pairs
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {forexData.map((pair, index) => (
                        <div
                          key={index}
                          className="bg-gray-900 p-4 rounded-lg border border-gray-700"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-400">
                              {pair.pair}
                            </span>
                            <span
                              className={`font-semibold ${
                                pair.change > 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {pair.change > 0 ? "+" : ""}
                              {pair.change}%
                            </span>
                          </div>
                          <div className="text-xl font-bold text-white mb-2">
                            {pair.price.toFixed(4)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {pair.change > 0 ? "Rising" : "Falling"} trend
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Forex Market Insights
                    </h3>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                      <div className="mb-6">
                        <h4 className="text-lg font-medium text-white mb-3">
                          Market News
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex space-x-3">
                            <span className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <Check className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-gray-300">
                              EUR/USD rises after ECB signals potential rate
                              adjustment in June meeting
                            </span>
                          </li>
                          <li className="flex space-x-3">
                            <span className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <Check className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-gray-300">
                              GBP strengthens following better-than-expected UK
                              employment data
                            </span>
                          </li>
                          <li className="flex space-x-3">
                            <span className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <Check className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-gray-300">
                              JPY weakens as Bank of Japan maintains ultra-loose
                              monetary policy
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-3">
                          Economic Calendar
                        </h4>
                        <div className="overflow-hidden rounded-md border border-gray-700">
                          <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                >
                                  Time
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                >
                                  Currency
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                >
                                  Event
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                                >
                                  Impact
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-gray-900 divide-y divide-gray-700">
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  08:30
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  USD
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                                  Non-Farm Payrolls
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-200">
                                    High
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  12:45
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  EUR
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                                  ECB Rate Decision
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-200">
                                    High
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  19:00
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                  GBP
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                                  Consumer Price Index
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-200">
                                    Medium
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trading Platform Preview */}
      <section
        id="crypto"
        className="py-16 bg-gradient-to-b from-gray-900 to-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase">
              Advanced Platform
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Powerful trading tools
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              Access sophisticated analytics and powerful trading tools on our
              comprehensive platform.
            </p>
          </div>

          <div className="mt-12 relative">
            <div className="relative bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700">
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-3">
                        Watchlist
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">BTC/USD</span>
                          <span className="text-green-400">$62,784.52</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">ETH/USD</span>
                          <span className="text-red-400">$3,421.87</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">AAPL</span>
                          <span className="text-green-400">$231.78</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">MSFT</span>
                          <span className="text-green-400">$412.65</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">EUR/USD</span>
                          <span className="text-red-400">1.0825</span>
                        </div>
                      </div>
                      <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm">
                        Add Symbol
                      </button>
                    </div>
                    <div className="w-full md:w-3/4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">
                          BTC/USD Chart
                        </h3>
                        <div className="flex space-x-2">
                          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-1 px-2 rounded-md text-xs">
                            1H
                          </button>
                          <button className="bg-blue-600 text-white font-medium py-1 px-2 rounded-md text-xs">
                            1D
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-1 px-2 rounded-md text-xs">
                            1W
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-1 px-2 rounded-md text-xs">
                            1M
                          </button>
                        </div>
                      </div>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={bitcoinHistorical}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#374151"
                            />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis
                              domain={["dataMin - 2000", "dataMax + 2000"]}
                              stroke="#9ca3af"
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "none",
                                borderRadius: "0.375rem",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="#f7931a"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-900 p-2 rounded-md">
                          <div className="text-xs text-gray-400">Open</div>
                          <div className="text-sm text-white font-medium">
                            $61,245.32
                          </div>
                        </div>
                        <div className="bg-gray-900 p-2 rounded-md">
                          <div className="text-xs text-gray-400">High</div>
                          <div className="text-sm text-green-400 font-medium">
                            $63,102.78
                          </div>
                        </div>
                        <div className="bg-gray-900 p-2 rounded-md">
                          <div className="text-xs text-gray-400">Low</div>
                          <div className="text-sm text-red-400 font-medium">
                            $60,987.41
                          </div>
                        </div>
                        <div className="bg-gray-900 p-2 rounded-md">
                          <div className="text-xs text-gray-400">Volume</div>
                          <div className="text-sm text-white font-medium">
                            $35.2B
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-3">
                        Order Book
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>Price (USD)</span>
                            <span>Amount (BTC)</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-green-400 text-sm">
                              <span>62,756.24</span>
                              <span>0.5421</span>
                            </div>
                            <div className="flex justify-between text-green-400 text-sm">
                              <span>62,742.13</span>
                              <span>0.3215</span>
                            </div>
                            <div className="flex justify-between text-green-400 text-sm">
                              <span>62,735.87</span>
                              <span>1.2648</span>
                            </div>
                            <div className="flex justify-between text-green-400 text-sm">
                              <span>62,721.35</span>
                              <span>0.8742</span>
                            </div>
                            <div className="flex justify-between text-green-400 text-sm">
                              <span>62,708.91</span>
                              <span>0.4516</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>Price (USD)</span>
                            <span>Amount (BTC)</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-red-400 text-sm">
                              <span>62,801.45</span>
                              <span>0.2418</span>
                            </div>
                            <div className="flex justify-between text-red-400 text-sm">
                              <span>62,815.29</span>
                              <span>0.6795</span>
                            </div>
                            <div className="flex justify-between text-red-400 text-sm">
                              <span>62,831.76</span>
                              <span>0.5124</span>
                            </div>
                            <div className="flex justify-between text-red-400 text-sm">
                              <span>62,842.18</span>
                              <span>1.0324</span>
                            </div>
                            <div className="flex justify-between text-red-400 text-sm">
                              <span>62,859.73</span>
                              <span>0.8916</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-3">
                        Trade
                      </h3>
                      <div className="flex mb-4">
                        <button className="flex-1 py-2 text-center font-medium rounded-l-md bg-green-600 text-white hover:bg-green-700">
                          Buy
                        </button>
                        <button className="flex-1 py-2 text-center font-medium rounded-r-md bg-gray-700 text-gray-300 hover:bg-gray-600">
                          Sell
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Price
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              value="62,784.52"
                              className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                              readOnly
                            />
                            <span className="ml-2 inline-flex items-center px-3 py-2 border border-gray-700 bg-gray-900 text-gray-400 text-sm rounded-md">
                              USD
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Amount
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              placeholder="0.00"
                              className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                            />
                            <span className="ml-2 inline-flex items-center px-3 py-2 border border-gray-700 bg-gray-900 text-gray-400 text-sm rounded-md">
                              BTC
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Total
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              placeholder="0.00"
                              className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                            />
                            <span className="ml-2 inline-flex items-center px-3 py-2 border border-gray-700 bg-gray-900 text-gray-400 text-sm rounded-md">
                              USD
                            </span>
                          </div>
                        </div>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                          Buy Bitcoin
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonial"
        className="py-16 bg-gradient-to-b from-gray-800 to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              What our users say
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              Join thousands of satisfied users who have transformed their
              financial experience.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <p className="h-12 w-12 rounded-full" />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">
                  Ready to transform your financial future?
                </span>
              </h2>
              <p className="mt-3 text-lg text-blue-100 md:mt-5">
                Join thousands of investors who are taking control of their
                finances with FinanceHub.
              </p>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <a
                href="/login"
                className="rounded-md border border-transparent px-6 py-3 bg-blue-600 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="rounded-md border border-gray-300 bg-gray-800 px-6 py-3 text-base font-medium text-gray-100 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Products
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Banking
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Investments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Crypto
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Forex
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    API Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-400 hover:text-white"
                  >
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <div className="flex items-center">
                <Wallet className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  FinanceHub
                </span>
              </div>
              <p className="mt-2 text-base text-gray-400">
                &copy; {new Date().getFullYear()} FinanceHub. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
