import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import stocks from "../tickers.json";
import axios from "axios";

import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

import { useQuery } from "react-query";
import {
  fetchAllTickers,
  fetchPriceHistory,
  fetchTickers,
  searchTicker,
} from "../helpers/queries";

// import Select, { createFilter } from "react-select";
// import Select from "react-select-virtualized";

import tw, { css } from "twin.macro";
import Chart from "../components/chart";
import SearchDropdown from "../components/searchDropdown";
import { UserContext } from "../helpers/UserContext";

export default function Portfolio() {
  const { dropdown, stocks, apiResponse, pieUser, pieInvestor, stockSave } =
    useContext(UserContext);
  const [selection, setSelection] = dropdown;
  const [portfolio, setPortfolio] = stocks;
  const [stockData, setStockData] = apiResponse;
  const [saveStocks, setSaveStocks] = stockSave;
  const [userPie, setUserPie] = pieUser;
  const [investorPie, setInvestorPie] = pieInvestor;
  const [loading, setLoading] = useState(true);
  const [investorData, setInvestorData] = useState([
    { datetime: 1632891600000, close: 6334.85 },
    { datetime: 1632978000000, close: 4292.4 },
    { datetime: 1633064400000, close: 7202.6 },
    { datetime: 1633323600000, close: 7299.049999999999 },
    { datetime: 1633410000000, close: 5304.05 },
    { datetime: 1633496400000, close: 6333.75 },
    { datetime: 1633582800000, close: 4200.95 },
    { datetime: 1633669200000, close: 8656.45 },
    { datetime: 1633928400000, close: 4387.8 },
    { datetime: 1634014800000, close: 3443.700000000001 },
    { datetime: 1634101200000, close: 2164.5 },
    { datetime: 1634187600000, close: 6529.200000000001 },
    { datetime: 1634274000000, close: 3463.549999999999 },
    { datetime: 1634533200000, close: 3416.05 },
    { datetime: 1634619600000, close: 7508.950000000001 },
    { datetime: 1634706000000, close: 3421.6 },
    { datetime: 1634792400000, close: 8464.8 },
    { datetime: 1634878800000, close: 9135.299999999999 },
    { datetime: 1635138000000, close: 5310.699999999999 },
    { datetime: 1635224400000, close: 7685.349999999999 },
    { datetime: 1635310800000, close: 5477.799999999999 },
    { datetime: 1635397200000, close: 5310.9 },
    { datetime: 1635483600000, close: 6468 },
  ]);

  const ameritradeApiKey = process.env.NEXT_PUBLIC_TD_AMERITRADE_API_KEY;

  const fetchPriceHistory = async (ticker, period) => {
    let periodType, frequencyType;

    if (period === "day") {
      periodType = "day";
      frequencyType = "minute";
    }

    if (period === "month") {
      periodType = "month";
      frequencyType = "daily";
    }

    if (period === "year") {
      periodType = "year";
      frequencyType = "weekly";
    }

    const res = await axios.get(
      `https://api.tdameritrade.com/v1/marketdata/${ticker}/pricehistory?apikey=${ameritradeApiKey}&periodType=${periodType}&frequencyType=${frequencyType}`
    );

    return res;
  };

  useEffect(() => {
    setLoading(true);
    let stocks = [];
    let final = [];

    // For each of the stocks selected by the user, fetch its price history,
    // add it to the stocks array in state, and compile its information into the final array
    portfolio.forEach((stock, index) => {
      fetchPriceHistory(stock.ticker, "month").then((res) => {
        stocks.push(res.data);
        console.log(stocks);
        for (let i = 0; i < stocks[stocks.length - 1].candles.length; i++) {
          if (final[i] === undefined) {
            const newObject = {
              datetime: stocks[stocks.length - 1].candles[i].datetime,
              close: stocks[stocks.length - 1].candles[i].close * stock.shares,
            };
            final.push(newObject);
            setStockData(final);
          } else {
            final[i] = {
              datetime: stocks[stocks.length - 1].candles[i].datetime,
              close:
                stocks[stocks.length - 1].candles[i].close * stock.shares +
                final[i].close,
            };
          }
        }
        if (index === portfolio.length - 1) {
          setStockData(final);
          setSaveStocks(stocks);
          setLoading(false);
        }
      });
    });
  }, []);

  console.log(portfolio);
  console.log(saveStocks);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Head>
        <title>Trader's Edge - Portfolio</title>
        <meta
          name="description"
          content="Compare your financials against the top investors"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <main
        css={[
          tw`flex h-screen w-full justify-center items-center flex-col gap-4 overflow-hidden`,
          css`
            background: linear-gradient(243.18deg, #fcf9e9 0%, #fcf1e9 100%);
          `,
        ]}
      >
        <div tw="bg-white width[150px] lg:width[200px] h-32 lg:h-48 p-8 flex justify-end items-end rounded-3xl absolute  -top-8 -left-16">
          <Link href="/">
            <img
              src="/traders_edge_logo_black.png"
              alt="Trader's Edge Logo"
              tw="w-8 lg:w-16 fixed top-8 cursor-pointer left-8 md:top-10 md:left-10"
            />
          </Link>
        </div>
        <section tw="container mx-auto space-y-4 text-center">
          {/* {selection.map((stock, i) => (
            <div
              key={i}
              tw="flex justify-between items-center w-full max-w-2xl mx-auto"
            >
              <p tw="text-2xl font-bold">
                {stock.ticker} - {stock.name}
              </p>
              <input
                type="number"
                name={stock.ticker}
                value={inputs.ticker}
                onChange={handleInputchange}
              />
            </div>
          ))} */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div tw="w-full mx-auto max-w-5xl">
              <Chart chartData={stockData} investorData={investorData} />
            </div>
          )}
          <div tw="flex justify-center items-center relative">
            <Link href="/amount">
              <button tw="bg-white mr-4 w-8 h-8 flex justify-center items-center rounded-full font-medium border border-gray-100 shadow transform transition hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-arrow-left"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
            </Link>
            <Link href="/analyze">
              <button tw="rounded-md bg-white min-width[180px] py-2 mr-12 font-medium border border-gray-100 shadow transform transition hover:scale-105">
                Analyze
              </button>
            </Link>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
