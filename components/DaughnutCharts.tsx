"use client"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DaughnutCharts = ({ accounts } : DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        label: 'Banks', // This is the title of the dataset
        data: [1250, 2500, 3750],
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa']
      },
    ],
    labels: ['Bank 1', 'Bank 2', 'Bank 3'] // Fixed the typo here from "lables" to "labels"
  }

  return <Doughnut
  options={{
    cutout : '60%',
    plugins : {
        legend:{
          display:false
        }
    }
  }}
   data={data} />
}

export default DaughnutCharts;