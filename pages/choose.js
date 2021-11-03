import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion";

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
      return select.ticker !== e.currentTarget.value;
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

  return (
    <div>
      <Head>
        <title>Trader's Edge - Choose</title>
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
      <AnimateSharedLayout>
        <motion.main
          css={[
            tw`flex justify-center relative items-center flex-col h-screen w-full overflow-hidden`,
            css`
              background: linear-gradient(243.18deg, #fcf9e9 0%, #fcf1e9 100%);
            `,
          ]}
          layout
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
          <motion.div
            layout
            tw="flex justify-center relative items-center flex-col"
          >
            <motion.h1
              tw="font-title  text-xl px-4 text-center lg:text-3xl mb-16"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              What stocks do you have?
            </motion.h1>
            <SearchDropdown selection={selection} setSelection={setSelection} />
          </motion.div>

          {/* <div tw="flex justify-between items-center w-full max-w-5xl"> */}
          <AnimatePresence>
            {selection.length != 0 && (
              <motion.div
                tw="mx-auto lg:mx-0 space-y-8 px-4 w-full max-w-lg bg-white max-h-80 overflow-y-scroll p-8 mt-8 rounded-2xl shadow"
                layout="position"
                exit={{ opacity: 0 }}
              >
                <AnimatePresence>
                  {selection.map((select, i) => (
                    <motion.div
                      tw="flex items-center justify-between space-x-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={i}
                    >
                      <p tw="font-bold text-sm md:text-base">
                        {select.ticker} - {select.name}
                      </p>
                      <button
                        onClick={handleRemoveSelection}
                        tw="bg-red p-2 rounded w-8 h-8 flex justify-center items-center text-white"
                        value={select.ticker}
                      >
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
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          {/* </div> */}
          <div tw="fixed bottom-16 flex justify-center items-center lg:bottom-24">
            <Link href="/">
              <button tw="bg-white absolute -left-16 w-8 h-8 flex justify-center items-center rounded-full font-medium border border-gray-100 shadow transform transition hover:scale-105">
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
            <Link href="/amount">
              <button tw="rounded-md bg-white min-width[180px] py-2 font-medium border border-gray-100 shadow transform transition hover:scale-105">
                Next
              </button>
            </Link>
          </div>
          {/* <Select options={stocks} /> */}
        </motion.main>
      </AnimateSharedLayout>
    </div>
  );
}
