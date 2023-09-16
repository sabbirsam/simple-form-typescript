/**
 * 
 * @param {*} formData 
 * @returns 
 */


function generateRenderedForm(formData) {
  let html = '';

  formData.forEach((field) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'hidden':
        html += `
          <div class="text-fields">
            <label for="${field.id}">${field.label}</label>
            <input id="${field.id}" type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" class="${field.className}" value="${field.value || ''}">
          </div>
          <br>
        `;
        break;

      case 'select':
        html += `
          <div class="text-fields">
            <label for="${field.id}">${field.label}</label>
            <select id="${field.id}" name="${field.name}">`;
        field.options.forEach((option) => {
          html += `
            <option value="${option.value}" ${field.value === option.value ? 'selected' : ''}>${option.label}</option>
          `;
        });
        html += `
            </select>
          </div>
          <br>
        `;
        break;

      case 'file':
        html += `
          <div class="text-fields">
            <label for="${field.id}">${field.label}</label>
            <input id="${field.id}" type="${field.type}" name="${field.name}" class="${field.className}">
          </div>
          <br>
        `;
        break;

      case 'checkbox':
        if (field.toggle === 'true') {
          // Render the toggle checkbox
          html += `
            <div class="simple-form-checkbox-toggle">
              <label class="switch-label">${field.label}
                <input type="checkbox" id="${field.id}" name="${field.name}" class="switch-input ${field.className}" required="">
                <span class="slider round"></span>
              </label>
            </div>`;
        } else {
          // Render the default checkboxes
          html += `
          <div class="text-fields">
            <label>${field.label}</label>`;
          field.options.forEach((option) => {
            html += `
              <div class="text-fields-insider">
                <input type="checkbox" id="${option.value}" name="${field.name}" value="${option.value}">
                <label for="${option.value}">${option.label}</label>
              </div>`;
          });
          html += `
            </div>`;
        }
        break;
    
      case 'radio':
        html += `
          <div class="text-fields">
            <label>${field.label}</label>`;
        field.options.forEach((option) => {
          html += `
            <div class="text-fields-insider">
              <input
                type="radio"
                id="${option.value}"
                name="${field.name}"
                value="${option.value}"
                ${field.value === option.value ? 'checked' : ''}
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


/**
 * Load Form 
 */
document.addEventListener('DOMContentLoaded', function () {
    var formContainers = document.querySelectorAll('.simple_form_container');
  
    formContainers.forEach(function (container) {
      var formId = container.getAttribute('data-form-id');
      var nonce = container.getAttribute('data-nonce');
      // Get the unique markup identifier associated with this shortcode
      var markupId = container.querySelector('.simple_form_loader').id;
  
      fetch(front_end_data.admin_ajax + '?action=simpleform_table_html&nonce=' + nonce + '&id=' + formId)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(function (data) {
          const code = document.getElementById(markupId);
          const formData = data.data.table_settings;
          const renderedFormHTML = generateRenderedForm(formData);
          code.innerHTML = renderedFormHTML;
        })
        .catch(function (error) {
          // Handle the error for this form
          console.error('Form', formId, 'Error:', error);
        });
    });
  });
  


/**
 * Submit Form
 */

window.addEventListener('load', function () {
  var formContainers = document.querySelectorAll('.simple_form_container');

  formContainers.forEach(function (formContainer) {
    var formId = formContainer.dataset.formId;
    var nonce = formContainer.dataset.nonce;

    // Find the submit button within the current form container
    var submitButton = formContainer.querySelector('.submit-button');

    submitButton.addEventListener('click', function (event) {
      
      // Prevent the default form submission behavior
      event.preventDefault();

      // Serialize the form data
      var formData = new FormData(formContainer.querySelector('.simple_form'));

      // Check if form data is empty
      if (formData.entries().next().done) {
        alert("Form data is empty. Please fill out the form.");
        return; // Don't proceed with the AJAX request
      }

      // Create an AJAX request for the form submission
      var xhr = new XMLHttpRequest();
      xhr.open('POST', front_end_data.admin_ajax, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      var formDataArray = Array.from(formData.entries()); // Used to send in Ajax
      var formDataObject = Object.fromEntries(formDataArray); 

      var data = "action=simpleform_get_submit_data" + "&nonce=" + encodeURIComponent(nonce) + "&id=" + encodeURIComponent(formId) + "&form_data=" + JSON.stringify(formDataObject);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var responseData = JSON.parse(xhr.responseText);

            console.log('Response:', responseData);
            if (responseData.success) {
              // Clear the form fields
              var form = formContainer.querySelector('.simple_form');
              form.reset();
              
              // Show a success message using SweetAlert
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: responseData.message,
              });
            }

          } else {
            // Handle the error for this form
            console.error('Form', formId, 'Error:', xhr.statusText);
          }
        }
      };

      xhr.send(data);
    });
  });
});