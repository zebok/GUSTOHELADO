import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from "chart.js";
import { Heladeria } from "../../types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ClasicosVsAutorChartProps {
  heladerias: Heladeria[];
}

export const ClasicosVsAutorChart: React.FC<ClasicosVsAutorChartProps> = ({
  heladerias,
}) => {
  let clasicasVisits = 0;
  let autorVisits = 0;

  heladerias.forEach((h) => {
    if (h.scorePorCategoria["AUTOR"] !== undefined) {
      autorVisits += h.visitas;
    } else {
      clasicasVisits += h.visitas;
    }
  });

  const total = clasicasVisits + autorVisits;
  const dataValues = total > 0 ? [clasicasVisits, autorVisits] : [50, 50];

  const data: ChartData<"doughnut"> = {
    labels: ["Sabores Clásicos", "Notas de Autor"],
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "rgba(245, 245, 244, 0.7)",  // Slate
          "rgba(245, 245, 244, 0.2)",  // Tiza gris
        ],
        borderColor: [
          "rgba(245, 245, 244, 0.9)",
          "rgba(245, 245, 244, 0.4)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#334155",
          font: {
            family: "Courier Prime",
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#334155",
        bodyColor: "#334155",
        borderColor: "rgba(15, 23, 42, 0.1)",
        borderWidth: 1,
        titleFont: {
          family: "Courier Prime"
        },
        bodyFont: {
          family: "Courier Prime"
        },
        padding: 10,
        callbacks: {
          label: (context) => {
            const val = context.raw as number;
            const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : "0";
            return ` ${context.label}: ${val} visitas (${percentage}%)`;
          },
        },
      },
    },
    cutout: "75%",
  };

  return (
    <div className="relative w-full h-[220px]">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-4 font-hand">
        <span className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Total</span>
        <span className="text-xl font-bold text-slate-900">{total}</span>
        <span className="text-[10px] text-slate-500">visitas</span>
      </div>
    </div>
  );
};
export default ClasicosVsAutorChart;
