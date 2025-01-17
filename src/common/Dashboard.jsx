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
  const [analyzeDelay, setAnalyzeDelay] = useState([]);
  const [analyzeOntime, setAnalyzeOntime] = useState([]);
  const [poStatusClose, setPoStatusClose] = useState([]);
  const [poStatusOpen, setPoStatusOpen] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [purchase, setPurchase] = useState("monthwise-purchases");
  const [purchaseData, setPurchaseData] = useState([]);

  const poType = () => {
    axios
      .get(`${envAPI_URL}/analyze-po-type`)
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
      .get(`${envAPI_URL}/analyze-po`)
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
      .get(`${envAPI_URL}/analyze-po-status`)
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
        `${envAPI_URL}/vendor-performance?start_date=2023-01-01&end_date=2024-12-31`
      )
      .then((response) => {
        setPerformance(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const purchasesDept = () => {
    axios
      .get(`${envAPI_URL}/${purchase}`)
      .then((response) => {
        setPurchaseData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  useEffect(() => {
    poType();
    analyzePo();
    poStatus();
    topcategory();
    vendorPerformance();
    purchasesDept();
  }, [category, purchase]);
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
  const getBarChartData = (filterType, filterValue) => {
    if (!purchaseData) return {};
    const groupedData = {};
    purchaseData.forEach((item) => {
      const { Department, Month, Quarter, Year, line_Item_Value_With_Tax } =
        item;
      if (
        (filterType === 4 && Month !== filterValue) ||
        (filterType === 2 && Quarter !== filterValue) ||
        (filterType === 2024 && Year !== filterValue)
      ) {
        return; 
      }

      if (!groupedData[Department]) {
        groupedData[Department] = 0;
      }
      groupedData[Department] += line_Item_Value_With_Tax;
    });

    const sortedDepartments = Object.entries(groupedData)
      .sort((a, b) => b[1] - a[1]) 
      .slice(0, 15); 

    const labels = sortedDepartments.map(([department]) => department);
    const data = sortedDepartments.map(([, value]) => value); 

    const colors = labels.map(() => "#1976D2"); 

    return {
      labels,
      datasets: [
        {
          label: `Purchase Value (${filterType}-${filterValue})`,
          data,
          backgroundColor: colors,
        },
      ],
    };
  };
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow resizing based on container
    indexAxis: "y", // Horizontal bar chart
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      title: {
        display: true,
        text: ``, // Title reflects filtered data
      },
      tooltip: {
        enabled: true, // Enable tooltips
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Tooltip displays department value
          },
        },
      },
      datalabels: {
        display: true, // Show data values on bars
        color: "#fff", // Text color
        anchor: "end", // Position at the end of the bar
        align: "right", // Align text
        formatter: (value) => value.toLocaleString(), // Format numbers
      },
    },
    hover: {
      mode: "nearest", // Interaction mode
    },
    interaction: {
      mode: "nearest", // Ensure nearest point interaction
      axis: "y", // Restrict interaction to y-axis
    },
  };
  const pieChartData = {
    labels:
      categoryData.length > 0
        ? categoryData
            .map(
              (item) =>
                item.vendor_Name ||
                item.Tendor_No ||
                item.project_Number_Name ||
                item.line_Item_Desc ||
                item.Department
            )
            .slice(0, 5) // Limit to 5 labels for balance
        : ["test 1", "test 2", "test 3", "test 4", "test 5"], // Fallback labels

    datasets: [
      {
        label: "Items",
        data:
          categoryData.length > 0
            ? categoryData.map((item) => item.line_Item_Value_With_Tax || 0) // Use line_Item_Value_With_Tax for each item
            : [50, 50, 50, 50, 50], // Fallback data if no categoryData
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
            return `${truncatedLabel}: ${value}`; 
          },
        },
      },
      datalabels: {
        display: false, 
      },
    },
  };
  const handleTimePeriodChange = (e) => {
    setPurchase(e.target.value);
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
                style={{ width: "50%", padding: "5px", textAlign: "center" }}
              >
                <h5 style={{ fontSize: "12px", textAlign: "center" }}>
                  BLANKET-RELEASE POs
                </h5>
                <p style={{ fontSize: "10px" }}>{blanket.count}</p>
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
                    textAlign: "center",
                  }}
                >
                  STANDARD POs
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {standard?.count}
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
                  {poStatusOpen.count}
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
                  {poStatusClose.count}
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
                  {analyzeOntime.count}
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
                  {analyzeDelay.count}
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
          <div className="d-flex align-items-center mb-2">
            <select
              className="form-select me-2"
              value={purchase}
              onChange={handleTimePeriodChange}
              style={{ width: "auto" }}
            >
              <option value="monthwise-purchases">Monthly</option>
              <option value="quarterwise-purchases">Quarterly</option>
              <option value="yearwise-purchases">Yearly</option>
            </select>
          </div>

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
    </div>
  );
}

export default Dashboard;
