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
  const [payment,setPayment] = useState([])
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
  const paymentPerformance = () => {
    axios
      .get(
        `${envAPI_URL}/payment-performance?start_date=${startDate}&end_date=${endDate}`
      )
      .then((response) => {
        setPayment(response.data);
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
    paymentPerformance()
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
      selector: (row) => row.DaysDelayed || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Total Purchase Value",
      selector: (row) => row.purchase_value || "N/A",
      sortable: true,
      width: "150px"
    },
    {
      name: "line_Item_Desc",
      selector: (row) => row.line_item_desc || "N/A",
      sortable: true,
    },
    {
      name: "Tender Number",
      selector: (row) => row.tender_number || "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "PO Number",
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
      selector: (row) => row.DaysDelayed || "N/A",
      sortable: true,
      width: "150px",
    },
    {
      name: "Total Purchase Value",
      selector: (row) => row.purchase_value || "N/A",
      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => row.line_item_desc|| "N/A",
      sortable: true,
      width: "200px",
    },
    {
      name: "Tender Number",
      selector: (row) => row.tender_number || "N/A",
      sortable: true,
      width: "250px",
    },
    {
      name: "PO Number",
      selector: (row) => row.po_number || "N/A",
      sortable: true,
    },
  ];
  const columns3 = [
    {
      name: "Supplier invoice no.",
      selector: (row) => row.vendor_name || "No Vendor Name", // Display vendor name or fallback text
      sortable: true,
      width: "350px",
    },
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
      selector: (row) => row.purchase_value || "N/A",
      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => row.line_Item_Desc || "N/A",
      sortable: true,
    },
    {
      name: "Tender Number",
      selector: (row) => row.tender_number || "N/A",
      sortable: true,
      width: "400px",
    },
    {
      name: "PO Number",
      selector: (row) => row.po_number || "N/A",
      sortable: true,
    },
  ];
  const getBarChartData = () => {
    if (!purchaseData || !Array.isArray(purchaseData)) return {};
  
    const groupedData = {};
    const departmentTotalValues = {};
    
    purchaseData.forEach((item) => {
      const { Department, total_value, unique_po_count } = item;
  
      if (!groupedData[Department]) {
        groupedData[Department] = 0;
        departmentTotalValues[Department] = 0;
      }
  
      groupedData[Department] += unique_po_count;
      departmentTotalValues[Department] += total_value;
    });
  
    const sortedDepartments = Object.entries(groupedData).sort((a, b) => b[1] - a[1]) || [];
  
    const maxLength = 50; // Maximum department name length in characters
    const labels = sortedDepartments.map(([department]) => {
      if (typeof department === "string") {
        return department.length > maxLength ? department.slice(0, maxLength) + "..." : department;
      }
      return department;
    });
  
    const fullLabels = sortedDepartments.map(([department]) => department); // Full department names
    const data = sortedDepartments.map(([, value]) => value);
  
    // Set colors for all bars
    const colors = labels.map(() => "#1976D2");
  
    return { labels, data, colors, fullLabels, sortedDepartments, departmentTotalValues };
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
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            const barChartData = getBarChartData(); // Retrieve full data
            const fullLabels = barChartData.fullLabels; // Full department names
            const departmentTotalValues = barChartData.departmentTotalValues; // Total values for tooltips
            const department = fullLabels[tooltipItem.dataIndex]; // Get full department name
            const totalValue = departmentTotalValues[department]; // Retrieve the total value
            return `Total Value: ${totalValue.toLocaleString()}`; // Display formatted value
          },
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        anchor: "end",
        align: "right",
        formatter: (value) => value.toLocaleString(), // Format value with commas
      },
    },
    layout: {
      padding: {
        top: 10,
        right: 20,
        bottom: 10,
        left: 20,
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 10 }, // Smaller font for x-axis
          callback: (value) => value.toLocaleString(), // Format value with commas
        },
        title: {
          display: true,
          text: "Purchase Order (count)",
        },
      },
      y: {
        ticks: {
          autoSkip: false, // Ensure all department labels are displayed
          font: { size: 10 }, // Smaller font for y-axis
          maxRotation: 0, // Keep labels horizontal
          minRotation: 0,
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 1,
        barThickness: 15, // Thinner bars for compactness
      },
    },
  };
  
  const { labels, data, sortedDepartments } = getBarChartData();
  
  const chartContainerStyle = {
    height: `${Math.max(300, sortedDepartments.length * 25)}px`, // Adjust dynamically based on number of departments
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
            const label = "" || ""; // Get the label
            const index = context.dataIndex; // Get the index of the current item
            const rawData = context.chart.data.datasets[0].data; // Access the raw data array
            const fullValue = categoryData[index]?.line_Item_Value_With_Tax || 0; // Get the full value from categoryData
            const truncatedLabel = label.split(" ")[0].slice(0, 10); // Optional: Truncate the label
            return `${truncatedLabel}: ${fullValue.toLocaleString()} `; // Format and display the full value
          },
        },
      },
      datalabels: {
        display: true, // Display percentage on the chart
        color: "#000", // Data label text color
        formatter: (value) => `${Math.round(value)}%`, // Retain percentage for chart labels
      },
    },
  };
  
  const handleChartTypeChange = (e) => {
    setSategory(e.target.value);
  };
  return (
    <div className="new5" >
      <div className="mb-1">
        {/* <h3>POs</h3> */}
        <div className="d-flex">
          <div
            className="card"
            style={{
              width: "33%",
              height: "50px", // Reduced height
              backgroundColor: "#f9f9f9",
              margin: "10px",
            }}
          >
            {/* <h4 style={{ fontSize: "20px", marginBottom: "6px",textAlign:"center" }}> Po-Type</h4> */}
            <div className="d-flex">
              <div
                style={{ width: "50%",}}
              >
                <h5 style={{ fontSize: "12px", textAlign: "center", padding: "4px", }}>
                  Blanket-Release POs
                </h5>
                <p style={{ fontSize: "10px",textAlign: "center" }}>{blanket?blanket.count:"0"}</p>
              </div>
              <div
                style={{
                  width: "50%",
                  height: "48px",
                  padding: "4px",
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
            className="card "
            style={{
              width: "33%",
              height: "50px", // Reduced height
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
                  height: "48px",
                  padding: "5px",
                  borderLeft: "1px solid #ddd",
                }}
              >
                <h5 style={{ fontSize: "12px", textAlign: "center" }}>
                  Closed POs
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {poStatusClose ?poStatusClose.count:"0"}
                </p>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              width: "33%",
              height: "50px", // Reduced height
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
                  On-time PO Line Items
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {analyzeOntime?analyzeOntime.count:"0"}
                </p>
              </div>
              <div
                style={{
                  width: "50%",
                  padding: "5px",
                  height: "48px",
                  borderLeft: "1px solid #ddd",
                }}
              >
                <h5 style={{ fontSize: "12px", textAlign: "center" }}>
                  Delayed PO Line Items
                </h5>
                <p style={{ fontSize: "10px", textAlign: "center" }}>
                  {analyzeDelay ?analyzeDelay.count:"0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" d-flex ">
        <div className="card p-3" style={{ width: "50%", height: "500px" }}>
          <h3 style={{ fontSize: "20px", color: "#012970" }}>
            Purchases By Department
          </h3>

          <div style={{ height: "500px", marginTop: "10px" }}>
          <Bar
      style={chartContainerStyle}
      data={{
        labels,
        datasets: [
          {
            label: "Purchase Value (All Departments)",
            data,
            backgroundColor: labels.map(() => "#1976D2"),
          },
        ],
      }}
      options={{
        ...barChartOptions,
        maintainAspectRatio: false,
      }}
    />
          </div>
        </div>
        <div className="card p-3" style={{ width: "50%", height: "500px" }}>
          {/* <h3></h3> */}
          <div>
            <div className="d-flex align-items-center mb-2">
              <div className="me-3" style={{ width: "33%" }}>
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
          title="Vendors Delivery Performance"
          columns={columns}
          data={performance || []}
          pagination
          paginationPerPage={5}
          highlightOnHover
        />
      </div>
      <div className="card">
        <DataTable
          title="Delayed POs(Not delivered)"
          columns={columns2}
          data={noData || []}
          pagination
          paginationPerPage={5}
          highlightOnHover
        />
      </div>
      <div className="card">
        <DataTable
          title="Payment Performance"
          columns={columns3}
          data={payment || []}
          pagination
          paginationPerPage={5}
          highlightOnHover
        />
      </div>
    </div>
  );
}

export default Dashboard;
