import ReactApexChart from "react-apexcharts";
import { ApexChartProps, ApexProps } from "../../types";
const ApexChart = (props: ApexChartProps) => {
    return <ReactApexChart
        type={props.type}
        options={props.options}
        series={props.series}
        height={props.height}
    />
}
const ApexColumn = (props: ApexProps) => {
    const options = props.options
    return <ApexChart
        options={options}
        series={props.series}
        type={'bar'}
        height={350}
    />
}
const ApexDonut = (props: ApexProps) => {
    return <ReactApexChart
        type={"donut"}
        options={props.options}
        series={props.series}
    />
}
const ApexLine = (props: ApexProps) => {
    return <ReactApexChart
        type={"line"}
        options={props.options}
        series={props.series}
    />
}
export { ApexColumn, ApexDonut, ApexLine }