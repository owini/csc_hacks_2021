import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import stocks from "../tickers.json";

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

export default function Choose() {
  const [tickers, setTickers] = useState([]);
  const { dropdown } = useContext(UserContext);
  const [selection, setSelection] = dropdown;

  const {
    data: tickersData,
    isLoading: tickersLoading,
    refetch: refetchTickers,
  } = useQuery("priceHistory", fetchPriceHistory, {
    enabled: false,
  });

  const handleRemoveSelection = (e) => {
    const filteredData = selection.filter((select) => {
      return select.ticker !== e.target.value;
    });
    setSelection(filteredData);
  };

  useEffect(() => {
    refetchTickers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tickersData) setTickers(tickersData.data.candles);
    console.log(tickers);
    console.log(process.env.NEXT_PUBLIC_POLYGON_API_KEY);
  }, [tickersData]);

  console.log(selection);
  return (
    <div>
      <Head>
        <title>Trader's Edge - Choose</title>
        <meta
          name="description"
          content="Compare your financials against the top investors"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        css={[
          tw`flex justify-center items-center space-x-4 h-screen w-full overflow-hidden`,
          css`
            background: linear-gradient(243.18deg, #fcf9e9 0%, #fcf1e9 100%);
          `,
        ]}
      >
        <SearchDropdown selection={selection} setSelection={setSelection} />
        <div>
          {selection.map((select, i) => (
            <div>
              <div>{select.ticker}</div>
              <button
                onClick={handleRemoveSelection}
                tw="bg-red p-2 rounded w-8 h-8 flex justify-center items-center text-white"
                value={select.ticker}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <Link href="/amount">
          <button tw="rounded-md bg-white min-width[180px] py-2 font-medium border border-gray-100 shadow transform transition hover:scale-105">
            Go to Amount
          </button>
        </Link>
        {/* <Select options={stocks} /> */}
      </main>
    </div>
  );
}
