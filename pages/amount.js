import { useEffect, useState, useContext } from "react";
import Head from "next/head";
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

export default function Amount() {
  const { dropdown, stocks } = useContext(UserContext);
  const [selection, setSelection] = dropdown;
  const [portfolio, setPortfolio] = stocks;
  const [inputs, setInputs] = useState({});

  // selection.forEach((stock) => {
  //   inputArray.push(null);
  // });

  // const [inputs, setInputs] = useState(() => {

  //  return inputArray;
  // });

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
    stockCopy.ticker = e.target.name;
    portfolioCopy[filteredIndex] = stockCopy;
    setPortfolio(portfolioCopy);
    // setPortfolio((state) => ([...portfolio.slice(0, filteredIndex), {...portfolio[filteredIndex], shares: e.target.value, }, ...]))
    // filteredObject.shares = e.target.value;
    // console.log(inputArray);
    // console.log(selection);
  };

  useEffect(() => {
    if (portfolio !== [] && portfolio !== undefined) {
      for (let i = 0; i < portfolio.length; i++) {
        console.log(portfolio[i]);
        setInputs((state) => ({
          ...state,
          [portfolio[i].ticker]: portfolio[i].shares,
        }));
      }
    } else if (selection) {
      const newPortfolio = [];
      selection.forEach((stock, i) => {
        const newObject = {};
        newObject.ticker = stock.ticker;
        newObject.shares = 0;
        newPortfolio.push(newObject);
        setInputs((state) => ({ ...state, [stock.ticker]: null }));
      });
      setPortfolio(newPortfolio);
    }
  }, []);

  console.log(inputs);
  console.log(portfolio);

  return (
    <div>
      <Head>
        <title>Trader's Edge - Amount</title>
        <meta
          name="description"
          content="Compare your financials against the top investors"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        css={[
          tw`flex h-screen w-full relative justify-center items-center flex-col gap-4 overflow-hidden`,
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
              tw="w-8 lg:w-16 fixed top-8 left-8 md:top-10 md:left-10"
            />
          </Link>
        </div>
        <h1 tw="font-title  text-xl px-4 text-center lg:text-3xl mb-16">
          How many shares do you have?
        </h1>
        <section tw="mx-auto space-y-8 px-4 text-left">
          {selection.map((stock, i) => (
            <div
              key={i}
              tw="flex justify-between space-x-4 items-center w-full"
            >
              <p tw="text-lg lg:text-2xl">
                {stock.ticker} - {stock.name}
              </p>
              <input
                type="number"
                tw="w-24 px-4 py-2 rounded-md shadow appearance-none"
                name={stock.ticker}
                value={inputs[stock.ticker]}
                onChange={handleInputchange}
              />
            </div>
          ))}
        </section>
        <div tw="fixed bottom-16 flex justify-center items-center lg:bottom-24">
          <Link href="/choose">
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
          <Link href="/portfolio">
            <button tw="rounded-md bg-white min-width[180px] py-2 font-medium border border-gray-100 shadow transform transition hover:scale-105">
              Next
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
