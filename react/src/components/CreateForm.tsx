import React, { useEffect , useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

import { getDefaultSettings, getNonce,} from './../Helpers';

import '../styles/_createForm.scss';

const CreateForm = () => {
    const navigate = useNavigate();
    const formBuilderRef = useRef(null);

    var options = {
      disableFields: ['autocomplete', 'button']
    };


    useEffect(() => {
        const saveDataBtn = document.getElementById('saveData');
        saveDataBtn.addEventListener('click', handleSaveDataClick);
    
        const fbEditor = document.getElementById('build-wrap');
        formBuilderRef.current = $(fbEditor).formBuilder(options);
    
        return () => {
          // Cleanup event listener
          saveDataBtn.removeEventListener('click', handleSaveDataClick);
        };
      }, []);

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
            // Access the formBuilder instance
            const formBuilder = formBuilderRef.current; 
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

                    const formNameInput = document.getElementById('formName');
                    const formName = formNameInput.value;

                    wp.ajax.send('simpleform_create_form', {
                      data: {
                        nonce: getNonce(),
                        name: formName,
                        formdata: allData,
                      },

                      success({ id }) {
                        console.log(allData);
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
                      },
                    });

                  }

            } else {
              console.error("Form Builder instance not found.");
            }
          }
        });

    }

  return (
    <div className="form-data-container">
        <h2>Form Create</h2>
        <label className="checkbox-wrapper">
            <span className="formname">
              <input type="text" placeholder='Add form name' name='simpleformname'  className="js-open-modal" id="formName"/>
            </span>
            <span className="formsavebtn">
                <button className="js-open-modal saveData" id="saveData" type="button">Save</button>
            </span>
             
        </label>
      <div id="build-wrap"></div>
    </div>
  )
}

export default CreateForm
