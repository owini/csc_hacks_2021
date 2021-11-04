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
  const [userPie, setUserPie] = useState(() => {
    const localData = windowGlobal
      ? windowGlobal.localStorage.getItem("userPie")
      : false;
    return localData ? JSON.parse(localData) : [];
  });
  const [investorPie, setInvestorPie] = useState(() => {
    const localData = windowGlobal
      ? windowGlobal.localStorage.getItem("investorPie")
      : false;
    return localData ? JSON.parse(localData) : [];
  });
  const [saveStocks, setSaveStocks] = useState(() => {
    const localData = windowGlobal
      ? windowGlobal.localStorage.getItem("saveStocks")
      : false;
    return localData ? JSON.parse(localData) : [];
  });
  const [investorData, setInvestorData] = useState(() => {
    const localData = windowGlobal
      ? windowGlobal.localStorage.getItem("investorData")
      : false;
    return localData ? JSON.parse(localData) : {};
  });
  useEffect(() => {
    windowGlobal &&
      windowGlobal.localStorage.setItem("selection", JSON.stringify(selection));
    windowGlobal &&
      windowGlobal.localStorage.setItem("portfolio", JSON.stringify(portfolio));
    windowGlobal &&
      windowGlobal.localStorage.setItem("stockData", JSON.stringify(stockData));
    windowGlobal &&
      windowGlobal.localStorage.setItem("userPie", JSON.stringify(userPie));
    windowGlobal &&
      windowGlobal.localStorage.setItem(
        "investorPie",
        JSON.stringify(investorPie)
      );
    windowGlobal &&
      windowGlobal.localStorage.setItem(
        "saveStocks",
        JSON.stringify(saveStocks)
      );
    windowGlobal &&
      windowGlobal.localStorage.setItem(
        "investorData",
        JSON.stringify(investorData)
      );
  }, [
    selection,
    portfolio,
    stockData,
    userPie,
    investorPie,
    saveStocks,
    investorData,
  ]);

  useEffect(() => {
    fetch("/api/investors", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((scrapedData) => {
        console.log(scrapedData);
        setInvestorData(scrapedData.valuePerSector);
      });
  }, []);

  return (
    <UserContext.Provider
      value={{
        dropdown: [selection, setSelection],
        stocks: [portfolio, setPortfolio],
        apiResponse: [stockData, setStockData],
        pieUser: [userPie, setUserPie],
        pieInvestor: [investorPie, setInvestorPie],
        stockSave: [saveStocks, setSaveStocks],
        dataInvestor: [investorData, setInvestorData],
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
