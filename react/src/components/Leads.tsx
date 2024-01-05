import React, { useState, useEffect, useRef } from 'react';
import { getNonce, getTables } from './../Helpers';
import CircularProgress from '@mui/material/CircularProgress';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { DataGrid } from '@mui/x-data-grid';
import Card from '../core/Card';
import Modal from '../core/Modal';
import { v4 as uuidv4 } from 'uuid';
import '../styles/_lead.scss';

const Leads = () => {
  const confirmDeleteRef = useRef();
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [tables, setTables] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteID] = useState();


  const openModal = (leadId, event) => {
    event.stopPropagation();
    const selectedLead = leads.find((lead) => lead.id === leadId);
    if (selectedLead) {
      setSelectedLeadData(selectedLead);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  /**
   * Delete Modal close
  */
  const handleClosePopup = () => {
    setDeleteModal(false);
  };

  /**
   * Delete Modal
  */
  const handleDeleteTable = (id, event) => {
    event.stopPropagation();
    setDeleteID(id);
    setDeleteModal(true);
  };


  useEffect(() => {
    setLoader(true);
    wp.ajax.send('simpleform_get_tables', {
      data: {
        nonce: getNonce(),
      },
      success(response) {
        const tableData = response.tables;
        setTables(tableData);
        setSelectedId(tableData.length > 0 ? tableData[0].id : null);
        setLoader(false);
      },
      error(error) {
        console.error(error);
      },
    });
  }, []);

  const deleteLead = (id) => {
    wp.ajax.send('simpleform_delete_leads', {
      data: {
        nonce: getNonce(),
        id,
      },
      success() {
        console.log("success")
        setDeleteModal(false);
        const updatedLeads = leads.filter((lead) => lead.id !== id);
        setLeads(updatedLeads);
        setFilteredLeads(updatedLeads);

        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Lead has been deleted'
        })

      },
      error(error) {
        console.error(error);
      },
    });

  };

  useEffect(() => {
    if (selectedId !== null) {
      setLeads([]);
      wp.ajax.send('simpleform_get_leads', {
        data: {
          nonce: getNonce(),
          form_id: selectedId,
        },
        success(response) {
          setLeads(response.tables);
        },
        error(error) {
          console.error('Error:', error);
        },
      });
    }
  }, [selectedId]);

  function handleCancelOutside(event: MouseEvent) {
    if (
      confirmDeleteRef.current &&
      !confirmDeleteRef.current.contains(event.target)
    ) {
      handleClosePopup();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleCancelOutside);
    return () => {
      document.removeEventListener('mousedown', handleCancelOutside);
    };
  }, [handleCancelOutside]);



  // To display the first 3 columns
  const columns = leads.length > 0 && leads[0]?.fields
    ? Object.keys(JSON.parse(leads[0].fields)).slice(0, 3).map((field) => ({
      field,
      headerName: field,
      flex: 1,
    }))
    : [];

  const rows = leads.map((lead) => {
    const leadFields = JSON.parse(lead.fields);
    return {
      id: lead.id,
      ...Object.fromEntries(Object.entries(leadFields).slice(0, 3)), // Keep only the first 3 columns
      actions: lead.id,
    };
  });

  // Define the actions column
  const actionsColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: (params) => (
      <div className='action-button'>
        <button
          className="view-button"
          onClick={(event) => openModal(params.value, event)}
        >
          <PreviewIcon className='sf-view-form' />
        </button>
        <button
          className="delete-button"
          // onClick={(event) => deleteLead(params.value, event)}
          onClick={(event) => handleDeleteTable(params.value, event)}
        >
          {/* {DeleteIcon} */}
          <DeleteOutlineIcon className='leads-delete' />
        </button>
      </div>
    ),
  };

  // Add the actions column to the columns array
  columns.push(actionsColumn);

  return (
    <>
      {loader ? (
        <Card>
          <CircularProgress />
        </Card>
      ) : (
        <div className='main-leads-container'>
          <h3 className="review-case-title">Simple form leads<a href="#" target="_blank"></a>
          </h3>

          <div className='leads-container'>
            <div className='search-select-panel'>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">Please choose one</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.form_name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
            </div>
          </div>
        </div>
      )}

      {/* USING DataGrid  */}
      {modalVisible && selectedLeadData && (
        <Modal onClose={closeModal}>
          <div className='details-leads'>
            <h2 className="leads-title"><DisplaySettingsIcon /> Lead Details</h2>
            <div style={{ height: 400, width: '100%' }} className="datagrid-container">
              <DataGrid
                rows={Object.entries(JSON.parse(selectedLeadData.fields)).map(([key, value]) => ({
                  id: key,
                  field: key,
                  value,
                }))}
                columns={[
                  { field: 'field', headerName: 'Field', flex: 1 },
                  { field: 'value', headerName: 'Value', flex: 1 },
                ]}
                pageSize={Object.keys(JSON.parse(selectedLeadData.fields)).length}
                // hideFooterPagination
                checkboxSelection
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete modal  */}
      {deleteModal && (
        <Modal>
          <div
            className="delete-table-modal-wrap modal-content"
            ref={confirmDeleteRef}
          >
            <div
              className="cross_sign"
              onClick={() => handleClosePopup()}
            >
              {/* {Cross} */}
              <HighlightOffIcon className='scf-delete-btn' />
            </div>
            <div className="delete-table-modal">
              <div className="modal-media"><DeleteOutlineIcon fontSize='large' htmlColor='secondary' className='scf-form-delete' /></div>
              <h2>Are you sure to delete the leads? </h2>
              <div className="action-buttons">
                <button
                  className="simpleform-button cancel-button"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
                <button
                  className="simpleform-button confirm-button"
                  onClick={() =>
                    deleteLead(deleteId)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}


    </>
  );
};

export default Leads;
