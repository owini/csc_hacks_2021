import axios from "axios";

const polygonApiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
const ameritradeApiKey = process.env.NEXT_PUBLIC_TD_AMERITRADE_API_KEY;

export const fetchAllTickers = async () => {
  const res = await axios.get(
    `https://api.polygon.io/v3/reference/tickers?type=CS&market=stocks&active=true&sort=ticker&order=asc&limit=1000&apiKey=${polygonApiKey}`
  );
  return res;
};

export const fetchTicker = async () => {
  const res = await axios.get(
    `https://api.polygon.io/v3/reference/tickers?active=true&sort=ticker&order=asc&limit=10&apiKey=${polygonApiKey}`
  );
  return res;
};

export const searchTicker = async (search) => {
  const res = await axios.get(
    `https://api.polygon.io/v3/reference/tickers?search=${search}&active=true&sort=ticker&order=asc&limit=10&apiKey=${polygonApiKey}`
  );
  return res;
};

export const fetchPriceHistory = async () => {
  const res = await axios.get(
    `https://api.tdameritrade.com/v1/marketdata/AAPL/pricehistory?apikey=${ameritradeApiKey}&periodType=month&frequencyType=daily`
  );
  return res;
};
