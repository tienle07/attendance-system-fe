import React from "react";
import { useState } from "react";
import Chart from "react-apexcharts";

function EmployeePositionChart(props) {
  const { identity, Title, TitleRight, extraDivBody, data } = props;
  const positions= data?.totalPositions?.map((pos)=>{
    return pos.positionName
  })
  const total= data?.totalPositions?.map((pos)=>{
    return pos.totalNumber
  })
  const color= data?.totalPositions?.map((pos,i)=>{
    return `var(--chart-color${i+1})`
  })
  const TotalEmployeesChartData = {
    options: {
      align: "center",
      chart: {
        height: 300,
        type: "donut",
        align: "center",
      },
      labels: positions,
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        show: true,
      },
      colors: color,
      series: total,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };
  const [option, setOption] = useState(TotalEmployeesChartData?.options);
  const [series, setSeries] = useState(TotalEmployeesChartData?.options.series);

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">{Title}</h6>
        {TitleRight ? <h4 className="mb-0 fw-bold">{TitleRight}</h4> : null}
      </div>
      <div className="card-body">
        {extraDivBody ? extraDivBody() : null}
        <div ac-chart="'donut'" id={"SimpleCahrt" + identity}>
          <Chart
            options={option}
            series={series}
            type={option ? option.chart.type : "bar"}
            height={322}
          />
        </div>
      </div>
    </div>
  );
}

export default EmployeePositionChart;
