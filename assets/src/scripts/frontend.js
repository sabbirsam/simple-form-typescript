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
      case 'button':
      case 'color':
      case 'date':
      case 'datetime-local':
      case 'month':
      case 'password':
      case 'range':
      case 'reset':
      case 'search':
      case 'submit':
      case 'tel':
      case 'time':
      case 'url':
      case 'url':
        html += `
          <div class="text-fields">
            <label for="${field.id}">${field.label}</label>
            <input id="${field.id}" type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" class="${field.className}" value="${field.value || ''}"${fieldAttributes}>
          </div>
        `;
        break;
  
      case 'image':
        html += `
        <div class="text-fields">
          <label for="${field.id}">${field.label}</label>
          <input id="${field.id}" type="${field.type}" src="${field.src}" alt="${field.alt}" width="${field.width}" height="${field.height || ''}">
        </div>
        `;
        break;
      case 'hidden':
        html += `
            <input id="${field.id}" type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" class="${field.className}" value="${field.value || ''}"${fieldAttributes}>
        `;
        break;

      case 'textarea':
        html += `
            <div class="text-fields">
              <label for="${field.id}">${field.label}</label>
              <textarea type="${field.type}" placeholder="${field.placeholder}" class="${field.className}" ${fieldAttributes} id="${field.id}" name="${field.name}" data-unique-id="${field.uniqueId}" subtype="type="${field.type}"></textarea>
            </div>
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
        `;
        break;

      case 'file':
        html += `
          <div class="text-fields">
            <label for="${field.id}">${field.label}</label>
            <input id="${field.id}" type="${field.type}" name="${field.name}" class="${field.className}"${fieldAttributes}>
          </div>
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

    // Create a div for displaying error messages
    var errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'red';
    formContainer.appendChild(errorDiv);
    

    submitButton.addEventListener('click', function (event) {

      // Prevent the default form submission behavior
      event.preventDefault();

      // Get all form elements within the form
      var formElements = formContainer.querySelectorAll('input, select, textarea');

      // Create an object to store the form data
      var formDataObject = {};

      // Create a flag to track if there are any required fields that are empty
      var hasEmptyRequiredFields = false;
      var errorMessage = '';

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

        // Add email validation
        if (element.type === 'email' && !isValidEmail(element.value)) {
          // Add a red border to indicate an invalid email
          element.style.border = '1px solid red';
          errorMessage = 'Email is not correct.';
          hasEmptyRequiredFields = true;
        }

        if (element.type === 'text' && !isValidEmail(element.value)) {
          // Add a red border to indicate an invalid email
          element.style.border = '1px solid red';
          errorMessage = 'Please fill out all required fields.';
          hasEmptyRequiredFields = true;
        }

        // Add number validation
        if (element.type === 'number' && !isValidNumber(element.value)) {
          // Add a red border to indicate an invalid number
          element.style.border = '1px solid red';
          errorMessage = 'Please use the correct format.';
          hasEmptyRequiredFields = true;
        }
        
      });

      // If there are empty required fields, prevent form submission
      if (hasEmptyRequiredFields || errorMessage) {
        // alert('Please fill out all required fields.');
        errorDiv.textContent = errorMessage || 'Please fill out all required fields.';
        return;
      }else{
         // Clear the error message if there are no errors
        errorDiv.textContent = '';
      }


      // Add the nonce and formId to the formDataObject
      // formDataObject['nonce'] = nonce;
      // formDataObject['id'] = formId;

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


              /**
               * WhatsApp redirection
               */
              const scf_json = getCookie("simple_form_whatsapp_data");
              if(scf_json){
                const scf_opt = JSON.parse(scf_json);
              
                  if (scf_opt && scf_opt.simple_form_whatsapp_number) {
                    const newTab = scf_opt.simple_form_new_tab === "true";
                    const target = newTab ? "_blank" : "_self";
                    const number = scf_opt.simple_form_whatsapp_number;
                    
                    // Convert the simple_form_whatsapp_data object to a formatted string
                    const text = Object.keys(scf_opt.simple_form_whatsapp_data)
                      .map(key => `${key}: ${scf_opt.simple_form_whatsapp_data[key]}`)
                      .join("\n");

                    const mobileurl = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
                    const weburl = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(text)}`;

                    const url = window.innerWidth > 1024 ? weburl : mobileurl;
                    window.open(url, target);

                    eraseCookie("simple_form_whatsapp_data");
                  }
                  // END 
              }
              
              // Show a success message using SweetAlert
              let timerInterval
              Swal.fire({
                title: 'Thanks for your submission',
                html: 'We will contact you soon <br> Have a nice day.',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading()
                  const b = Swal.getHtmlContainer().querySelector('b')
                  timerInterval = setInterval(() => {
                  }, 100)
                },
                willClose: () => {
                  clearInterval(timerInterval)
                }
              })
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


// Helper function to validate email
function isValidEmail(email) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Helper function to validate number
function isValidNumber(number) {
  var numberPattern = /^\d+$/;
  return numberPattern.test(number);
}


function setCookie(name, value, days) {
  let expires = "";

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

function getCookie(name) {
  const cookieStr = decodeURIComponent(document.cookie);
  const cookies = cookieStr.split("; ");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];

    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return "";
}

function eraseCookie(name) {
  setCookie(name, "", -1);
}

// END ---------------------------------------------------


// Floating form
window.addEventListener('load', function () {
  // Get references to the WhatsApp icon and the form content
  const whatsappIcon = document.querySelector('.whatsapp-icon');
  const formContent = document.querySelector('.form-content');

  // Toggle the "active" class and adjust the height of the form content when the icon is clicked
  if(whatsappIcon){
    whatsappIcon.addEventListener('click', function () {
      formContent.classList.toggle('active');
      adjustFormHeight(formContent);
    });
  }
  

  function adjustFormHeight(element) {
    const isActive = element.classList.contains('active');
    if (isActive) {
      // Calculate the full height of the form content
      element.style.height = element.scrollHeight + 'px';
    } else {
      // Set the height back to 0 for collapsing effect
      element.style.height = '0';
    }
  }
});

// Function to restart the animation
function restartAnimation() {
  const whatsappIcon = document.getElementById('jumping-whatsapp');
  if(whatsappIcon){
    whatsappIcon.style.animation = 'none';
    // Trigger reflow
    void whatsappIcon.offsetWidth; 
    // Set animation duration to 5 seconds
    whatsappIcon.style.animation = 'jumpAnimation 0.9s ease-in-out'; 
  }
 
}

// Initially, trigger the animation 4-5 times with a delay
let initialAnimationCount = 0;
// Random value between 4 and 5
const maxInitialAnimationCount = Math.floor(Math.random() * 2) + 1; 

function initialAnimations() {
  if (initialAnimationCount < maxInitialAnimationCount) {
    restartAnimation();
    initialAnimationCount++;
    setTimeout(initialAnimations, 200); // Adjust the delay as needed
  }
}

// Start initial animations
initialAnimations();

// After the initial animations, continue with the 10-second animation cycle
setInterval(restartAnimation, 3000); // Restart every

// END 



