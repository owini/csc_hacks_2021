// MY TEST SCRAPING CODE BELOW

import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";

function printArray(arr) {
  return (
    <ol>
      {arr.map((a, i) => (
        <li key={i}>{a}</li>
      ))}
    </ol>
  );
}

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [investorData, setInvestorData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/investors', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ investor: inputValue }),
    })
      .then((res) => res.json())
      .then((scrapedData) => {
        console.log(scrapedData)
        setInvestorData(scrapedData)
      })
  }

  return (
    <div>
      <Head>
        <title>Fetch Investor Data</title>
      </Head>

      <main>
        <h1>Fetch Investor Data</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter an investor's name:
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          <button>Submit</button>
        </form>
        <h2>Investor List</h2>
        {investorData.status === 200 ? (
          printArray(investorData.investors)
          // this overwrites the previous function: printArray(investorData.updated)
        ) : (
          <p>{investorData.error}</p>
        )}
      </main>
    </div>
  )
}

// NORMAL CODE ALEX WROTE BELOW

/*

import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";

import { useQuery } from "react-query";
import { fetchPriceHistory } from "../helpers/queries";

// import Select, { createFilter } from "react-select";
// import Select from "react-select-virtualized";
import { motion } from "framer-motion";
import tw, { css } from "twin.macro";
import { UserContext } from "../helpers/UserContext";

export default function Home() {
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
          tw`relative flex justify-center items-center space-x-4 h-screen w-full overflow-hidden`,
          css`
            background: linear-gradient(243.18deg, #fcf9e9 0%, #fcf1e9 100%);
          `,
        ]}
      >
        <div tw="bg-white width[400px] lg:width[600px] h-64 lg:h-72 p-8 flex justify-end items-end rounded-3xl absolute -top-24 lg:-top-8 -left-9 lg:-left-12">
          <h1 tw="text-4xl lg:text-5xl font-title">Trader's Edge</h1>
        </div>
        <div tw="absolute mt-12 lg:mt-8 top-1/4 lg:top-1/2 transform -translate-y-1/4 lg:-translate-y-1/2 left-8 lg:left-32 flex flex-col space-y-8 max-w-sm lg:max-w-xl">
          <h2 tw="text-xl lg:text-2xl leading-loose lg:leading-loose">
            Compare your stock portfolio with the top investors and find key
            insights into their performance.
          </h2>
          <div tw="lg:flex space-x-4 hidden">
            <Link href="/choose">
              <button tw="rounded-md bg-white min-width[180px] py-2 font-medium border-4 border-white shadow transform transition hover:scale-105">
                Get Started
              </button>
            </Link>
            <Link href="/learn-more">
              <button tw="rounded-md min-width[180px] py-2 font-medium border-4 border-white shadow transform transition hover:scale-105">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        { <Image src={chartImage} /> }
        <div tw="transform -translate-y-3/4 lg:-translate-y-1/2 absolute top-3/4 lg:top-1/2 -right-16">
          <motion.img
            initial={{ x: 200 }}
            animate={{ x: 0 }}
            src="./trend-chart.png"
            tw="max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl  mt-8 lg:mt-0 lg:-right-48 "
          />
        </div>

        <div tw="fixed bottom-16 lg:hidden">
          <div tw="space-x-2 md:space-x-4">
            <Link href="/choose">
              <button tw="rounded-md bg-white w-40 md:w-auto md:min-width[180px] py-2 font-medium border-4 border-white shadow transform transition hover:scale-105">
                Get Started
              </button>
            </Link>
            <Link href="/learn-more">
              <button tw="rounded-md w-40 md:w-auto md:min-width[180px] py-2 font-medium border-4 border-white shadow transform transition hover:scale-105">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        { <Select options={stocks} /> }
      </main>
    </div>
  );
}
*/
