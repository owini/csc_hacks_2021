import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

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

export default function Home() {
  const [tickers, setTickers] = useState([]);

  const {
    data: alltickersData,
    isLoading: alltickersLoading,
    refetch: refetchAllTickers,
  } = useQuery("allTickers", fetchAllTickers, {
    enabled: false,
  });

  const {
    data: tickersData,
    isLoading: tickersLoading,
    refetch: refetchTickers,
  } = useQuery("priceHistory", fetchPriceHistory, {
    enabled: false,
  });

  useEffect(() => {
    refetchTickers();
    refetchAllTickers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tickersData) setTickers(tickersData.data);
    console.log(tickers);
    console.log(process.env.NEXT_PUBLIC_POLYGON_API_KEY);
  }, [tickersData]);

  console.log(tickers);
  console.log(alltickersData);

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
        {!tickersLoading && tickers.results && (
          <Select
            options={tickers?.results.map((stock) => ({
              label: `${stock.ticker}: ${stock.name}`,
              value: stock.ticker,
            }))}
          />
        )}

        {/* {tickers.map((ticker) => (
          <div>{ticker}</div>
        ))} */}
      </main>
    </div>
  );
}
