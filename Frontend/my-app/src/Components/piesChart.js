import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import 'chartjs-plugin-datalabels';


ChartJS.register(ArcElement, Tooltip, Legend)

var options = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
        datalabels: {
            display: false
        }
    }
};

export default function Pies( props ) {
    return <Pie style={{"margin": "0 auto"}} data={props.Data} options={options}/>
}