import { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import axios from "axios";
import "twin.macro";

import { useQuery } from "react-query";
import {
  fetchAllTickers,
  fetchPriceHistory,
  fetchTickers,
  searchTicker,
} from "../helpers/queries";

const Chart = () => {
  const ref = useRef(null);
  const [tickers, setTickers] = useState({
    stocks: [],
    final: [],
  });
  const [userData, setUserData] = useState([
    {
      ticker: "AAPL",
      shares: 2.2,
    },
    {
      ticker: "TSLA",
      shares: 5,
    },
  ]);
  const ameritradeApiKey = process.env.NEXT_PUBLIC_TD_AMERITRADE_API_KEY;

  // const {
  //   data: tickersData,
  //   isLoading: tickersLoading,
  //   refetch: refetchTickers,
  // } = useQuery("priceHistory", fetchPriceHistory, {
  //   enabled: false,
  // });

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
    // refetchTickers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let { stocks, final } = tickers;

    userData.forEach((stock) => {
      fetchPriceHistory(stock.ticker, "month").then((res) => {
        stocks.push(res.data);
        for (let i = 0; i < stocks[stocks.length - 1].candles.length; i++) {
          if (final[i] === undefined) {
            const newObject = {
              datetime: stocks[stocks.length - 1].candles[i].datetime,
              close: stocks[stocks.length - 1].candles[i].close * stock.shares,
            };
            final.push(newObject);
          } else {
            final[i] = {
              datetime: stocks[stocks.length - 1].candles[i].datetime,
              close:
                stocks[stocks.length - 1].candles[i].close * stock.shares +
                final[i].close,
            };
          }
        }
      });
    });

    // for (let i = 0; i < stocks.length; i++) {

    // }
  }, []);

  // useEffect(() => {
  //   if (tickersData) setTickers(tickersData.data.candles);
  //   console.log(process.env.NEXT_PUBLIC_POLYGON_API_KEY);
  // }, [tickersData]);

  const options = {
    marginLeft: 50,
    marginTop: 50,
    marginBottom: 50,
    inset: 6,
    grid: true,
    y: {
      label: "↑ Apple stock price ($)",
    },
    x: {
      type: "utc",
      // domain: [new Date("2021-9-01"), new Date("2021-10-31")],
      label: "Date",
    },
    marks: [
      Plot.line(tickers.final, {
        x: "datetime",
        y: "close",
        stroke: "#D46C25",
      }),
    ],
    width: 1200,
  };

  console.log(tickers);

  useEffect(() => {
    const plot = Plot.plot(options);
    if (ref.current) {
      if (ref.current.children[0]) {
        ref.current.children[0].remove();
      }
      ref.current.appendChild(plot);
    }
  }, [ref, options, tickers.final]);

  return <div ref={ref} tw=""></div>;
};

export default Chart;
