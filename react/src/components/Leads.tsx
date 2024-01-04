import React, { useState, useEffect } from 'react';
import { getNonce, getTables } from './../Helpers';
import ReactPaginate from 'react-paginate';
import { view, DeleteIcon, Cross } from '../icons';
import { DataGrid } from '@mui/x-data-grid';
import '../styles/_lead.scss';
import Card from '../core/Card';
import Modal from '../core/Modal';
import { VerticalAlignBottom } from '@mui/icons-material';
const cloudImage = require('../../../assets/public/icons/No-leads.gif');


const Leads = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [tables, setTables] = useState([]);

  const leadsPerPage = 10;
  const pagesVisited = pageNumber * leadsPerPage;
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState(null);

  // console.log(tables)
  // console.log(filteredLeads)


  const openModal = (leadId) => {
    // Find the selected lead data based on leadId
    const selectedLead = filteredLeads.find((lead) => lead.id === leadId);
    if (selectedLead) {
      setSelectedLeadData(selectedLead);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };


  /**
   * Get full form list
   */
  useEffect(() => {
    setLoader(true);
    // Fetch the tables data
    wp.ajax.send('simpleform_get_tables', {
      data: {
        nonce: getNonce(),
      },
      success(response) {
        const tableData = response.tables;
        setTables(tableData);

        // Set the initially selected ID to the ID of the first form
        if (tableData.length > 0) {
          setSelectedId(tableData[0].id);
        }
        setLoader(false);
      },
      error(error) {
        console.error(error);
      },
    });
  }, []);

  /**
    * Get form list by selected ID
  */
  useEffect(() => {
    if (selectedId !== null) {
      setLeads([]); // Clear the previous leads
      setFilteredLeads([]); // Clear the previous filtered leads

      // Fetch the leads data based on the selected form_id
      const getTableData = () => {
        wp.ajax.send('simpleform_get_leads', {
          data: {
            nonce: getNonce(),
            form_id: selectedId,
          },
          success(response) {
            setLeads(response.tables);
            setFilteredLeads(response.tables);
          },
          error(error) {
            console.error('Error:', error);
          },
        });
      };
      getTableData();
    }
  }, [selectedId]);


  // Function to delete a lead by ID
  const deleteLead = (id) => {
    console.log(id)

    wp.ajax.send('simpleform_delete_leads', {
      data: {
        nonce: getNonce(),
        id,
      },
      success() {
        console.log("success")
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



  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    }
  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

  // Test 

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
};

export default Leads;
