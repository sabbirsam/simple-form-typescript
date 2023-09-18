/**
 * 
 * @param {*} formData 
 * @returns 
 */

function generateRenderedForm(formData) {
  

  let html = '';

  formData.forEach((field) => {
    let fieldAttributes = '';

    if (field.required === 'true') {
      fieldAttributes += ' required';
    }

    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'hidden':
        html += `
          <div class="text-fields">
            <label for="${field.id}">${field.label}</label>
            <input id="${field.id}" type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" class="${field.className}" value="${field.value || ''}"${fieldAttributes}>
          </div>
          <br>
        `;
        break;

      case 'select':
        html += `
          <div class="text-fields">
            <label for="${field.id}">${field.label}</label>
            <select id="${field.id}" name="${field.name}"${fieldAttributes}>`;
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
            <input id="${field.id}" type="${field.type}" name="${field.name}" class="${field.className}"${fieldAttributes}>
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
                <input type="checkbox" id="${field.id}" name="${field.name}" class="switch-input ${field.className}"${fieldAttributes}>
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
                <input type="checkbox" id="${option.value}" name="${field.name}" value="${option.value}"${fieldAttributes}>
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
                ${fieldAttributes}
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

      // Get all form elements within the form
      var formElements = formContainer.querySelectorAll('input, select, textarea');

      // Create an object to store the form data
      var formDataObject = {};

      // Create a flag to track if there are any required fields that are empty
      var hasEmptyRequiredFields = false;

      formElements.forEach(function (element) {
        // Check if the element has the "simple-form-checkbox-toggle" class
        var isToggleCheckbox = element.closest('.simple-form-checkbox-toggle') !== null;

        // Handle checkboxes with the "simple-form-checkbox-toggle" class
        if (isToggleCheckbox && element.type === 'checkbox') {
          formDataObject[element.name] = element.checked ? 'on' : 'off';
        } else {
          formDataObject[element.name] = element.value;
        }

        // Check if the field is required and empty
        if (element.hasAttribute('required') && formDataObject[element.name].trim() === '') {
          // Add a red border to indicate the required field is empty
          element.style.border = '1px solid red';
          hasEmptyRequiredFields = true;
        } else {
          // Remove any red border if the field is not empty
          element.style.border = '';
        }
      });

      // If there are empty required fields, prevent form submission
      if (hasEmptyRequiredFields) {
        alert('Please fill out all required fields.');
        return;
      }

      // Add the nonce and formId to the formDataObject
      // formDataObject['nonce'] = nonce;
      formDataObject['id'] = formId;

      // Create an AJAX request for the form submission
      var xhr = new XMLHttpRequest();
      xhr.open('POST', front_end_data.admin_ajax, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

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