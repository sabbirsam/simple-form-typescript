import React, { useEffect , useRef } from 'react';
import $ from 'jquery';


const CreateForm = () => {
    const formBuilderRef = useRef(null);

    useEffect(() => {
        const saveDataBtn = document.getElementById('saveData');
        saveDataBtn.addEventListener('click', handleSaveDataClick);
    
        const fbEditor = document.getElementById('build-wrap');
        formBuilderRef.current = $(fbEditor).formBuilder();
    
        return () => {
          // Cleanup event listener
          saveDataBtn.removeEventListener('click', handleSaveDataClick);
        };
      }, []);


      const handleSaveDataClick = () => {
        Swal.fire({
          text: 'Please confirm below!',
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
                const allData = formBuilder.actions.getData();

                const data = {
                    result: allData,
                    action: 'simple_message_form_submission',
                    // form_field: $('#form_name').val(),
                };
                console.log(data);

                /* $.ajax({
                    url: simple_message_form_submission.ajaxurl,
                    // url: qbf.ajaxurl,
                    data: data,
                    type: 'post',
                    success: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Your Form has been saved',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    location.href = 'admin.php?page=form_data';
                    },
                }); */

            } else {
              console.error("Form Builder instance not found.");
            }
          }
        });

    }

  return (
    <div>
        <h2>Form Create</h2>
        <label className="checkbox-wrapper">
            <span className="">
                <button className="js-open-modal saveData" id="saveData" type="button">Save</button>
            </span>
        </label>
      <div id="build-wrap"></div>
    </div>
  )
}

export default CreateForm
