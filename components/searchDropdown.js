import React, { useEffect, useState, useRef, useContext } from "react";
import "twin.macro";
import stocks from "../tickers.json";

function SearchDropdown() {
  // const universities = useContext(UniversityContext);
  // const { dropdown } = useContext(FormContext);
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState("");
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
    setSearch(stock);
    setSelection(stock);
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

  return (
    <div tw="relative z-10" ref={wrapperRef}>
      <input
        tw="w-52"
        type="text"
        onClick={() => setDisplay(true)}
        placeholder="Search..."
        value={search}
        onChange={typeSearch}
      />
      {display && (
        <div tw="absolute w-52 max-height[150px] overflow-y-scroll md:max-height[200px]">
          {filteredData.length !== 0 ? (
            filteredData.map((stock, i) => (
              <div
                onClick={() => clickSearch(stock.ticker)}
                tw="flex items-center p-4 border border-gray-400 text-left text-black text-sm"
                key={i}
                tabIndex="0"
                value={stock}
              >
                <span>{stock.ticker}</span>
              </div>
            ))
          ) : (
            <div
              tw="flex items-center p-4 border border-gray-400 text-left text-black text-sm"
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
