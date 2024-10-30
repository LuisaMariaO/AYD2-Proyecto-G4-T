import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function PieChartDemo({ data, graphTitle }) {

    function generateColors(dataLength) {
        const colors = [];
        for (let i = 0; i < dataLength; i++) {
            const hue = (i / dataLength) * 360;
            const saturation = 30;
            const lightness = 80;
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        return colors;
    }

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const labels = data.map(item => item.label);
        const values = data.map(item => item.value);

        const chartData = {
            labels: labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: generateColors(data.length)
                }
            ]
        };

        const chartOptions = {
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: graphTitle
                }
            }
        };

        setChartData(chartData);
        setChartOptions(chartOptions);
    }, [data, graphTitle]);

    return (
        <div className="card flex justify-content-center">
            <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
    );
}
