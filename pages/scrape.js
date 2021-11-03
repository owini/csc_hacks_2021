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

export default function Scrape() {
  const [inputValue, setInputValue] = useState("");
  const [investorData, setInvestorData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/investors", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ investor: inputValue }),
    })
      .then((res) => res.json())
      .then((scrapedData) => {
        console.log(scrapedData);
        setInvestorData(scrapedData);
      });
  };

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
          printArray(investorData.sectors)
        ) : (
          // this overwrites the previous function: printArray(investorData.updated)
          <p>{investorData.error}</p>
        )}
      </main>
    </div>
  );
}
