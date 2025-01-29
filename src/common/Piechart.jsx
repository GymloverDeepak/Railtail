import React, { useState } from "react";
import { Chart } from "react-google-charts";

const Piechart = ({ categoryData }) => {
  const [explodedSlices, setExplodedSlices] = useState([]);

  // Ensure categoryData is not empty before processing
  const transformedData =
    categoryData && categoryData.length > 0
      ? categoryData.map((item) => [
          item.vendor_Name ||
          item.Tender_No ||
          item.project_Number_Name ||
          item.line_Item_Desc ||
          item.Department ||
          "Unknown",
          {
            v: parseFloat(item.percentage) || 0, // Percentage value
            f: `(${item.line_Item_Value_With_Tax})`, // Format for tooltip
          },
        ])
      : [["No Data", { v: 1, f: "No Data (0)" }]]; // Default fallback if no data is available

  // Add header row for Google Charts
  const data = [["Category", "Percentage"], ...transformedData];

  // Options to customize the chart
  const options = {
    title: "",
    is3D: true, // Enables 3D view
    pieSliceText: "percentage", // Show percentage inside the slice
    tooltip: { isHtml: true }, // Allow formatted tooltips
    slices: explodedSlices.reduce((acc, index) => {
      acc[index] = { offset: 0.1 }; // Adjust explosion distance
      return acc;
    }, {}),
  };

  // Handle click event to explode the slice
  const handleClick = (chartWrapper) => {
    const selection = chartWrapper.getChart().getSelection();
    if (selection.length > 0) {
      const clickedSliceIndex = selection[0].row;
      const newExplodedSlices = explodedSlices.includes(clickedSliceIndex)
        ? explodedSlices.filter((index) => index !== clickedSliceIndex)
        : [...explodedSlices, clickedSliceIndex];
      setExplodedSlices(newExplodedSlices);
    }
  };

  return (
    <div>
      <Chart
        chartType="PieChart"
        width="100%"
        height="380px"
        data={data}
        options={options}
        chartEvents={[
          {
            eventName: "select",
            callback: ({ chartWrapper }) => handleClick(chartWrapper),
          },
        ]}
      />
    </div>
  );
};

export default Piechart;
