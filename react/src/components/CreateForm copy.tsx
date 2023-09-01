import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';


const CreateForm = () => {
    /* useEffect(() => {
        const fbTemplate = document.getElementById('build-wrap');
        $(fbTemplate).formBuilder();
      }, []); */

  const fbPagesRef = useRef(null);
  const fbInstancesRef = useRef([]);
  const [tabCount, setTabCount] = useState(0);

  useEffect(() => {
    // Initialize the tabs
    fbPagesRef.current = $(document.getElementById('form-builder-pages')).tabs({
      beforeActivate: function (event, ui) {
        if (ui.newPanel.selector === '#new-page') {
          return false;
        }
      },
    });

    // Initialize the "Add Page" button click event
    const addPageTab = document.getElementById('add-page-tab');
    addPageTab.addEventListener('click', handleAddPageClick);

    // Initialize the "Save Data" button click event
    const saveDataBtn = document.getElementById('saveData');
    saveDataBtn.addEventListener('click', handleSaveDataClick);

    // Clean up event listeners when the component unmounts
    return () => {
      addPageTab.removeEventListener('click', handleAddPageClick);
      saveDataBtn.removeEventListener('click', handleSaveDataClick);
    };
  }, []);

  const handleAddPageClick = () => {
    const tabId = `page-${tabCount}`;
    const newPageTemplate = document.getElementById('new-page');
    const newTabTemplate = document.getElementById('add-page-tab');
    const newPage = newPageTemplate.cloneNode(true);
    newPage.setAttribute('id', tabId);
    newPage.classList.add('fb-editor');
    const newTab = newTabTemplate.cloneNode(true);
    newTab.removeAttribute('id');
    const tabLink = newTab.querySelector('a');
    tabLink.setAttribute('href', `#${tabId}`);
    tabLink.innerText = `Page ${tabCount}`;

    newPageTemplate.parentElement.insertBefore(newPage, newPageTemplate);
    newTabTemplate.parentElement.insertBefore(newTab, newTabTemplate);
    fbPagesRef.current.tabs('refresh');
    fbPagesRef.current.tabs('option', 'active', tabCount - 1);
    fbInstancesRef.current.push($(newPage).formBuilder());

    setTabCount(tabCount + 1);
  };

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
        const allData = fbInstancesRef.current.map((fb) => {
          const result = fb.actions.getData();
          return result;
        });
        const data = {
          result: allData,
          action: 'simple_message_form_submission',
          form_field: $('#form_name').val(),
        };
        $.ajax({
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
        });
      }
    });
}


  return (
    <div>
        <div className="qbf_tabs">
            <div className="tab-content">
                <div id="sectionB" className="tab-pane fade">
                    <div className="checkbox">
                        <label className="checkbox-wrapper">
                            <span className="">
                                <button className="js-open-modal saveData" id="saveData" type="button">Save</button>
                            </span>
                        </label>
                    </div>
                    <h2>Build template</h2>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="saveDataWrap create_field_save_btn">
                                <input id="form_name" className="form-name" name="form_name" placeholder="Form name" type="text" />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <form action="" id="form-builder-pages" data-url="<?php echo admin_url('admin-ajax.php')?> ">
                        <ul id="tabs">
                            <li><a href="#page-1">Page 1</a></li>
                            <li id="add-page-tab"><a href="#new-page">+ Page</a></li>
                        </ul>
                        <div id="page-1" className="fb-editor"></div>
                        <div id="new-page"></div>
                    </form>
                </div>
            </div>
        </div>
        <div id="overlay"></div>
    </div>
  )
}

export default CreateForm
