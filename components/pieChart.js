import { defaults, Doughnut } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import "twin.macro";
import React, { useState } from "react";

const PieChart = ({ chartData, investorData }) => {
  const [delayed, setDelayed] = useState(false);
  defaults.font.family = "Montserrat";

  const pieData = [
    {
      name: "Consumer Cyclical",
      value: 2,
    },
    {
      name: "Financials",
      value: 5,
    },
    {
      name: "Materials",
      value: 3,
    },
    {
      name: "Services",
      value: 7,
    },
    {
      name: "Industrials",
      value: 5,
    },
    {
      name: "Health Care",
      value: 3,
    },
    {
      name: "Consumer Goods",
      value: 2,
    },
    {
      name: "Energy",
      value: 4,
    },
  ];
  const pieData2 = [
    {
      name: "Consumer Cyclical",
      value: 3,
    },
    {
      name: "Financials",
      value: 6,
    },
    {
      name: "Materials",
      value: 4,
    },
    {
      name: "Services",
      value: 3,
    },
    {
      name: "Industrials",
      value: 8,
    },
    {
      name: "Health Care",
      value: 9,
    },
    {
      name: "Consumer Goods",
      value: 4,
    },
    {
      name: "Energy",
      value: 6,
    },
  ];

  // Chart.js data
  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 200, 0, 400);
    g.addColorStop(0, "#44B4FF");
    g.addColorStop(1, "#CCEAFF");
    return {
      datasets: [
        {
          label: "Portfolio Data",
          data: chartData,
          backgroundColor: [
            "#ff4f53",
            "#ff654c",
            "#ff7a47",
            "#ff8d44",
            "#ffa043",
            "#ffb347",
            "#ffc54e",
            "#ffd659",
          ],
        },
      ],
      labels: chartData.map((object) => object.sector),
    };
  };

  const data2 = (canvas) => {
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 200, 0, 400);
    g.addColorStop(0, "#44B4FF");
    g.addColorStop(1, "#CCEAFF");
    return {
      datasets: [
        {
          label: "Portfolio Data",
          data: pieData,
          backgroundColor: [
            "#ff4f53",
            "#ff654c",
            "#ff7a47",
            "#ff8d44",
            "#ffa043",
            "#ffb347",
            "#ffc54e",
            "#ffd659",
          ],
        },
      ],
      labels: [
        "Consumer Cyclical",
        "Financials",
        "Materials",
        "Services",
        "Industrials",
        "Health Care",
        "Consumer Goods",
        "Energy",
      ],
    };
  };

  // Chart.js options
  const options = {
    responsive: true,
    parsing: {
      key: "price",
    },
    plugins: {
      title: {
        display: true,
        text: "Your Sectors",
      },
    },
  };
  const options2 = {
    responsive: true,
    parsing: {
      key: "value",
    },
    plugins: {
      title: {
        display: true,
        text: "Investor Sectors",
      },
    },
  };

  return (
    <>
      <div tw="w-full max-w-lg">
        <Doughnut data={data} options={options} />
      </div>
      <div tw="w-full max-w-lg">
        <Doughnut data={data2} options={options2} />
      </div>
    </>
  );
};

export default PieChart;
