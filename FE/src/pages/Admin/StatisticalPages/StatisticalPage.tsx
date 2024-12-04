import React from "react";
import MonthlyRevenueChart from "./MonthlyRevenueChart ";

function StatisticalPage() {
  return (
    <>  <h1 className="text-2xl font-bold m-2">
      Statistical
    </h1>
    <div className="justify-end p-2 flex-1 overflow-y-hidden">
      <MonthlyRevenueChart />
    </div>
    </>
  );
}

export default StatisticalPage;
