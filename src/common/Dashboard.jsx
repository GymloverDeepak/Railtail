import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import axios from "axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function Dashboard({startDate,endDate}) {
  const envAPI_URL = import.meta.env.VITE_API_URL;
  const [category, setSategory] = useState("top-vendors");
  const [standard, setStandard] = useState([]);
  const [blanket, setBlanket] = useState([]);
  const [noData, setNoData] = useState([]);
  const [analyzeDelay, setAnalyzeDelay] = useState([]);
  const [analyzeOntime, setAnalyzeOntime] = useState([]);
  const [poStatusClose, setPoStatusClose] = useState([]);
  const [poStatusOpen, setPoStatusOpen] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);

  const poType = () => {
    axios
      .get(`${envAPI_URL}/analyze-po-type?start_date=${startDate}&end_date=${endDate}`)
      .then((response) => {
        setStandard(response.data.STANDARD);
        setBlanket(response.data.BLANKET_RELEASE);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const analyzePo = () => {
    axios
      .get(`${envAPI_URL}/analyze-po?start_date=${startDate}&end_date=${endDate}`)
      .then((response) => {
        setAnalyzeDelay(response.data.delayed);
        setAnalyzeOntime(response.data.ontime);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const poStatus = () => {
    axios
      .get(`${envAPI_URL}/analyze-po-status?start_date=${startDate}&end_date=${endDate}`)
      .then((response) => {
        setPoStatusOpen(response.data.OPEN);
        setPoStatusClose(response.data.CLOSE);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const topcategory = () => {
    axios
      .get(
        `${envAPI_URL}/${category}?start_date=${startDate}&end_date=${endDate}`
      )
      .then((response) => {
        setCategoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const vendorPerformance = () => {
    axios
      .get(
        `${envAPI_URL}/vendor-performance?start_date=${startDate}&end_date=${endDate}`
      )
      .then((response) => {
        setPerformance(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const noReceived = () => {
    axios
      .get(
        `${envAPI_URL}/vendor-performance-no-received-date?start_date=${startDate}&end_date=${endDate}`
      )
      .then((response) => {
        setNoData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const purchasesDept = () => {
    axios
      .get(`${envAPI_URL}/deptwise-purchase-total?start_date=${startDate}&end_date=${endDate}`)
      .then((response) => {
        setPurchaseData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  useEffect(() => {
    noReceived();
    poType();
    analyzePo();
    poStatus();
    topcategory();
    vendorPerformance();
    purchasesDept();
  }, [startDate,endDate,category]);
  const columns = [
    {
      name: "Vendor Name",
      selector: (row) => row.vendor_name || "No Vendor Name", // Display vendor name or fallback text
      sortable: true,
      width: "350px",
    },
    {
      name: "Total Days Delayed",
      selector: (row) => row.days_delayed || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Total Purchase Value",
      selector: (row) =>
        row.purchase_value?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) || "N/A",
      sortable: true,
    },
    {
      name: "line_Item_Desc",
      selector: (row) => row.line_Item_Desc || "N/A",
      sortable: true,
    },
    {
      name: "Tender Numbers",
      selector: (row) => row.tender_number || "N/A",
      sortable: true,
      width: "400px",
    },
    {
      name: "PO Numbers",
      selector: (row) => row.po_number || "N/A",
      sortable: true,
    },
  ];
  const columns2 = [
    {
      name: "Vendor Name",
      selector: (row) => row.vendor_name || "No Vendor Name", // Display vendor name or fallback text
      sortable: true,
      width: "350px",
    },
    {
      name: "Total Days Delayed",
      selector: (row) => row.days_delayed || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Total Purchase Value",
      selector: (row) =>
        row.purchase_value?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) || "N/A",
      sortable: true,
    },
    {
      name: "line_Item_Desc",
      selector: (row) => row.line_Item_Desc || "N/A",
      sortable: true,
    },
    {
      name: "Tender Numbers",
      selector: (row) => row.tender_number || "N/A",
      sortable: true,
      width: "400px",
    },
    {
      name: "PO Numbers",
      selector: (row) => row.po_number || "N/A",
      sortable: true,
    },
  ];
  const getBarChartData = () => {
    if (!purchaseData) return {};
  
    const groupedData = {};
    
    // Group data by department
    purchaseData.forEach((item) => {
      const { Department, line_Item_Value_With_Tax } = item;
  
      if (!groupedData[Department]) {
        groupedData[Department] = 0;
      }
      groupedData[Department] += line_Item_Value_With_Tax;
    });
  
    // Sort departments by the accumulated value in descending order
    const sortedDepartments = Object.entries(groupedData)
      .sort((a, b) => b[1] - a[1]);
  
    // Generate labels and data arrays from the sorted departments
    const labels = sortedDepartments.map(([department]) => department.slice(0, 15));
    const data = sortedDepartments.map(([, value]) => value);
  
    // Set colors for all bars (this can be customized)
    const colors = labels.map(() => "#1976D2");
  
    return {
      labels,
      datasets: [
        {
          label: "Purchase Value (All Departments)", // Label for the chart
          data,
          backgroundColor: colors,
        },
      ],
    };
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart resizing
    indexAxis: "y", // Use horizontal bars
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: true,
        text: "Departments and Purchase Values", // Title of the chart
      },
      tooltip: {
        enabled: true, // Show tooltips
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toLocaleString()}`; // Format tooltip value
          },
        },
      },
      datalabels: {
        display: true, // Display data values on bars
        color: "#fff", // Text color
        anchor: "end", // Position text at the end of the bar
        align: "right", // Align text to the right
        formatter: (value) => value.toLocaleString(), // Format values with commas
      },
    },
    hover: {
      mode: "nearest", // Hover mode
    },
    interaction: {
      mode: "nearest", // Nearest point interaction
      axis: "y", // Restrict interaction to the y-axis
    },
    layout: {
      padding: {
        top: 10,
        right: 20,
        bottom: 10,
        left: 20, // Padding for the chart
      },
    },
    scales: {
      x: {
        ticks: {
          // stepSize: 50000, // Step range of 50,000
          callback: function (value) {
            return value.toLocaleString(); // Format tick values with commas
          },
        },
        title: {
          display: true,
          text: "Purchase Value", // X-axis title
        },
      },
      y: {
        ticks: {
          autoSkip: false, // Ensure all department labels are displayed
          maxRotation: 90, // Rotate labels for better readability
          minRotation: 45, // Adjust rotation for long labels
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 1, // Set the border width of bars
        barThickness: 10, // Adjust bar thickness
      },
    },
  };
  const pieChartData = {
    labels:
      categoryData.length > 0
        ? categoryData
            .map(
              (item) =>
                item.vendor_Name ||
                item.Tender_No ||
                item.project_Number_Name ||
                item.line_Item_Desc ||
                item.Department
            )
            .slice(0, 5) // Limit to 5 labels for balance
        : ["Test 1", "Test 2", "Test 3", "Test 4", "Test 5"], // Fallback labels
  
    datasets: [
      {
        label: "Items",
        data:
          categoryData.length > 0
            ? (() => {
                // Calculate percentages
                const total = categoryData.reduce(
                  (sum, item) => sum + (item.line_Item_Value_With_Tax || 0),
                  0
                );
                return categoryData
                  .map((item) =>
                    total > 0
                      ? Math.round(
                          ((item.line_Item_Value_With_Tax || 0) / total) * 100
                        )
                      : 0
                  )
                  .slice(0, 5); // Limit to 5 data points
              })()
            : [20, 20, 20, 20, 20], // Fallback percentages if no categoryData
        backgroundColor: [
          "#87CEEB",
          "#ADD8E6",
          "#B0E0E6",
          "#B0C4DE",
          "#E0FFFF",
        ],
      },
    ],
  };
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const truncatedLabel = label.split(" ")[0].slice(0, 10);
            return `${truncatedLabel}: ${Math.round(value)}%`; // Round percentage to whole number
          },
        },
      },
      datalabels: {
        display: true, // Display percentage on the chart
        color: "#000", // Data label text color
        formatter: (value) => `${Math.round(value)}%`, // Format data as whole number percentage
      },
    },
  };
  const handleChartTypeChange = (e) => {
    setSategory(e.target.value);
  };
  return (
    <div className="mt-4">
      <div className="mb-4">
        {/* <h3>POs</h3> */}
        <div className="d-flex">
          <div
            className="card p-3"
            style={{
              width: "33%",
              height: "80px", // Reduced height
              backgroundColor: "#f9f9f9",
              margin: "10px",
            }}
          >
            {/* <h4 style={{ fontSize: "20px", marginBottom: "6px",textAlign:"center" }}> Po-Type</h4> */}
            <div className="d-flex">
              <div
                style={{ width: "50%", padding: "5px"}}
              >
                <h5 style={{ fontSize: "12px", textAlign: "center" }}>
                  Blanket-Release POs
                </h5>
                <p style={{ fontSize: "10px",textAlign: "center" }}>{blanket?blanket.count:"0"}</p>
              </div>
              <div
                style={{
                  width: "50%",
                  padding: "5px",
                  borderLeft: "1px solid #ddd",
                }}
              >
                <h5
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  Standard POs
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {standard?standard.count:"0"}
                </p>
              </div>
            </div>
          </div>
          <div
            className="card p-3 "
            style={{
              width: "33%",
              height: "80px", // Reduced height
              backgroundColor: "#f9f9f9",
              margin: "10px",
            }}
          >
            {/* <h4 style={{ fontSize: "20px", marginBottom: "6px",textAlign:"center" }}>Po Status</h4> */}
            <div className="d-flex">
              <div style={{ width: "50%", padding: "5px" }}>
                <h5 style={{ fontSize: "12px", textAlign: "center" }}>
                  Open POs
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {poStatusOpen?poStatusOpen.count:"0"}
                </p>
              </div>
              <div
                style={{
                  width: "50%",
                  padding: "5px",
                  borderLeft: "1px solid #ddd",
                }}
              >
                <h5 style={{ fontSize: "12px", textAlign: "center" }}>
                  Close POs
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {poStatusClose ?poStatusClose.count:"0"}
                </p>
              </div>
            </div>
          </div>

          <div
            className="card p-3"
            style={{
              width: "33%",
              height: "80px", // Reduced height
              backgroundColor: "#f9f9f9",
              margin: "10px",
            }}
          >
            {/* <h4 style={{ fontSize: "20px", marginBottom: "6px",textAlign:"center" }}>
               Analyze POs
            </h4> */}
            <div className="d-flex">
              <div style={{ width: "50%", padding: "5px" }}>
                <h5 style={{ fontSize: "12px", textAlign: "center" }}>
                  Ontime POs
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {analyzeOntime?analyzeOntime.count:"0"}
                </p>
              </div>
              <div
                style={{
                  width: "50%",
                  padding: "5px",
                  borderLeft: "1px solid #ddd",
                }}
              >
                <h5 style={{ fontSize: "12px", textAlign: "center" }}>
                  {" "}
                  Delayed POs
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {analyzeDelay ?analyzeDelay.count:"0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 d-flex ">
        <div className="card p-3" style={{ width: "50%", height: "500px" }}>
          <h3 style={{ fontSize: "20px", color: "#012970" }}>
            Purchases By Department
          </h3>

          <div style={{ height: "350px", marginTop: "20px" }}>
            <Bar
              data={getBarChartData()}
              options={{
                ...barChartOptions,
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                  x: {
                    ticks: {
                      font: { size: 10 },
                    },
                  },
                  y: {
                    ticks: {
                      font: { size: 12 },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="card p-3" style={{ width: "50%", height: "500px" }}>
          {/* <h3></h3> */}
          <div>
            <div className="d-flex align-items-center mb-3">
              <div className="me-2" style={{ width: "33%" }}>
                <label
                  htmlFor="category"
                  className="form-label"
                  style={{ fontSize: "20px", color: "#012970" }}
                >
                  Top 5 Analysis
                </label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={handleChartTypeChange}
                >
                  <option value="top-vendors">Vendors</option>
                  <option value="top-tenders">Tenders</option>
                  <option value="top-projects">Projects</option>
                  <option value="top-items">Items</option>
                  <option value="top-departments">Departments</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ height: "400px", marginTop: "20px" }}>
            <Pie
              data={pieChartData}
              plugins={[ChartDataLabels]}
              options={{
                ...pieChartOptions,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
      <div className="card">
        <DataTable
          title="Vendors Performance"
          columns={columns}
          data={performance || []}
          pagination
          paginationPerPage={5}
          highlightOnHover
        />
      </div>
      <div className="card">
        <DataTable
          title="Payment Turnaround Assessment"
          columns={columns2}
          data={noData || []}
          pagination
          paginationPerPage={5}
          highlightOnHover
        />
      </div>
    </div>
  );
}

export default Dashboard;
