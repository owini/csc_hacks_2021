import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
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
  const { dropdown, stocks } = useContext(UserContext);
  const [selection, setSelection] = dropdown;
  const [portfolio, setPortfolio] = stocks;
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState([]);

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
          setLoading(false);
        }
      });
    });
  }, []);

  const handleInputchange = (e) => {
    // inputArray[] = e.target.value;
    setInputs((state) => ({
      ...state,
      [e.target.name]: Number.parseInt(e.target.value),
    }));
    const filteredIndex = selection.findIndex((stock) => {
      return stock.ticker == e.target.name;
    });
    let portfolioCopy = [...portfolio];
    let stockCopy = { ...portfolioCopy[filteredIndex] };
    stockCopy.shares = Number.parseInt(e.target.value);
    portfolioCopy[filteredIndex] = stockCopy;
    setPortfolio(portfolioCopy);
    // setPortfolio((state) => ([...portfolio.slice(0, filteredIndex), {...portfolio[filteredIndex], shares: e.target.value, }, ...]))
    // filteredObject.shares = e.target.value;
    // console.log(inputArray);
    // console.log(selection);
  };

  return (
    <div>
      <Head>
        <title>Trader's Edge - Portfolio</title>
        <meta
          name="description"
          content="Compare your financials against the top investors"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        css={[
          tw`flex h-screen w-full justify-center items-center flex-col gap-4 overflow-hidden`,
          css`
            background: linear-gradient(243.18deg, #fcf9e9 0%, #fcf1e9 100%);
          `,
        ]}
      >
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
          {loading ? <div>Loading...</div> : <Chart chartData={stockData} />}
          <div tw="flex justify-center items-center space-x-2 md:space-x-4">
            <button tw="rounded-md bg-white w-40 md:w-auto md:min-width[180px] py-2 font-medium border-4 border-white shadow transform transition hover:scale-105">
              Analyze
            </button>

            <Link href="/">
              <button tw="rounded-md w-40 md:w-auto md:min-width[180px] py-2 font-medium border-4 border-white shadow transform transition hover:scale-105">
                Back Home
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
