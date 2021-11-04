import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { BounceLoader } from "react-spinners";
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
import PieChart from "../components/pieChart";
import SearchDropdown from "../components/searchDropdown";
import { UserContext } from "../helpers/UserContext";

export default function Portfolio() {
  const {
    dropdown,
    stocks,
    apiResponse,
    pieUser,
    pieInvestor,
    stockSave,
    dataInvestor,
  } = useContext(UserContext);
  const [selection, setSelection] = dropdown;
  const [portfolio, setPortfolio] = stocks;
  const [stockData, setStockData] = apiResponse;
  const [userPie, setUserPie] = pieUser;
  const [investorPie, setInvestorPie] = pieInvestor;
  const [saveStocks, setSaveStocks] = stockSave;
  const [loading, setLoading] = useState(true);
  const [investorData, setInvestorData] = dataInvestor;

  useEffect(() => {
    const polygonApiKey = "xbvp8WYY06ELtZLCmhgEVH1Qn2_cr6gc";

    let stockArray = [];
    setLoading(true);
    const fetchAllTickers = async (i, ticker) => {
      let res = await fetch(
        `https://api.polygon.io/v1/meta/symbols/${ticker}/company?apiKey=${polygonApiKey}`
      );

      res
        .json()
        .then((json) => {
          console.log(json);
          // for (let i = 0; i < results.length; i++) {
          //   let newObject = results[i];
          //   newObject.value = results[i].ticker;
          //   newObject.label = results[i].ticker;
          //   stockArray.push(newObject);
          // }
          const newObject = {
            ticker: ticker,
            sector: json.sector,
            price:
              portfolio[i].shares *
              saveStocks[i].candles[saveStocks[i].candles.length - 1].close,
          };
          const filteredIndex = stockArray.findIndex((object) => {
            return object.sector === json.sector;
          });
          if (filteredIndex === -1) {
            const newObject = {
              sector: json.sector,
              price:
                portfolio[i].shares *
                saveStocks[i].candles[saveStocks[i].candles.length - 1].close,
            };
            stockArray.push(newObject);
          } else {
            let object = stockArray[filteredIndex];
            object.price =
              object.price +
              portfolio[i].shares *
                saveStocks[i].candles[saveStocks[i].candles.length - 1].close;
            stockArray[filteredIndex] = object;
          }
          if (i !== portfolio.length - 1) {
            setTimeout(() => {
              i = i + 1;
              console.log(i);
              fetchAllTickers(i, portfolio[i].ticker);
            }, 12000);
          } else {
            let sum = 0;
            for (let i = 0; i < stockArray.length; i++) {
              sum += stockArray[i].price;
              console.log(sum);
            }
            for (let i = 0; i < stockArray.length; i++) {
              stockArray[i].price /= sum;
              stockArray[i].price *= 100;
            }
            setLoading(false);
            setUserPie(stockArray);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchAllTickers(0, portfolio[0].ticker);
  }, []);

  console.log(userPie);

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
          tw`flex w-full justify-center items-center flex-col gap-4 min-h-screen py-24`,
          css`
            background: linear-gradient(243.18deg, #fcf9e9 0%, #fcf1e9 100%);
          `,
        ]}
      >
        <div tw="bg-white width[150px] lg:width[200px] h-32 lg:h-48 p-8 flex justify-end items-end rounded-3xl   -top-8 -left-16 fixed">
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
          <div tw="w-full mx-auto flex justify-center items-center flex-col gap-8 md:flex-row">
            {loading ? (
              <div tw="flex justify-center items-center space-y-8 flex-col">
                <h2 tw="text-2xl lg:text-5xl">Analyzing...</h2>
                <BounceLoader loading={loading} />
              </div>
            ) : (
              <PieChart chartData={userPie} investorData={investorData} />
            )}
          </div>
          {!loading && (
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-arrow-left"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              </Link>
              <Link href="/choose">
                <button tw="rounded-md bg-white min-width[180px] py-2 mr-12 font-medium border border-gray-100 shadow transform transition hover:scale-105">
                  Edit Stocks
                </button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </motion.div>
  );
}
