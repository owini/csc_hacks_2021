import { useEffect, useState, useRef } from "react";
import * as Plot from "@observablehq/plot";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import axios from "axios";
import "twin.macro";
import { format } from "date-fns";

const Chart = ({ chartData }) => {
  // Ref to add chart to DOM
  const ref = useRef(null);
  // State to hold stock information and final portfolio graph information (compiled based on userData)
  // const [tickers, setTickers] = useState({
  //   stocks: [],
  //   final: [],
  // });
  // State to hold stocks chosen by user during the onboarding process
  // const [userData, setUserData] = useState([
  //   {
  //     ticker: "AAPL",
  //     shares: 2.2,
  //   },
  //   {
  //     ticker: "TSLA",
  //     shares: 5,
  //   },
  // ]);

  // const ameritradeApiKey = process.env.NEXT_PUBLIC_TD_AMERITRADE_API_KEY;

  // Function to call TD Ameritrade API
  // const fetchPriceHistory = async (ticker, period) => {
  //   let periodType, frequencyType;

  //   if (period === "day") {
  //     periodType = "day";
  //     frequencyType = "minute";
  //   }

  //   if (period === "month") {
  //     periodType = "month";
  //     frequencyType = "daily";
  //   }

  //   if (period === "year") {
  //     periodType = "year";
  //     frequencyType = "weekly";
  //   }

  //   const res = await axios.get(
  //     `https://api.tdameritrade.com/v1/marketdata/${ticker}/pricehistory?apikey=${ameritradeApiKey}&periodType=${periodType}&frequencyType=${frequencyType}`
  //   );

  //   return res;
  // };

  // useEffect(() => {
  //   let { stocks, final } = tickers;

  //   // For each of the stocks selected by the user, fetch its price history,
  //   // add it to the stocks array in state, and compile its information into the final array
  //   userData.forEach((stock) => {
  //     fetchPriceHistory(stock.ticker, "month").then((res) => {
  //       stocks.push(res.data);
  //       for (let i = 0; i < stocks[stocks.length - 1].candles.length; i++) {
  //         if (final[i] === undefined) {
  //           const newObject = {
  //             datetime: stocks[stocks.length - 1].candles[i].datetime,
  //             close: stocks[stocks.length - 1].candles[i].close * stock.shares,
  //           };
  //           final.push(newObject);
  //         } else {
  //           final[i] = {
  //             datetime: stocks[stocks.length - 1].candles[i].datetime,
  //             close:
  //               stocks[stocks.length - 1].candles[i].close * stock.shares +
  //               final[i].close,
  //           };
  //         }
  //       }
  //     });
  //   });
  // }, []);

  // Chart.js data
  const data = {
    datasets: [
      {
        label: "Portfolio Value",
        data: chartData,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    parsing: {
      xAxisKey: "datetime",
      yAxisKey: "close",
    },
    scales: {
      x: {
        type: "time",
      },
      y: {
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  // Observable Plot options
  // const options = {
  //   marginLeft: 80,
  //   marginTop: 50,
  //   marginBottom: 50,
  //   inset: 6,
  //   grid: true,
  //   y: {
  //     label: "↑ Portfolio value ($)",
  //   },
  //   x: {
  //     type: "utc",
  //     label: "Date",
  //   },
  //   marks: [
  //     Plot.line(chartData, {
  //       x: "datetime",
  //       y: "close",
  //       stroke: "#D46C25",
  //     }),
  //   ],
  //   width: 1200,
  // };

  console.log(chartData);
  console.log(String(chartData[0].datetime));
  console.log(format(new Date(chartData[0].datetime), "MM/dd/yyyy"));

  // useEffect(() => {
  //   const plot = Plot.plot(options);
  //   if (ref.current) {
  //     if (ref.current.children[0]) {
  //       ref.current.children[0].remove();
  //     }
  //     ref.current.appendChild(plot);
  //   }
  // }, [ref, options, chartData]);

  return <Line data={data} options={options} />;
};

export default Chart;
