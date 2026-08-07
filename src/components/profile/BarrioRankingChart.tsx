import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js";
import { Heladeria } from "../../types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarrioRankingChartProps {
  heladerias: Heladeria[];
}

export const BarrioRankingChart: React.FC<BarrioRankingChartProps> = ({
  heladerias,
}) => {
  // Agrupar visitas por barrio
  const barrioMap: Record<string, number> = {};
  heladerias.forEach((h) => {
    const barrio = "CABA";
    barrioMap[barrio] = (barrioMap[barrio] || 0) + h.visitas;
  });

  // Ordenar barrios de mayor a menor visitas
  const sortedBarrios = Object.entries(barrioMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const labels = sortedBarrios.map(([barrio]) => barrio);
  const visitsData = sortedBarrios.map(([, visits]) => visits);

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Visitas",
        data: visitsData,
        backgroundColor: "rgba(15, 23, 42, 0.8)", // Slate
        borderColor: "rgba(15, 23, 42, 1)",
        borderWidth: 2,
        borderRadius: 2,
        barThickness: 16,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y", // Gráfico de barras horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#334155",
        bodyColor: "#334155",
        borderColor: "rgba(15, 23, 42, 0.1)",
        borderWidth: 1,
        titleFont: {
          family: "Courier Prime",
          size: 11
        },
        bodyFont: {
          family: "Courier Prime",
          size: 11
        },
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(15, 23, 42, 0.05)",
        },
        ticks: {
          color: "rgba(15, 23, 42, 0.5)",
          font: {
            family: "Courier Prime",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#334155",
          font: {
            family: "Courier Prime",
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[220px]">
      {sortedBarrios.length === 0 ? (
        <div className="h-full flex items-center justify-center text-xs text-slate-500">
          Sin datos de visitas disponibles.
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};
export default BarrioRankingChart;
