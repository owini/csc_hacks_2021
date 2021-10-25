import { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

import { useQuery } from "react-query";
import {
  fetchAllTickers,
  fetchPriceHistory,
  fetchTickers,
  searchTicker,
} from "../helpers/queries";

const Chart = () => {
  const ref = useRef(null);
  const [tickers, setTickers] = useState([]);

  const {
    data: tickersData,
    isLoading: tickersLoading,
    refetch: refetchTickers,
  } = useQuery("priceHistory", fetchPriceHistory, {
    enabled: false,
  });

  useEffect(() => {
    refetchTickers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tickersData) setTickers(tickersData.data.candles);
    console.log(process.env.NEXT_PUBLIC_POLYGON_API_KEY);
  }, [tickersData]);

  const options = {
    inset: 6,
    grid: true,
    y: {
      label: "↑ Apple stock price ($)",
    },
    x: { type: "utc", domain: [1609459200000, 1640995200000] },
    color: {
      range: ["#e41a1c", "#000000", "#4daf4a"],
    },
    marks: [
      Plot.ruleX(tickers, {
        x: "datetime",
        y1: "low",
        y2: "high",
      }),
      Plot.ruleX(tickers, {
        x: "datetime",
        y1: "open",
        y2: "close",
        stroke: (d) => Math.sign(d.close - d.open),
        strokeWidth: 4,
        strokeLinecap: "round",
      }),
    ],
    width: 1200,
  };

  console.log(tickers);

  useEffect(() => {
    if (!tickersLoading) {
      const plot = Plot.plot(options);
      if (ref.current) {
        if (ref.current.children[0]) {
          ref.current.children[0].remove();
        }
        ref.current.appendChild(plot);
      }
    }
  }, [ref, options, tickersLoading]);

  return <div ref={ref}></div>;
};

export default Chart;
