import React, { useEffect, useState, useRef } from "react";
import "twin.macro";
import stocks from "../tickers.json";

function SearchDropdown({ selection, setSelection }) {
  const [search, setSearch] = useState("");
  const [display, setDisplay] = useState(false);
  const wrapperRef = useRef(null);

  const filteredData = stocks
    .filter((stock) => {
      return stock.ticker.toLowerCase().includes(search.toLowerCase());
    })
    .splice(0, 50);

  const typeSearch = (e) => {
    setSearch(e.target.value);
    setDisplay(true);
  };

  const clickSearch = (stock) => {
    setSearch(stock.ticker);
    if (
      selection.filter((selectedStock) => selectedStock.ticker == stock.ticker)
        .length === 0
    ) {
      setSelection([...selection, stock]);
    }
    setDisplay(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);

    return () => {
      document.addEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (e) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(e.target)) {
      setDisplay(false);
    }
  };

  console.log(selection);

  return (
    <div tw="relative z-10" ref={wrapperRef}>
      <svg
        tw="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        tw="w-52 lg:w-64 rounded-md shadow pl-4 pr-8 py-2 appearance-none"
        type="text"
        onClick={() => setDisplay(true)}
        placeholder="Choose Stocks..."
        value={search}
        onChange={typeSearch}
      />
      {display && (
        <div tw="absolute w-52 lg:w-64 overflow-y-scroll max-height[216px]">
          {filteredData.length !== 0 ? (
            filteredData.map((stock, i) => (
              <div
                onClick={() => clickSearch(stock)}
                tw="flex items-center bg-white p-4 border border-gray-200 text-left text-black text-sm"
                key={i}
                tabIndex="0"
                value={stock}
              >
                <span>{stock.ticker}</span>
              </div>
            ))
          ) : (
            <div
              tw="flex items-center bg-white p-4 border border-gray-200 text-left text-black text-sm"
              tabIndex="0"
            >
              No stocks match that ticker
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchDropdown;
