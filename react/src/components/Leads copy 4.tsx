import React, { useState, useEffect } from 'react';
import { getNonce, getTables } from './../Helpers';
import { DataGrid } from '@mui/x-data-grid';
import Card from '../core/Card';
import Modal from '../core/Modal';
const cloudImage = require('../../../assets/public/icons/No-leads.gif');

const Leads = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [tables, setTables] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState(null);

  const openModal = (leadId) => {
    const selectedLead = leads.find((lead) => lead.id === leadId);
    if (selectedLead) {
      setSelectedLeadData(selectedLead);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
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

  const columns = leads.length > 0 && leads[0]?.fields
    ? Object.keys(JSON.parse(leads[0].fields)).map((field) => ({
      field,
      headerName: field,
      flex: 1,
    }))
    : [];

  const rows = leads.map((lead) => ({
    id: lead.id,
    ...JSON.parse(lead.fields),
  }));

  return (
    <>
      {loader ? (
        <Card>
          <h1>Loading...</h1>
        </Card>
      ) : (
        <div className='main-leads-container'>
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
                onRowClick={(params) => openModal(params.data.id)}
              />
            </div>
          </div>
        </div>
      )}

      {modalVisible && selectedLeadData && (
        <Modal onClose={closeModal}>
          <div className='details-leads'>
            <table className="rwd-table">
              <h2 className="leads-title">Lead Details</h2>
              <tbody>
                {Object.entries(JSON.parse(selectedLeadData.fields)).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td><td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Leads;
