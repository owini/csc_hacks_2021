import { Line, defaults } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import "twin.macro";
import { useState } from "react";

const Chart = ({ chartData, investorData }) => {
  const [delayed, setDelayed] = useState(false);
  defaults.font.family = "Montserrat";

  // Chart.js data
  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 400);
    g.addColorStop(0, "#44B4FF");
    g.addColorStop(1, "#99D6FF");
    return {
      datasets: [
        {
          label: "Portfolio Value",
          data: chartData,
          backgroundColor: g,
          fill: true,
          // borderColor: "#fff",
          pointBackgroundColor: "#9D8DF1",
        },
      ],
    };
  };

  // Chart.js options
  const options = {
    responsive: true,
    radius: 4,
    hitradius: 30,
    hoverRadius: 8,
    animation: {
      onComplete: () => {
        setDelayed(true);
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    parsing: {
      xAxisKey: "datetime",
      yAxisKey: "close",
    },
    scales: {
      x: {
        type: "time",
        font: {
          family: "Montserrat",
        },
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

  return <Line data={data} options={options} />;
};

export default Chart;
