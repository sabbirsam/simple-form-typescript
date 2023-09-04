
// Function to generate HTML for the rendered form
/**
 * Load Form 
 */
jQuery(window).on('load', function () {
    var formContainers = jQuery('.simple_form_container');
  
    formContainers.each(function () {
        var formId = jQuery(this).data('form-id');
        var nonce = jQuery(this).data('nonce');
        
        // Get the unique markup identifier associated with this shortcode
        var markupId = jQuery(this).find(".simple_form_loader").attr("id");
  
        jQuery.ajax({
            url: front_end_data.admin_ajax,
            method: 'GET',
            data: {
                action: 'simpleform_table_html',
                nonce: nonce,
                id: formId
            },
            success: function (response) {
                // Use the specific markup element for this shortcode
                const code = jQuery("#" + markupId)[0];
                const formData = response.data.table_settings;
                const addLineBreaks = html => html.replace(new RegExp("><", "g"), ">\n<");
  
                // Grab markup and escape it
                const $markup = jQuery("<div/>");
                $markup.formRender({ formData });
  
                // Set the inner HTML with escaped markup
                code.innerHTML = addLineBreaks($markup.formRender("html"));
            },
            error: function (error) {
                // Handle the error for this form
                console.error('Form', formId, 'Error:', error);
            }
        });
    });
  });
  
  
  /**
   * Submit Form nice one
   */
  
  jQuery(window).on('load', function () {
    var formContainers = jQuery('.simple_form_container');
  
    formContainers.each(function () {
        var formContainer = jQuery(this);
        var formId = formContainer.data('form-id');
        var nonce = formContainer.data('nonce');
  
        // Get the unique markup identifier associated with this shortcode
        var markupId = formContainer.find(".simple_form_loader").attr("id");
  
        // Find the submit button within the current form container
        var submitButton = formContainer.find('.submit-button');
  
        submitButton.on('click', function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();
  
            // Serialize the form data
            var formData = formContainer.find('.simple_form').serialize();
  
            // Check if form data is empty
            if (formData === "") {
                alert("Form data is empty. Please fill out the form.");
                return; // Don't proceed with the AJAX request
            }
  
            // Create an AJAX request for the form submission
            jQuery.ajax({
                url: front_end_data.admin_ajax,
                method: 'POST', // Change to POST for form submission
                data: {
                    action: 'simpleform_get_submit_data', // Adjust the action accordingly
                    nonce: nonce,
                    id: formId,
                    form_data: formData, // Include the serialized form data
                },
                success: function (response) {
                    var responseData = response.data;
  
                    // Split the form data into key-value pairs
                    var formDataArray = formData.split('&');
                    var formDataObject = {};
  
                    formDataArray.forEach(function (item) {
                        var pair = item.split('=');
                        var key = decodeURIComponent(pair[0]);
                        var value = decodeURIComponent(pair[1]);
                        formDataObject[key] = value;
                    });
  
                    console.log('Formatted Form Data:', formDataObject);
  
                    // Handle the response data as needed
                },
                error: function (error) {
                    // Handle the error for this form
                    console.error('Form', formId, 'Error:', error);
                }
            });
        });
    });
  });


//   Custom render for my form builder ------------------------

  document.addEventListener('DOMContentLoaded', function () {
    function generateRenderedForm(formData) {
        let html = '<h2>Rendered Form</h2>';
      
        formData.forEach((field) => {
          switch (field.type) {
            case 'text':
            case 'number':
            case 'email':
            case 'hidden':
              html += `
                <div>
                  <label>${field.label}</label>
                  <input type="${field.type}" placeholder="${field.placeholder}" class="${field.className}">
                </div>
              `;
              break;
      
            case 'select':
              html += `
                <div>
                  <label>${field.label}</label>
                  <select>`;
              field.options.forEach((option) => {
                html += `
                  <option value="${option.value}">${option.label}</option>
                `;
              });
              html += `
                  </select>
                </div>
              `;
              break;
      
            case 'file':
              html += `
                <div>
                  <label>${field.label}</label>
                  <input type="file">
                </div>
              `;
              break;
      
            case 'checkbox':
              if (field.toggle) {
                html += `
                  <div>`;
                field.options.forEach((option) => {
                  html += `
                    <label class="switch-label">${option.label}
                      <input type="checkbox" id="${option.value}" name="${field.id}" value="${option.value}">
                      <span class="slider round"></span>
                    </label>`;
                });
                html += `
                  </div>`;
              } else {
                html += `
                  <div>`;
                field.options.forEach((option) => {
                  html += `
                    <div>
                      <input type="checkbox" id="${option.value}" name="${field.id}" value="${option.value}">
                      <label for="${option.value}">${option.label}</label>
                    </div>`;
                });
                html += `
                  </div>`;
              }
              break;
      
            case 'radio':
              html += `
                <div>
                  <label>${field.label}</label>`;
              field.options.forEach((option) => {
                html += `
                  <div>
                    <input
                      type="radio"
                      id="${option.value}"
                      name="${field.id}"
                      value="${option.value}"
                    />
                    <label for="${option.value}">${option.label}</label>
                  </div>`;
              });
              html += `
                </div>`;
              break;
      
            default:
              break;
          }
        });
      
        return html;
      }
      
      const formData = [
        {
          id: 'text-input',
          label: 'Text Input',
          type: 'text',
          placeholder: 'Enter text...',
          className: 'custom-input',
          uniqueId: 'field-1',
        },
        {
          id: 'select-input',
          label: 'Select',
          type: 'select',
          options: [
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 2', value: 'Option 2' },
          ],
          uniqueId: 'field-2',
        },
        {
          id: 'file-input',
          label: 'File Upload',
          type: 'file',
          uniqueId: 'field-3',
        },
        {
          id: 'checkbox-input',
          label: 'Checkbox',
          type: 'checkbox',
          toggle: true, 
          options: [
            { label: 'Option 1', value: 'Option 1' },
            { label: 'Option 2', value: 'Option 2' },
          ],
          uniqueId: 'field-4',
        },
        {
          id: 'radio-input',
          label: 'Radio',
          type: 'radio',
          options: [
            { label: 'Option A', value: 'Option A' },
            { label: 'Option B', value: 'Option B' },
          ],
          uniqueId: 'field-5',
        },
      ];


        // Generate the rendered form HTML
        const renderedFormHTML = generateRenderedForm(formData);
        
        // Output the HTML to the console (you can use it as needed)
        console.log(renderedFormHTML);


        //   Render 
        const formContainer = document.getElementById('test123');
        formContainer.innerHTML = renderedFormHTML;

  });  