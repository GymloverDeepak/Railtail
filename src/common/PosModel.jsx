import React from "react";
import { Modal, Button ,Spinner} from "react-bootstrap";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { RiFileExcel2Line } from "react-icons/ri";
// import excelLogo from "../assets/img/excelLogo.png";
const POsModal = ({ show, handleClose, posTitle,loading,posData}) => {
  const columns = [
    {
      name: "Buyer Name",
      selector: (row) => row.Buyer_Name || "No Vendor Name", // Display vendor name or fallback text
      sortable: true,
      width: "350px",
    },
    {
      name: "Buyer Dept",
      selector: (row) => row.Buyer_Dept || "N/A",
      sortable: true,
    },
    {
      name: "GRN Number",
      selector: (row) => row.GRN_Num || "N/A",
      sortable: true,
    },
    {
      name: "Invoice Number",
      selector: (row) => row.ERP_Invoice_Number || "N/A",
      sortable: true,
      width: "350px",
    },
    // {
    //   name: "Line Item Value With Tax",
    //   selector: (row) => row.tender_number || "N/A",
    //   sortable: true,
    //   width: "250px",
    // },
    {
      name: "PO Number",
      selector: (row) => row.PO_Number || "N/A",
      sortable: true,
    },
    {
      name: "Line Item Desc",
      selector: (row) => row.Line_Item_Desc || "N/A",
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
  const handleDownloadExcel = () => {
    // Ensure 'performance' is an array before passing it to the Excel function
    const data = Array.isArray(posData) ? posData : [];
  
    // Convert data to Excel sheet
    const ws = XLSX.utils.json_to_sheet(data); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws,posTitle);
    XLSX.writeFile(wb, `${posTitle}.xlsx`,); // Download Excel file
  };
  
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl" // Extra large for 80% width
      centered // Center the modal
      dialogClassName="custom-modal-width"
    >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
      {loading ? (
          // Show Spinner when loading
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <DataTable
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <a style={{ fontSize: "18px", fontWeight: "bold" }}>{posTitle}</a>
                <button
                  onClick={handleDownloadExcel}
                  disabled={loading}
                  style={{
                    color: "white",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:"#114f11"
                  }}
                >
                <RiFileExcel2Line size={20} />
                   {/* <img src={excelLogo} alt="Excel" width="50px" height="50px" /> */}
                </button>
              </div>
            }
            columns={columns}
            data={posData || []}
            pagination
            paginationPerPage={5}
            highlightOnHover
            customStyles={customStyles}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default POsModal;
