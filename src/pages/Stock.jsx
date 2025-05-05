import { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  DollarSign,
  BarChart2,
  AlertCircle,
  Info,
  Home,
  CreditCard,
  PieChart,
  User,
  ChartBarIncreasing,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StockTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockData, setStockData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
  ]);
  const [trendingStocks, setTrendingStocks] = useState([
    { symbol: "AAPL", price: 0, change: 0 },
    { symbol: "TSLA", price: 0, change: 0 },
    { symbol: "NVDA", price: 0, change: 0 },
    { symbol: "META", price: 0, change: 0 },
  ]);

  // Alpha Vantage API Key - you need to get your free API key from https://www.alphavantage.co/support/#api-key
  const API_KEY = "DCJD5CCWDNFZ1M2M"; // Replace with your actual API key

  // Fetch data for trending stocks on component mount
  useEffect(() => {
    const fetchTrendingStocks = async () => {
      const updatedTrending = [...trendingStocks];

      for (let i = 0; i < updatedTrending.length; i++) {
        try {
          const data = await fetchStockQuote(updatedTrending[i].symbol);
          if (data) {
            updatedTrending[i].price = parseFloat(data.price).toFixed(2);
            updatedTrending[i].change = parseFloat(data.change).toFixed(2);
          }
        } catch (err) {
          console.error(`Error fetching ${updatedTrending[i].symbol}:`, err);
        }
      }

      setTrendingStocks(updatedTrending);
    };

    fetchTrendingStocks();
  }, []);

  // Fetch stock quote from Alpha Vantage API
  const fetchStockQuote = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Check if we got valid data or an error message
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }

      if (data["Note"]) {
        console.warn("API call frequency warning:", data["Note"]);
      }

      // Extract the data from the response
      const quote = data["Global Quote"];
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error("No data available for this symbol");
      }

      return {
        symbol: quote["01. symbol"],
        price: quote["05. price"],
        change: quote["09. change"],
        percentChange: quote["10. change percent"].replace("%", ""),
        open: quote["02. open"],
        high: quote["03. high"],
        low: quote["04. low"],
        volume: parseInt(quote["06. volume"]),
        latestTradingDay: quote["07. latest trading day"],
        previousClose: quote["08. previous close"],
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  };

  // Fetch additional company information from Alpha Vantage
  const fetchCompanyOverview = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data["Error Message"] || Object.keys(data).length === 0) {
        return null; // Return null if no overview data available
      }

      return {
        name: data.Name,
        description: data.Description,
        exchange: data.Exchange,
        sector: data.Sector,
        industry: data.Industry,
        marketCap: data.MarketCapitalization,
        peRatio: data.PERatio,
        dividend: data.DividendYield,
        eps: data.EPS,
        beta: data.Beta,
      };
    } catch (error) {
      console.error("Error fetching company overview:", error);
      return null; // Return null on error
    }
  };

  const fetchStockData = async (symbol) => {
    if (!symbol || symbol.trim() === "") {
      setError("Please enter a valid stock symbol");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Fetch both quote and company overview
      const quoteData = await fetchStockQuote(symbol);
      let overviewData = await fetchCompanyOverview(symbol);

      // If overview data isn't available, create minimal placeholder
      if (!overviewData) {
        overviewData = {
          name: symbol,
          exchange: "N/A",
          marketCap: "N/A",
          peRatio: "N/A",
          dividend: "0",
          sector: "N/A",
        };
      }

      // Combine the data
      const combinedData = {
        ...quoteData,
        name: overviewData.name,
        exchange: overviewData.exchange,
        marketCap:
          overviewData.marketCap !== "N/A"
            ? (parseInt(overviewData.marketCap) / 1000000000).toFixed(2) + "B"
            : "N/A",
        pe: overviewData.peRatio,
        dividend:
          overviewData.dividend !== "0" &&
          overviewData.dividend !== "N/A" &&
          overviewData.dividend !== "None"
            ? parseFloat(overviewData.dividend).toFixed(2) + "%"
            : "N/A",
        sector: overviewData.sector,
        avgVolume: "N/A", // Alpha Vantage free tier doesn't provide this
      };

      setStockData(combinedData);

      // Add to recent searches if not already there
      if (!recentSearches.includes(symbol.toUpperCase())) {
        setRecentSearches((prev) => [
          symbol.toUpperCase(),
          ...prev.slice(0, 3),
        ]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch stock data. Please try again.");
      setStockData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStockData(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* API Key Notice */}

        {/* Search Section */}
        <div className="bg-gray-800 rounded-xl shadow-md p-4 md:p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter stock symbol (e.g., AAPL)"
                className="w-full p-3 pl-10 border border-gray-700 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              <span className="hidden md:inline">Search</span>
            </button>
          </form>

          {/* Recent Searches */}
          <div className="mt-4">
            <p className="text-sm text-gray-400 flex items-center gap-1 mb-2">
              <Clock className="h-4 w-4" /> Recent searches:
            </p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => {
                    setSearchTerm(symbol);
                    fetchStockData(symbol);
                  }}
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full transition-colors duration-300"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Data Display */}
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Fetching stock data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-red-100 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-6 w-6" />
            <p>{error}</p>
          </div>
        ) : stockData ? (
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {/* Stock Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{stockData.symbol}</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {stockData.name} • {stockData.exchange}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">
                    ${parseFloat(stockData.price).toFixed(2)}
                  </p>
                  <div
                    className={`flex items-center gap-1 justify-end ${
                      parseFloat(stockData.change) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <span>
                      {parseFloat(stockData.change) > 0 ? "+" : ""}
                      {parseFloat(stockData.change).toFixed(2)}
                    </span>
                    <span>
                      ({parseFloat(stockData.percentChange).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Market Cap</p>
                <p className="font-semibold">${stockData.marketCap}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Volume</p>
                <p className="font-semibold">
                  {stockData.volume.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">P/E Ratio</p>
                <p className="font-semibold">{stockData.pe}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Dividend Yield</p>
                <p className="font-semibold">{stockData.dividend}</p>
              </div>
            </div>

            {/* Daily Range */}
            <div className="px-6 pb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Daily Range
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  ${parseFloat(stockData.low).toFixed(2)}
                </span>
                <div className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${
                        ((parseFloat(stockData.price) -
                          parseFloat(stockData.low)) /
                          (parseFloat(stockData.high) -
                            parseFloat(stockData.low))) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm">
                  ${parseFloat(stockData.high).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Additional Data */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-gray-900">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Open</p>
                <p className="font-semibold">
                  ${parseFloat(stockData.open).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Previous Close</p>
                <p className="font-semibold">
                  ${parseFloat(stockData.previousClose).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Day's High</p>
                <p className="font-semibold">
                  ${parseFloat(stockData.high).toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Day's Low</p>
                <p className="font-semibold">
                  ${parseFloat(stockData.low).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Latest Trading Day */}
            <div className="px-6 py-4 bg-gray-900 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                Latest Trading Day:{" "}
                <span className="font-medium">
                  {stockData.latestTradingDay}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-md p-6">
            <div className="text-center py-6">
              <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">
                Search for a stock
              </h3>
              <p className="text-gray-400 mt-2">
                Enter a stock symbol above to see detailed information
              </p>
            </div>
          </div>
        )}

        {/* Trending Stocks */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-500" />
            Trending Stocks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => {
                  setSearchTerm(stock.symbol);
                  fetchStockData(stock.symbol);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{stock.symbol}</h3>
                    <p className="text-sm text-gray-400">Stock</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${stock.price === 0 ? "..." : stock.price}
                    </p>
                    <p
                      className={`text-sm ${
                        stock.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stock.price === 0
                        ? "..."
                        : (stock.change > 0 ? "+" : "") + stock.change}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
