import React, { useState, useEffect } from 'react';
import { getNonce, getTables } from './../Helpers';
import ReactPaginate from 'react-paginate';
import { view, DeleteIcon, Cross } from '../icons';
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
  

  console.log(selectedLeadData);


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



  // Handle search input change

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value.toLowerCase();
  
    const filteredData = leads.filter((lead) => {
      try {
        const fields = JSON.parse(lead.fields);
  
        // Ensure that fields is an object (valid JSON)
        if (typeof fields === 'object' && fields !== null) {
          for (const key in fields) {
            if (fields[key].toLowerCase().includes(searchQuery)) {
              return true;
            }
          }
        }
      } catch (error) {
        // Handle any JSON parsing errors here
        console.error('JSON parsing error:', error);
      }
  
      return false;
    });
  
    setFilteredLeads(filteredData);
    setPageNumber(0); // Reset to the first page after search
  };
  

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
          
        },
        error(error) {
          console.error(error);
        },
      });
      
  };


    // First four th leads 

    const displayLeads = filteredLeads.length > 0 ? (
      filteredLeads
        .slice(pagesVisited, pagesVisited + leadsPerPage) // Apply pagination
        .map((lead, index) => {
          try {
            const fields = JSON.parse(lead.fields);
            const fieldKeys = Object.keys(fields);
            return (
              <tr key={index}>
                {fieldKeys.slice(0, 4).map((key) => (
                  <td key={key}>{fields[key]}</td>
                ))}
                <td className='view-td'>
                  <button
                    className="view-button"
                    onClick={() => openModal(lead.id)}
                  >
                    {view}
                  </button>
                </td>

                <td className='view-delete'>
                  <button
                    className="delete-button"
                    onClick={() => deleteLead(lead.id)}
                  >
                    {DeleteIcon}
                  </button>
                </td>
              </tr>
            );
          } catch (error) {
            console.error('JSON parsing error:', error);
            return null; 
          }
        })
    ) : (
      <tr>
        <td style={{ textAlign: 'center' }}>
        <div className="no-tables-intro-img">
          <img style={{ width: '40vh', height: '40vh' }} src={cloudImage} alt="Cloud Icon" />
        </div>
      </td>
      </tr>
    );
    
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
              <input
                type="text"
                id="search"
                placeholder="Search..."
                onChange={handleSearchChange}
              />
            </div>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {filteredLeads.length > 0 &&
                    Object.keys(JSON.parse(filteredLeads[0].fields)).slice(0, 4).map((field) => (
                      <th key={field}>{field}</th>
                    ))}
                  <th>View</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>{displayLeads}</tbody>
            </table>
            
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              pageCount={pageCount}
              onPageChange={(data) => {
                setPageNumber(data.selected);
              }}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </div>
        </div>
      )}

      {/* Modal */}
      {modalVisible && selectedLeadData && (
        <Modal onClose={closeModal}>
          {/* Render the lead details in the modal */}
          
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
