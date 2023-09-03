import React, { useState, useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { getDefaultSettings, getNonce,} from './../Helpers';

import { useParams } from 'react-router-dom';

function EditTable() {
	const [loader, setLoader] = useState<boolean>(false);
	const { id } = useParams();
	const navigate = useNavigate();
	const [tableSettings, setTableSettings] = useState({});

	const [formName, setFormName] = useState('');

	/**
	 * Get the data from DB to edit
	 */
	const getTableData = () => {
		setLoader(true);
		wp.ajax.send('simpleform_edit_table', {
			data: {
				nonce: getNonce(),
				id: id,
			},
			success(response) {
				setTableSettings({
					...response,
					id: id,
				});

				setFormName(response.form_name);

				const fbEditor = document.getElementById('build-wrap')
                const formData = response.table_settings;
				const options = {
					disableFields: ['autocomplete', 'button']
				  };
                // const formBuilders = $(fbEditor).formBuilder({ formData })

				// Check if buttonData already exists in formData
				// const buttonDataIndex = formData.findIndex((item) => item.type === 'button');

				// If buttonData exists, remove it from formData
				/* if (buttonDataIndex !== -1) {
					formData.splice(buttonDataIndex, 1);
				} */

				// Show all data 
				const formBuilders = $(fbEditor).formBuilder({ ...options, formData });

				const handleSaveDataClick = () => {
					Swal.fire({
					  text: 'Are you done!',
					  icon: 'info',
					  showCancelButton: true,
					  confirmButtonColor: '#3085d6',
					  cancelButtonColor: '#d33',
					  confirmButtonText: 'Save!',
					}).then((result) => {
					  if (result.isConfirmed) {

						const formBuilder = formBuilders; 
							if (formBuilder) {
			
							  // Check if there are any li elements inside ul
							  const ulElement = document.querySelector('.frmb');
							  const liElements = ulElement.querySelectorAll('li');
			
							  if (liElements.length === 0) {
								// Show an alert and do not submit the form
								Swal.fire({
								  text: 'Add fields to the form before saving!',
								  icon: 'warning',
								});
							  } else {
								const allData = formBuilder.actions.getData();

								// Add button on save
								/* const buttonData = {
								  type: "button",
								  subtype: "submit",
								  label: "Send",
								  className: "btn-primary btn",
								  name: "simple-form-submit",
								  access: false,
								  style: "primary",
								}; */
					  
							  // Add the button data to the existing form data
								// allData.push(buttonData);
			
								// Update the form with the new data
								formBuilder.actions.setData(allData);
			
								const formidinput = document.getElementById('formid');
								const formid = formidinput.value;
								const formNameInput = document.getElementById('formName');
								const formName = formNameInput.value;
			
								wp.ajax.send('simpleform_save_table', {
								  data: {
									nonce: getNonce(),
									id: formid,
									name: formName,
									formdata: allData,
								  },
			
								  success({ id }) {
									Swal.fire({
									  position: 'center',
									  icon: 'success',
									  title: 'Your Form has been saved',
									  showConfirmButton: false,
									  timer: 1500,
									});
			
									navigate(`/`);
								  },
								  error({ message }) {
									console.log(message)
								  },
								});
			
							  }
			
						} else {
						  console.error("Form Builder instance not found.");
						}
					  }
					});
				}

				const saveDataBtn = document.getElementById('saveData');
				saveDataBtn.addEventListener('click', handleSaveDataClick);

				setLoader(false);
			},
			error(error) {
				console.error('Error:', error); // Log any errors
			},
		});

	};

	useEffect(() => {
		getTableData();
	}, []);


	return (
		<div className="form-data-container">
        <h2>Form Create</h2>
        <label className="checkbox-wrapper">
            <span className="formsavebtn">
                <button className="js-open-modal saveData" id="saveData" type="button">Update</button>
				</span>
				<span className="formname">
				<input type="text"   value={formName} placeholder='Add form name' name='simpleformname'  className="js-open-modal" id="formName"  onChange={(e) => setFormName(e.target.value)}/>
				<input type="hidden" name="formid" id="formid" value={tableSettings.id || ''}/>
				</span>
					
			</label>
		<div id="build-wrap"></div>
		</div>
	);
}

export default EditTable;
