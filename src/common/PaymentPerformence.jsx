import React from 'react'
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
// import { RiFileExcel2Line } from "react-icons/ri";
import excelLogo from "../assets/img/excelLogo.png";
function PaymentPerformence({payment}) {
  const columns3 = [
    {
      name: "Supplier invoice no.",
      selector: (row) => row.supplier_inv_no || "No Vendor Name", // Display vendor name or fallback text
      sortable: true,
      width: "150px",
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
    const ws = XLSX.utils.json_to_sheet(payment || []); // Convert data to Excel sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payment Performance");
    XLSX.writeFile(wb, "Payment Performance.xlsx"); // Download Excel file
  };
  return (
    <DataTable
    title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a onClick={handleTitleClick} style={{ fontSize: "18px", fontWeight: "bold" }}>
            Payment Performance
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
    columns={columns3}
    data={payment || []}
    pagination
    paginationPerPage={5}
    highlightOnHover
    customStyles={customStyles}
  />
  )
}

export default PaymentPerformence