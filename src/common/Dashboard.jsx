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
import axios from "axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const envAPI_URL = import.meta.env.VITE_API_URL;
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [timePeriod, setTimePeriod] = useState("monthwise");
  const [category, setSategory] = useState("top-vendors");
  const [apiData, setApiData] = useState([]); // To store API response data
  const [poTypeData, setPoTypeData] = useState([]);
  const [analyzePoData, setAnalyzePoData] = useState([]);
  const [poStatusData, setPoStatusData] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [purchase, setPurchase] = useState("monthwise-purchases");

  const poType = () => {
    axios
      .get(`${envAPI_URL}/analyze-po-type`)
      .then((response) => {
        setPoTypeData(response.data.STANDARD); // Assuming the data is in the response.data
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const analyzePo = () => {
    axios
      .get(`${envAPI_URL}/analyze-po`)
      .then((response) => {
        setAnalyzePoData(response.data.delayed); // Assuming the data is in the response.data
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };
  const poStatus = () => {
    axios
      .get(`${envAPI_URL}/analyze-po-status`)
      .then((response) => {
        setPoStatusData(response.data.OPEN); // Assuming the data is in the response.data
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
        console.log("purchasesDept", response.data);
        // (response.data);
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
  }, []);
  const columns = [
    {
      name: "Vendor Name",
      selector: (row) => row.vendor_Name || "No Vendor Name", // Display vendor name or fallback text
      sortable: true,
      width:"250px"
    },
    {
      name: "Total Days Delayed",
      selector: (row) => row.total_days_delayed || "N/A", // Display total days delayed or fallback text
      sortable: true,
      width:"150px"
    },
    {
      name: "Total Purchase Value",
      selector: (row) =>
        row.total_purchase_value?.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) || "N/A", // Format value as currency or fallback text
      sortable: true,
      width:"180px"
    },
    {
      name: "Tender Numbers",
      selector: (row) =>
        row.tender_numbers && row.tender_numbers.length > 0
          ? row.tender_numbers.join(", ")
          : "No Tenders",
      sortable: true,
      width:"180px"
    },
    {
      name: "PO Numbers",
      selector: (row) =>
        row.po_numbers && row.po_numbers.length > 0
          ? row.po_numbers.join(", ")
          : "No POs",
      sortable: true,
      width:"150px"
    },
  ];
  const getBarChartData = () => {
    if (!apiData) return {}; // If API data isn't loaded yet, return empty chart data

    const { monthlyData, quarterlyData, halfyearlyData, yearlyData } = apiData;

    switch (purchase) {
      case "quarterly":
        return {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            {
              label: "Sales",
              data: quarterlyData || [0, 0, 0, 0],
              backgroundColor: ["#007bff", "#28a745"],
            },
          ],
        };
      case "halfyearly":
        return {
          labels: ["H1", "H2"],
          datasets: [
            {
              label: "Sales",
              data: halfyearlyData || [0, 0],
              backgroundColor: ["#007bff", "#28a745"],
            },
          ],
        };
      case "yearly":
        return {
          labels: ["2024"],
          datasets: [
            {
              label: "Sales",
              data: yearlyData || [0],
              backgroundColor: ["#007bff"],
            },
          ],
        };
      default:
        return {
          labels: ["January", "February", "March", "April", "May"],
          datasets: [
            {
              label: "Purchase-Department",
              data: monthlyData || [10, 20, 50, 15, 40],
              backgroundColor: [
                "#007bff",
                "#28a745",
                "#dc3545",
                "#ffc107",
                "#17a2b8",
              ],
            },
          ],
        };
    }
  };
  const barChartOptions = {
    responsive: true,
    indexAxis: "y", // This is the key change for horizontal bar chart
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Sales Data (${
          purchase.charAt(0).toUpperCase() + purchase.slice(1)
        })`,
      },
    },
  };
  const pieChartData = {
    labels:
      categoryData.length > 0
        ? categoryData.map(
            (item) =>
              item.vendor_Name ||
              item.Tendor_No ||
              item.project_Number_Name ||
              item.line_Item_Desc ||
              item.Department
          )
        : ["test 1", "test 2", "test 3", "test 4", "test 5"],
    datasets: [
      {
        label: "Items",
        data: [30, 40, 20, 50, 60],
        backgroundColor: [
          "#007bff",
          "#28a745",
          "#dc3545",
          "#ffc107",
          "#17a2b8",
        ], // 5 distinct colors
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: ` (${category || ""})`,
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
    <div className="container mt-4">
      <div className="mb-4">
        <h3>POs</h3>
        <div className="d-flex justify-content-between">
          <div className="card p-3" style={{ width: "33%", height: "147px" }}>
            <h4>PO Status</h4>
            <div
              className="d-flex"
              style={{ borderBottom: "2px solid #ddd", height: "100%" }}
            >
              <div className="pr-3" style={{ width: "50%", padding: "10px" }}>
                <h5>Items</h5>
                <p>{poStatusData.total_value}</p>
              </div>
              <div
                style={{
                  width: "50%",
                  borderLeft: "2px solid #ddd",
                  padding: "10px",
                }}
              >
                <h5>Percentage</h5>
                <p>{poStatusData.percentage}% of total</p>
              </div>
            </div>
          </div>
          <div className="card p-3" style={{ width: "33%", height: "147px" }}>
            <h4>PO TYPE </h4>
            <div
              className="d-flex"
              style={{ borderBottom: "2px solid #ddd", height: "100%" }}
            >
              <div className="pr-3" style={{ width: "50%", padding: "10px" }}>
                <h5>Items</h5>
                <p>{poTypeData?.total_value}</p>
              </div>
              <div
                style={{
                  width: "50%",
                  borderLeft: "2px solid #ddd",
                  padding: "10px",
                }}
              >
                <h5>Percentage</h5>
                <p>{poTypeData.percentage}% of total</p>
              </div>
            </div>
          </div>
          <div className="card p-3" style={{ width: "33%", height: "147px" }}>
            <h4>Ontime/Delayed POs</h4>
            <div
              className="d-flex"
              style={{ borderBottom: "2px solid #ddd", height: "100%" }}
            >
              <div className="pr-3" style={{ width: "50%", padding: "10px" }}>
                <h5>Items</h5>
                <p>{analyzePoData.percentage}</p>
              </div>
              <div
                style={{
                  width: "50%",
                  borderLeft: "2px solid #ddd",
                  padding: "10px",
                }}
              >
                <h5>Percentage</h5>
                <p>{analyzePoData.percentage}% of total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 d-flex justify-content-between">
        <div className="card p-3" style={{ width: "48%" }}>
          <h3>Purchases-Department</h3>
          {/* Date Filter Section */}
          <div className="mb-2">
            <select
              className="form-select"
              value={purchase}
              onChange={handleTimePeriodChange}
            >
              <option value="monthwise-purchases">Monthly</option>
              <option value="quarterwise-purchases">Quarterly</option>
              <option value="yearwise-purchases">Yearly</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => purchasesDept()}
            style={{ width: "150px" }}
          >
            Apply Filter
          </button>
          <Bar data={getBarChartData()} options={barChartOptions} />
        </div>
        <div className="card p-3" style={{ width: "48%" }}>
          <h3>Top 5 category </h3>
          <div className="mb-1">
            <label htmlFor="category">Select Category</label>
            <select
              id="category"
              className="form-select mb-2"
              value={category}
              onChange={handleChartTypeChange}
            >
              <option value="top-vendors">Vendors</option>
              <option value="top-tenders">Tendors</option>
              <option value="top-projects">Projects</option>
              <option value="top-items">items</option>
              <option value="top-departments">Departments</option>
            </select>

            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              className="form-control mb-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              className="form-control mb-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <button className="btn btn-primary" onClick={topcategory}>
              Apply Filter
            </button>
          </div>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
      <div className="card">
        <DataTable
          title="Vendors Performance"
          columns={columns}
          data={performance || []}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
}

export default Dashboard;
