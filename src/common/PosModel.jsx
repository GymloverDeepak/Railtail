import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { RiFileExcel2Line } from "react-icons/ri";
import ContentLoader from "react-content-loader"; // Import content loader

const POsModal = ({ show, handleClose, posTitle, loading, posData, startDate, endDate }) => {
  const columns = [
    { name: "Buyer Name", selector: (row) => row.Buyer_Name || "No Vendor Name", sortable: true, width: "350px" },
    { name: "Buyer Dept", selector: (row) => row.Buyer_Dept || "N/A", sortable: true },
    { name: "GRN Number", selector: (row) => row.GRN_Num || "N/A", sortable: true },
    { name: "Invoice Number", selector: (row) => row.ERP_Invoice_Number || "N/A", sortable: true, width: "350px" },
    { name: "PO Number", selector: (row) => row.PO_Number || "N/A", sortable: true },
    { name: "Line Item Desc", selector: (row) => row.Line_Item_Desc || "N/A", sortable: true },
  ];

  const customStyles = {
    header: { style: { color: "#012970", fontSize: "17px" } },
  };

  const handleDownloadExcel = () => {
    const data = Array.isArray(posData) ? posData : [];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, posTitle);
    XLSX.writeFile(wb, `${posTitle}.xlsx`);
  };

  // Skeleton loader for table rows
  const PlaceholderLoader = () => (
    <ContentLoader
      speed={2}
      width="100%"
      height={160}
      viewBox="0 0 100% 160"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {[...Array(5)].map((_, i) => (
        <rect key={i} x="0" y={i * 30} rx="5" ry="5" width="100%" height="20" />
      ))}
    </ContentLoader>
  );

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered dialogClassName="custom-modal-width">
      <Modal.Body style={{ maxHeight: "600px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flexGrow: 1, overflow: "hidden" }}>
          <DataTable
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>{posTitle}</span>
                
                <div style={{ display: "flex", gap: "10px" }}>
                <label
              htmlFor="startDate"
              className="form-label me-2"
            >
              From
            </label>
            <input
                type="date"
                id="startDate"
                className="form-control me-3"
                value={startDate}// Optionally, also trigger on click
                style={{ width: "150px" }}
                disabled={true}
              />

            <label
              htmlFor="endDate"
              className="form-label me-2"
            >
              To
            </label>
            <input
              type="date"
              id="endDate"
              className="form-control me-3"
              value={endDate}
              disabled={true}
              style={{ width: "150px" }}
            />
                  <button
                    onClick={handleDownloadExcel}
                    style={{
                      color: "white",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#114f11",
                      padding: "5px 10px",
                      borderRadius: "11px",
                    }}
                    hidden={posData.length === 0}
                  >
             
                    <RiFileExcel2Line size={20} />
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
            data={loading ? [] : posData || []} // Show empty data when loading
            pagination
            highlightOnHover
            customStyles={customStyles}
            fixedHeader
            fixedHeaderScrollHeight="450px"
            progressPending={loading} // Shows loading effect inside DataTable
            progressComponent={<PlaceholderLoader />} // Custom skeleton loader
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default POsModal;
