import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const windowGlobal = typeof window !== `undefined` && window;

  const [selection, setSelection] = useState(() => {
    const localData = windowGlobal
      ? windowGlobal.localStorage.getItem("selection")
      : false;
    return localData ? JSON.parse(localData) : [];
  });
  const [portfolio, setPortfolio] = useState(() => {
    const localData = windowGlobal
      ? windowGlobal.localStorage.getItem("portfolio")
      : false;
    return localData ? JSON.parse(localData) : [];
  });
  const [stockData, setStockData] = useState(() => {
    const localData = windowGlobal
      ? windowGlobal.localStorage.getItem("stockData")
      : false;
    return localData ? JSON.parse(localData) : [];
  });
  useEffect(() => {
    windowGlobal &&
      windowGlobal.localStorage.setItem("selection", JSON.stringify(selection));
    windowGlobal &&
      windowGlobal.localStorage.setItem("portfolio", JSON.stringify(portfolio));
    windowGlobal &&
      windowGlobal.localStorage.setItem("stockData", JSON.stringify(stockData));
  }, [selection, portfolio, stockData]);

  return (
    <UserContext.Provider
      value={{
        dropdown: [selection, setSelection],
        stocks: [portfolio, setPortfolio],
        apiResponse: [stockData, setStockData],
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
