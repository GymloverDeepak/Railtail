import React from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";

function VendorPerformance({ performance }) {
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
    },
    {
      name: "Total Purchase Value",
      selector: (row) => row.purchase_value || "N/A",
      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => row.line_item_desc || "N/A",
      sortable: true,
      width: "350px",
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

  const customStyles = {
    header: {
      style: {
        color: "#012970", // Replace with your desired color code
        fontSize: "17px",
      },
    },
  };

  const handleTitleClick = () => {
    console.log("Title clicked");
  };

  // Function to handle downloading Excel file
  const handleDownloadExcel = () => {
    // Ensure 'performance' is an array before passing it to the Excel function
    const data = Array.isArray(performance) ? performance : [];
  
    // Convert data to Excel sheet
    const ws = XLSX.utils.json_to_sheet(data); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Performance");
    XLSX.writeFile(wb, "Vendor_Performance.xlsx"); // Download Excel file
  };
  

  return (
    <div>
      <DataTable
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a onClick={handleTitleClick} style={{ fontSize: "18px", fontWeight: "bold" }}>
              Vendors Delivery Performance
            </a>
            <button
              onClick={handleDownloadExcel}
              style={{
                padding: "5px 15px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Download Excel
            </button>
          </div>
        }
        columns={columns}
        data={performance || []}
        pagination
        paginationPerPage={5}
        highlightOnHover
        customStyles={customStyles}
      />
    </div>
  );
}

export default VendorPerformance;
