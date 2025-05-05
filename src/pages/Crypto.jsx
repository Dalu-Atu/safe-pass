import { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  AlertCircle,
  Info,
  Coins,
  RefreshCw,
  Clock3,
  ChevronDown,
  Zap,
  Globe,
  DollarSign,
  Sparkles,
  ChartBarIncreasing,
  Home,
  PieChart,
  User,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

const PriceChart = ({ cryptoData, darkMode }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Generate sample chart data based on current price, high, and low
  useEffect(() => {
    if (!cryptoData) return;

    setIsLoading(true);
    setError("");

    try {
      // Calculate price range
      const low = parseFloat(cryptoData.low);
      const high = parseFloat(cryptoData.high);
      const current = parseFloat(cryptoData.price);
      const range = high - low;

      // Generate 24 data points (one per hour) with realistic fluctuations
      const now = new Date();
      const data = [];

      // Start from 24 hours ago
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(now.getHours() - i);

        // Generate a price within the range with some randomization
        // Increasing volatility near the middle and smoother at the edges
        let volatilityFactor;
        if (i > 18 || i < 6) {
          // Lower volatility at edges (early and late hours)
          volatilityFactor = 0.3;
        } else {
          // Higher volatility in the middle of the day
          volatilityFactor = 0.7;
        }

        // Create some general trends
        const trendFactor = cryptoData.change24h >= 0 ? 1 : -1;

        // Closer to current time should be closer to current price
        let hourlyWeight;
        if (i < 4) {
          // Last 4 hours more weighted toward current price
          hourlyWeight = 0.7 + (4 - i) * 0.075;
        } else {
          // Earlier hours more random
          hourlyWeight = 0.5;
        }

        // Random component
        const randomFactor =
          (Math.random() - 0.5) * range * 0.15 * volatilityFactor;

        // Trend component - gradually moving toward final price
        const trendComponent = (range * 0.05 * (24 - i) * trendFactor) / 24;

        // Calculate price - start near middle, gradually move toward current
        let price;
        if (i === 0) {
          // Current time = current price
          price = current;
        } else if (i === 24) {
          // 24 hours ago
          price = current - (cryptoData.change24h / 100) * current;
        } else {
          // In between - use weighted approach
          const baseline = low + range * 0.5; // Middle of range
          const timeWeight = (24 - i) / 24; // Weight increases as we get closer to current time
          price = baseline + trendComponent + randomFactor;

          // Push price toward current as we get closer to present time
          price =
            price * (1 - hourlyWeight) +
            (current -
              (1 - timeWeight) * ((current * cryptoData.change24h) / 100)) *
              hourlyWeight;
        }

        // Ensure price stays within the actual high/low range
        price = Math.max(Math.min(price, high * 1.01), low * 0.99);

        data.push({
          time: time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: price,
          fullTime: time,
        });
      }

      setChartData(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error generating chart data:", err);
      setError("Failed to generate chart data");
      setIsLoading(false);
    }
  }, [cryptoData]);

  // Tooltip customization
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded shadow-lg ${
            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          <p className="text-sm font-medium">{payload[0].payload.time}</p>
          <p className="text-base font-bold">
            $
            {parseFloat(payload[0].value).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format y-axis ticks
  const formatYAxis = (value) => {
    const num = parseFloat(value);
    if (num > 1000) return `$${(num / 1000).toFixed(1)}k`;
    if (num > 1) return `$${num.toFixed(1)}`;
    return `$${num.toFixed(4)}`;
  };

  if (isLoading) {
    return (
      <div
        className={`h-64 ${
          darkMode ? "bg-gray-800/50" : "bg-gray-100"
        } rounded-lg flex items-center justify-center`}
      >
        <div
          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            darkMode ? "border-indigo-400" : "border-indigo-600"
          }`}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`h-64 ${
          darkMode ? "bg-gray-800/50" : "bg-gray-100"
        } rounded-lg flex items-center justify-center`}
      >
        <p
          className={`${darkMode ? "text-gray-500" : "text-gray-400"} text-sm`}
        >
          {"try again later..."}
        </p>
      </div>
    );
  }

  // Prepare gradients and colors
  const isPositive = cryptoData && parseFloat(cryptoData.change24h) >= 0;
  const mainColor = isPositive ? "#10B981" : "#EF4444"; // green or red
  const gradientStart = isPositive
    ? "rgba(16, 185, 129, 0.2)"
    : "rgba(239, 68, 68, 0.2)";
  const gradientEnd = isPositive
    ? "rgba(16, 185, 129, 0)"
    : "rgba(239, 68, 68, 0)";

  // Calculate domain values with slight padding for y-axis
  const dataMin = Math.min(...chartData.map((d) => d.price));
  const dataMax = Math.max(...chartData.map((d) => d.price));
  const padding = (dataMax - dataMin) * 0.1;
  const yDomain = [dataMin - padding, dataMax + padding];

  return (
    <div
      className={`h-64 ${
        darkMode ? "bg-gray-800/50" : "bg-gray-100"
      } rounded-lg p-2`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientStart} stopOpacity={0.8} />
              <stop offset="95%" stopColor={gradientEnd} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: darkMode ? "#9CA3AF" : "#6B7280",
            }}
            tickFormatter={(value, index) => {
              // Show fewer ticks on mobile
              return index % 6 === 0 ? value : "";
            }}
          />
          <YAxis
            domain={yDomain}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: darkMode ? "#9CA3AF" : "#6B7280",
            }}
            tickFormatter={formatYAxis}
            width={50}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={
              darkMode ? "rgba(75, 85, 99, 0.2)" : "rgba(209, 213, 219, 0.6)"
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={mainColor}
            fillOpacity={1}
            fill="url(#colorPrice)"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              fill: mainColor,
              stroke: darkMode ? "#1F2937" : "white",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default function CryptoTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cryptoData, setCryptoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "bitcoin",
    "ethereum",
    "solana",
    "dogecoin",
  ]);
  const [trendingCryptos, setTrendingCryptos] = useState([
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      price: 0,
      change: 0,
      iconColor: "#F7931A",
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      price: 0,
      change: 0,
      iconColor: "#627EEA",
    },
    {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      price: 0,
      change: 0,
      iconColor: "#00FFA3",
    },
    {
      id: "dogecoin",
      symbol: "DOGE",
      name: "Dogecoin",
      price: 0,
      change: 0,
      iconColor: "#C2A633",
    },
    {
      id: "ripple",
      symbol: "XRP",
      name: "Ripple",
      price: 0,
      change: 0,
      iconColor: "#23292F",
    },
    {
      id: "chainlink",
      symbol: "LINK",
      name: "Chainlink",
      price: 0,
      change: 0,
      iconColor: "#2A5ADA",
    },
  ]);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [globalMarketData, setGlobalMarketData] = useState({
    marketCap: "2.65T",
    btcDominance: "52.14",
    ethDominance: "17.63",
    marketChange: "2.41",
    activeCryptos: "12,563",
  });

  // Format currency with appropriate decimals based on value
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "0.00";

    const num = parseFloat(value);
    if (num > 1000)
      return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
    if (num > 1)
      return num.toLocaleString("en-US", { maximumFractionDigits: 4 });
    if (num > 0.01)
      return num.toLocaleString("en-US", { maximumFractionDigits: 6 });
    return num.toLocaleString("en-US", { maximumFractionDigits: 8 });
  };

  // Fetch global market data
  const fetchGlobalData = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/global");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.data) {
        setGlobalMarketData({
          marketCap: formatMarketCap(data.data.total_market_cap.usd),
          btcDominance: data.data.market_cap_percentage.btc.toFixed(2),
          ethDominance: data.data.market_cap_percentage.eth.toFixed(2),
          marketChange:
            data.data.market_cap_change_percentage_24h_usd.toFixed(2),
          activeCryptos: data.data.active_cryptocurrencies.toLocaleString(),
        });
      }
    } catch (error) {
      console.error("Error fetching global data:", error);
    }
  };

  // Format market cap to T/B/M
  const formatMarketCap = (value) => {
    if (!value) return "0";

    if (value >= 1000000000000) {
      return (value / 1000000000000).toFixed(2) + "T";
    } else if (value >= 1000000000) {
      return (value / 1000000000).toFixed(2) + "B";
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + "M";
    }
    return value.toLocaleString();
  };

  // Function to refresh all trending crypto data
  const refreshTrendingData = async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      // First get trending coins from CoinGecko
      const trendingResponse = await fetch(
        "https://api.coingecko.com/api/v3/search/trending"
      );

      if (!trendingResponse.ok) {
        throw new Error(
          `Error fetching trending coins: ${trendingResponse.status}`
        );
      }

      const trendingData = (await trendingResponse.ok)
        ? await trendingResponse.json()
        : null;

      // Get ids of the trending coins
      const coinIds = [];

      // If we got trending data, use those IDs
      if (trendingData && trendingData.coins) {
        const trendingCoins = trendingData.coins.slice(0, 6); // Get top 6 trending
        trendingCoins.forEach((coin) => {
          coinIds.push(coin.item.id);
        });
      } else {
        // Fallback to our default list if trending API fails
        trendingCryptos.forEach((crypto) => {
          coinIds.push(crypto.id);
        });
      }

      // Get detailed data for all coins at once
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(
          ","
        )}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (!priceResponse.ok) {
        throw new Error(`Error fetching coin prices: ${priceResponse.status}`);
      }

      const priceData = await priceResponse.json();

      // Update our trending crypto list with actual data
      const updatedTrending = [];

      priceData.forEach((coin) => {
        updatedTrending.push({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price.toFixed(3),
          change: coin.price_change_percentage_24h,
          iconColor: getIconColor(coin.symbol.toLowerCase()),
          image: coin.image,
        });
      });

      setTrendingCryptos(updatedTrending);
      setLastRefreshed(new Date());

      // Also update global market data
      fetchGlobalData();
    } catch (err) {
      console.error("Error refreshing trending data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Get icon color based on symbol (simplified)
  const getIconColor = (symbol) => {
    const colorMap = {
      btc: "#F7931A",
      eth: "#627EEA",
      sol: "#00FFA3",
      doge: "#C2A633",
      xrp: "#23292F",
      link: "#2A5ADA",
      ltc: "#345D9D",
      ada: "#0033AD",
      dot: "#E6007A",
    };

    return colorMap[symbol] || "#6F7CDA"; // Default color
  };

  // Fetch crypto data for trending coins on component mount
  useEffect(() => {
    refreshTrendingData();
  }, []);

  // Fetch detailed crypto data from CoinGecko API
  const fetchCryptoData = async (query) => {
    if (!query || query.trim() === "") {
      setError("Please enter a valid crypto name or symbol");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // First search for the coin to get the correct ID
      const searchResponse = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      );

      if (!searchResponse.ok) {
        throw new Error(`Error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();

      if (!searchData.coins || searchData.coins.length === 0) {
        throw new Error(`No cryptocurrency found matching '${query}'`);
      }

      // Get the first matching coin ID
      const coinId = searchData.coins[0].id;

      // Get detailed data for the coin
      const coinResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );

      if (!coinResponse.ok) {
        throw new Error(`Error: ${coinResponse.status}`);
      }

      const coinData = await coinResponse.json();

      // Format the data
      const formattedData = {
        id: coinData.id,
        symbol: coinData.symbol.toUpperCase(),
        name: coinData.name,
        price: coinData.market_data.current_price.usd,
        open: null, // CoinGecko free tier doesn't provide this
        high: coinData.market_data.high_24h.usd,
        low: coinData.market_data.low_24h.usd,
        volume: coinData.market_data.total_volume.usd,
        change1h:
          coinData.market_data.price_change_percentage_1h_in_currency?.usd || 0,
        change24h: coinData.market_data.price_change_percentage_24h || 0,
        lastUpdated: new Date(coinData.last_updated).toLocaleString(),
        marketCap: formatMarketCap(coinData.market_data.market_cap.usd),
        volume24h: formatMarketCap(coinData.market_data.total_volume.usd),
        circulatingSupply: formatMarketCap(
          coinData.market_data.circulating_supply
        ),
        maxSupply: coinData.market_data.max_supply
          ? formatMarketCap(coinData.market_data.max_supply)
          : "Unlimited",
        rank: coinData.market_cap_rank || "N/A",
        category: getCoinCategory(coinData),
        image: coinData.image.small,
      };

      setCryptoData(formattedData);

      // Add to recent searches if not already there
      if (!recentSearches.includes(coinData.id)) {
        setRecentSearches((prev) => [coinData.id, ...prev.slice(0, 3)]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch crypto data. Please try again.");
      setCryptoData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to estimate coin category
  const getCoinCategory = (coinData) => {
    // This is a simplified approach - in a real app you'd use CoinGecko's categories endpoint
    const categories = {
      bitcoin: "Currency",
      ethereum: "Smart Contract Platform",
      solana: "Smart Contract Platform",
      dogecoin: "Meme Coin",
      ripple: "Payment",
      chainlink: "Oracle",
      cardano: "Smart Contract Platform",
      litecoin: "Currency",
      polkadot: "Interoperability",
    };

    return categories[coinData.id] || "Cryptocurrency";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCryptoData(searchTerm);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header with glass effect */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search Section with glass effect */}
        <div
          className={`${
            darkMode
              ? "bg-gray-800/50 backdrop-blur-md border border-gray-700"
              : "bg-white backdrop-blur-md border border-gray-100"
          } rounded-xl shadow-lg p-4 md:p-6 mb-6`}
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or symbol (e.g., Bitcoin, BTC)"
                className={`w-full p-3 pl-10 ${
                  darkMode
                    ? "bg-gray-900 border-gray-700 text-gray-200 placeholder-gray-500"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
                } border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
              <Search
                className={`absolute left-3 top-3.5 h-5 w-5 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              <span className="hidden md:inline">Search</span>
            </button>
          </form>

          {/* Recent Searches */}
          <div className="mt-4">
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } flex items-center gap-1 mb-2`}
            >
              <Clock className="h-4 w-4" /> Recent searches:
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setSearchTerm(id);
                    fetchCryptoData(id);
                  }}
                  className={`px-3 py-1 text-xs ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  } rounded-full transition-colors duration-300`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Crypto Data Display */}
        {isLoading ? (
          <div
            className={`${
              darkMode ? "bg-gray-800/50" : "bg-white"
            } rounded-xl shadow-lg p-6 text-center`}
          >
            <div className="flex flex-col items-center justify-center py-10">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                  darkMode ? "border-indigo-400" : "border-indigo-600"
                }`}
              ></div>
              <p
                className={`mt-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Fetching crypto data...
              </p>
            </div>
          </div>
        ) : error ? (
          <div
            className={`${
              darkMode ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-700"
            } p-4 rounded-lg flex items-center gap-3`}
          >
            <AlertCircle className="h-6 w-6" />
            <p>{error}</p>
          </div>
        ) : cryptoData ? (
          <div
            className={`${
              darkMode
                ? "bg-gray-800/50 border border-gray-700"
                : "bg-white border border-gray-100"
            } rounded-xl shadow-lg overflow-hidden backdrop-blur-md`}
          >
            {/* Crypto Header */}
            <div
              className={`p-6 ${
                darkMode
                  ? "border-b border-gray-700"
                  : "border-b border-gray-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    {cryptoData.image && (
                      <img
                        src={cryptoData.image}
                        alt={cryptoData.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold">
                        {cryptoData.name} ({cryptoData.symbol})
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          Rank #{cryptoData.rank}
                        </span>
                        <p
                          className={`${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          } text-xs`}
                        >
                          {cryptoData.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    ${formatCurrency(cryptoData.price)}
                  </p>
                  <div
                    className={`flex items-center gap-1 justify-end ${
                      parseFloat(cryptoData.change24h) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {parseFloat(cryptoData.change24h) >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span>
                      {parseFloat(cryptoData.change24h) > 0 ? "+" : ""}
                      {parseFloat(cryptoData.change24h).toFixed(2)}%
                    </span>
                    <span className="text-xs">(24h)</span>
                  </div>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    } mt-1`}
                  >
                    Last updated: {cryptoData.lastUpdated}
                  </p>
                </div>
              </div>
            </div>

            {/* Live Price Chart */}
            <div
              className={`${
                darkMode
                  ? "bg-gray-900/50 border-b border-gray-700"
                  : "bg-gray-50 border-b border-gray-100"
              } p-6`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Price Chart (24h)</h3>
                <div className="flex gap-1">
                  {["1H", "24H", "7D", "30D"].map((period) => (
                    <button
                      key={period}
                      className={`px-2 py-1 text-xs rounded ${
                        period === "24H"
                          ? darkMode
                            ? "bg-indigo-900/50 text-indigo-400"
                            : "bg-indigo-100 text-indigo-600"
                          : darkMode
                          ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <PriceChart cryptoData={cryptoData} darkMode={darkMode} />
            </div>

            {/* Crypto Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              <div className="space-y-1">
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Market Cap
                </p>
                <p className="font-semibold">${cryptoData.marketCap}</p>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  24h Volume
                </p>
                <p className="font-semibold">${cryptoData.volume24h}</p>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Circulating Supply
                </p>
                <p className="font-semibold">{cryptoData.circulatingSupply}</p>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Max Supply
                </p>
                <p className="font-semibold">{cryptoData.maxSupply}</p>
              </div>
            </div>

            {/* Daily Range */}
            <div className="px-6 pb-6">
              <h3
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } mb-2`}
              >
                Daily Range
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  ${formatCurrency(cryptoData.low)}
                </span>
                <div
                  className={`flex-grow h-2 ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  } rounded-full overflow-hidden`}
                >
                  <div
                    className={`h-full ${
                      parseFloat(cryptoData.change24h) >= 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${
                        ((parseFloat(cryptoData.price) -
                          parseFloat(cryptoData.low)) /
                          (parseFloat(cryptoData.high) -
                            parseFloat(cryptoData.low))) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm">
                  ${formatCurrency(cryptoData.high)}
                </span>
              </div>
            </div>

            {/* Additional Data */}
            <div
              className={`grid grid-cols-2 gap-4 p-6 ${
                darkMode ? "bg-gray-900/50" : "bg-gray-50"
              }`}
            >
              <div className="space-y-1">
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Current Price
                </p>
                <p className="font-semibold">
                  ${formatCurrency(cryptoData.price)}
                </p>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  24h Trading Volume
                </p>
                <p className="font-semibold">
                  ${formatCurrency(cryptoData.volume)}
                </p>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  24h High
                </p>
                <p className="font-semibold">
                  ${formatCurrency(cryptoData.high)}
                </p>
              </div>
              <div className="space-y-1">
                <p
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  24h Low
                </p>
                <p className="font-semibold">
                  ${formatCurrency(cryptoData.low)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${
              darkMode
                ? "bg-gray-800/50 border border-gray-700"
                : "bg-white border border-gray-100"
            } rounded-xl shadow-lg p-6 backdrop-blur-md`}
          >
            <div className="text-center py-10">
              <div
                className={`h-16 w-16 mx-auto mb-4 flex items-center justify-center rounded-full ${
                  darkMode ? "bg-gray-900" : "bg-indigo-50"
                }`}
              >
                <Coins
                  className={`h-8 w-8 ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
              </div>
              <h3
                className={`text-xl font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Search for a crypto
              </h3>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } mt-2 max-w-md mx-auto`}
              >
                Enter a cryptocurrency name or symbol above to see detailed
                information and real-time prices
              </p>
            </div>
          </div>
        )}
        {/* Market Overview Section */}
        <h2
          className={`text-xl font-bold my-6 ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Market Overview
        </h2>

        <div
          className={`${
            darkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-100"
          } border rounded-xl shadow-lg p-4 mb-6 backdrop-blur-md`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <BarChart2
                className={`h-5 w-5 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <h3 className="font-medium">Global Crypto Stats</h3>
            </div>
            <button
              onClick={refreshTrendingData}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } transition-colors duration-300`}
            >
              <RefreshCw
                className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
              />
              {lastRefreshed ? "Refresh" : "Load Data"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Market Cap
              </p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <p className="font-semibold">{globalMarketData.marketCap}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                24h Change
              </p>
              <div
                className={`flex items-center gap-1 ${
                  parseFloat(globalMarketData.marketChange) >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {parseFloat(globalMarketData.marketChange) >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <p className="font-semibold">
                  {parseFloat(globalMarketData.marketChange) >= 0 ? "+" : ""}
                  {globalMarketData.marketChange}%
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                BTC Dominance
              </p>
              <p className="font-semibold">{globalMarketData.btcDominance}%</p>
            </div>
            <div className="space-y-1">
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                ETH Dominance
              </p>
              <p className="font-semibold">{globalMarketData.ethDominance}%</p>
            </div>
            <div className="space-y-1">
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Active Cryptocurrencies
              </p>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <p className="font-semibold">
                  {globalMarketData.activeCryptos}
                </p>
              </div>
            </div>
          </div>

          {lastRefreshed && (
            <p
              className={`text-xs ${
                darkMode ? "text-gray-500" : "text-gray-400"
              } mt-4 text-right flex items-center gap-1 justify-end`}
            >
              <Clock3 className="h-3 w-3" />
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Trending Cryptocurrencies */}
        <div
          className={`${
            darkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white border-gray-100"
          } border rounded-xl shadow-lg overflow-hidden backdrop-blur-md mb-10`}
        >
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp
                className={`h-5 w-5 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <h3 className="font-medium">Trending Cryptocurrencies</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                className={`px-2 py-1 text-xs rounded-l ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 border-r border-gray-600"
                    : "bg-gray-100 text-gray-700 border-r border-gray-200"
                }`}
              >
                All
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-r ${
                  darkMode
                    ? "bg-gray-900 text-gray-400"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                Gainers
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              className={`w-full ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <thead
                className={`text-xs uppercase ${
                  darkMode
                    ? "bg-gray-900/50 text-gray-400 border-t border-b border-gray-700"
                    : "bg-gray-50 text-gray-500 border-t border-b border-gray-100"
                }`}
              >
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Coin</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {trendingCryptos.map((crypto, index) => (
                  <tr
                    key={crypto.id}
                    className={`hover:${
                      darkMode ? "bg-gray-700/30" : "bg-gray-50"
                    } cursor-pointer transition-colors duration-150`}
                    onClick={() => {
                      setSearchTerm(crypto.id);
                      fetchCryptoData(crypto.id);
                    }}
                  >
                    <td className="px-4 py-3 text-left">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {crypto.image ? (
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                            style={{ backgroundColor: crypto.iconColor }}
                          >
                            {crypto.symbol.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{crypto.name}</p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {crypto.symbol}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${formatCurrency(crypto.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div
                        className={`flex items-center gap-1 justify-end ${
                          parseFloat(crypto.change) >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {parseFloat(crypto.change) >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span>
                          {parseFloat(crypto.change) > 0 ? "+" : ""}
                          {parseFloat(crypto.change).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        {/* <div
          className={`mt-8 p-4 rounded-lg flex items-start gap-3 text-sm ${
            darkMode
              ? "bg-gray-800/30 text-gray-400 border border-gray-700"
              : "bg-gray-50 text-gray-500 border border-gray-100"
          }`}
        >
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Disclaimer</p>
            <p>
              Data provided by CoinGecko API. This information is for
              educational purposes only. Cryptocurrency prices can be volatile.
              Do your own research before making any investment decisions.
            </p>
          </div>
        </div> */}
      </main>

      {/* Footer */}
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
          <Link to={"/cs"} className="flex flex-col items-center text-gray-500">
            <User size={20} />
            <span className="text-xs mt-1">Customer service</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
