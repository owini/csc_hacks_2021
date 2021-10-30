import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import "twin.macro";

const Chart = ({ chartData }) => {
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

  return <Line data={data} options={options} />;
};

export default Chart;
