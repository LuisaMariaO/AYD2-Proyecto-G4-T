import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function BarsChart({ data, graphTitle }) {

    var options = {
        responsive: true,
        animation: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: graphTitle
            }
        },
        scales: {
            y: {
                min: 0,
                max: 5
            },
            x: {
                ticks: { color: 'rgba(0, 0, 0)' }
            }
        }
    };

    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);

    var data = {

        labels: labels,
        datasets: [
            {
                label: 'Graphs',
                data: values,
                backgroundColor: 'rgba(255, 182, 193, 0.7)'
            }
        ]
    };

    return (
        <div className="card flex justify-content-center">
            <Bar data={data} options={options} />
        </div>
    );
}

export default BarsChart;