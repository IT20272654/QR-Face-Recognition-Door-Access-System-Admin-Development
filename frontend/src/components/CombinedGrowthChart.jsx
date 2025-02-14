import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getLastSixMonthsData = (data) => {
  const sortedData = sortDataByMonthAndYear(data);
  return sortedData.slice(-6);
};

const sortDataByMonthAndYear = (data) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    return dateA - dateB;
  });
};

const CombinedGrowthChart = ({ data }) => {
  const userGrowthData = getLastSixMonthsData(data.userGrowth);
  const companyGrowthData = getLastSixMonthsData(data.companyGrowth);
  const doorGrowthData = getLastSixMonthsData(data.doorGrowth);

  const chartData = {
    labels: userGrowthData.map(item => `${monthNames[item.month - 1]} ${item.year}`),
    datasets: [
      {
        label: 'User Growth',
        data: userGrowthData.map(item => item.count),
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0.4)',
        borderColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: 'Company Growth',
        data: companyGrowthData.map(item => item.count),
        fill: false,
        backgroundColor: 'rgba(249, 115, 22,0.4)',
        borderColor: 'rgba(249, 115, 22,1)',
      },
      {
        label: 'Door Growth',
        data: doorGrowthData.map(item => item.count),
        fill: false,
        backgroundColor: 'rgba(34, 197, 94,0.4)',
        borderColor: 'rgba(34, 197, 94,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'rgba(148, 163, 184, 1)', // X-axis label color
        },
        
      },
      y: {
        ticks: {
          color: 'rgba(148, 163, 184, 1)', // Y-axis label color
        },
        
      },
    },
    
  };

  return (
    <div className="w-full h-56 md:h-[330px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CombinedGrowthChart;