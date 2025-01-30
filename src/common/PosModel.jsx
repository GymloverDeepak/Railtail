import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { RiFileExcel2Line } from "react-icons/ri";

const POsModal = ({ show, handleClose, posTitle, loading, posData }) => {
  const columns = [
    { name: "Buyer Name", selector: (row) => row.Buyer_Name || "No Vendor Name", sortable: true, width: "350px" },
    { name: "Buyer Dept", selector: (row) => row.Buyer_Dept || "N/A", sortable: true },
    { name: "GRN Number", selector: (row) => row.GRN_Num || "N/A", sortable: true },
    { name: "Invoice Number", selector: (row) => row.ERP_Invoice_Number || "N/A", sortable: true, width: "350px" },
    { name: "PO Number", selector: (row) => row.PO_Number || "N/A", sortable: true },
    { name: "Line Item Desc", selector: (row) => row.Line_Item_Desc || "N/A", sortable: true },
  ];

  const customStyles = {
    header: {
      style: {
        color: "#012970",
        fontSize: "17px",
      },
    },
  };

  const handleDownloadExcel = () => {
    const data = Array.isArray(posData) ? posData : [];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, posTitle);
    XLSX.writeFile(wb, `${posTitle}.xlsx`);
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered dialogClassName="custom-modal-width">
      <Modal.Body style={{ maxHeight: "600px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div style={{ flexGrow: 1, overflow: "hidden" }}>
          <DataTable
  title={
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <span style={{ fontSize: "18px", fontWeight: "bold" }}>{posTitle}</span>

      <div style={{ display: "flex", gap: "10px" }}> 
        <button
          onClick={handleDownloadExcel}
          disabled={loading}
          style={{
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#114f11",
            padding: "5px 10px",
            borderRadius: "11px"
          }}
        >
          <RiFileExcel2Line  size={20} />
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "#000",
          }}
        >
          ✖
        </button>
      </div>
    </div>
  }
  columns={columns}
  data={posData || []}
  pagination
  highlightOnHover
  customStyles={customStyles}
  fixedHeader
  fixedHeaderScrollHeight="450px"
/>

          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default POsModal;
