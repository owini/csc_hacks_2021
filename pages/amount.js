import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
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
    portfolioCopy[filteredIndex] = stockCopy;
    setPortfolio(portfolioCopy);
    // setPortfolio((state) => ([...portfolio.slice(0, filteredIndex), {...portfolio[filteredIndex], shares: e.target.value, }, ...]))
    // filteredObject.shares = e.target.value;
    // console.log(inputArray);
    // console.log(selection);
  };

  useEffect(() => {
    if (selection) {
      const newPortfolio = [];
      selection.forEach((stock) => {
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
        <title>Trader's Edge</title>
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
        <section tw="container mx-auto space-y-4">
          {selection.map((stock, i) => (
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
          ))}
        </section>
      </main>
    </div>
  );
}
