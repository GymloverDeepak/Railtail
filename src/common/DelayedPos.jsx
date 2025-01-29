import React from 'react'
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
// import { RiFileExcel2Line } from "react-icons/ri";
import excelLogo from "../assets/img/excelLogo.png";
function DelayedPos({noData}) {
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
          width: "300px",
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
            // fontWeight: 'bold',
          },
        },
      };
      const handleTitleClick = () => {
        // Handle the title click logic here
        console.log("Title clicked");
        // You can redirect, toggle a modal, or any other action
      };
      const handleDownloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(noData || []); // Convert data to Excel sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Delayed POs(Not delivered)");
        XLSX.writeFile(wb, "Delayed POs(Not delivered).xlsx"); // Download Excel file
      };
  return (
    <DataTable
    title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a onClick={handleTitleClick} style={{ fontSize: "18px", fontWeight: "bold" }}>
            Delayed POs(Not delivered)
            </a>
            <button
                  onClick={handleDownloadExcel}
                  style={{
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                   <img src={excelLogo} alt="Excel" width="50px" height="50px" />
                </button>
          </div>
        }
    columns={columns2}
    data={noData || []}
    pagination
    paginationPerPage={5}
    highlightOnHover
    customStyles={customStyles}
  />
  )
}

export default DelayedPos