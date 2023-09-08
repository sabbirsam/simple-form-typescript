import React, { useState, useEffect } from 'react';
import { getNonce, getTables } from './../Helpers';
import ReactPaginate from 'react-paginate';
import { EditIcon, DeleteIcon, Cross } from '../icons';
import '../styles/_lead.scss';
import Card from '../core/Card';


const Leads = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [tables, setTables] = useState([]);

  const leadsPerPage = 5;
  const pagesVisited = pageNumber * leadsPerPage;
  const pageCount = Math.ceil(filteredLeads.length / leadsPerPage);



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
      const fields = JSON.parse(lead.fields);
      for (const key in fields) {
        if (fields[key].toLowerCase().includes(searchQuery)) {
          return true;
        }
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

  const displayLeads = filteredLeads
    .slice(pagesVisited, pagesVisited + leadsPerPage)
    .map((lead, index) => (
      <tr key={index}>
        {Object.values(JSON.parse(lead.fields)).map((value, subIndex) => (
          <td key={subIndex}>{value}</td>
        ))}
        <td>
            <button className='delete-button' onClick={() => deleteLead(lead.id)}>
              {DeleteIcon}
            </button>
        </td>
      </tr>
    ));
    

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
                  {leads.length > 0 &&
                    Object.keys(JSON.parse(leads[0].fields)).map((field) => (
                      <th key={field}>{field}</th>
                    ))}
                  <th>Action</th>
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
    </>
  );
};

export default Leads;
