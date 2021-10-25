import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

import { useQuery } from "react-query";
import {
  fetchAllTickers,
  fetchPriceHistory,
  fetchTickers,
  searchTicker,
} from "../helpers/queries";

import Select from "react-select";

import styles from "../styles/Home.module.css";
import "twin.macro";
import Chart from "../components/chart";

export default function Home() {
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
    console.log(tickers);
    console.log(process.env.NEXT_PUBLIC_POLYGON_API_KEY);
  }, [tickersData]);

  console.log(tickers);

  return (
    <div className={styles.container}>
      <Head>
        <title>Trader's Edge</title>
        <meta
          name="description"
          content="Compare your financials against the top investors"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main tw="grid h-screen w-full place-items-center">
        {/* {!tickersLoading && tickers.results && (
          <Select
            options={tickers?.results.map((stock) => ({
              label: `${stock.ticker}: ${stock.name}`,
              value: stock.ticker,
            }))}
          />
        )} */}

        {/* {tickers.map((ticker) => (
          <div>{ticker}</div>
        ))} */}

        <Chart />
      </main>
    </div>
  );
}
