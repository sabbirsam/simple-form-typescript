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


// Trying to fix here 

// jQuery(window).on('load', function () {
//   var formContainers = jQuery('.simple_form_container');

//   formContainers.each(function () {
//       var formContainer = jQuery(this);
//       var formId = formContainer.data('form-id');
//       var nonce = formContainer.data('nonce');

//       // Get the unique markup identifier associated with this shortcode
//       var markupId = formContainer.find(".simple_form_loader").attr("id");

//       // Find the submit button within the current form container
//       var submitButton = formContainer.find('.submit-button');

//       submitButton.on('click', function (event) {
//           // Prevent the default form submission behavior
//           event.preventDefault();

//           // Serialize the form data
//           var formData = formContainer.find('.simple_form').serialize();

//           // Check if form data is empty
//           if (formData === "") {
//               alert("Form data is empty. Please fill out the form.");
//               return; // Don't proceed with the AJAX request
//           }

//             // URL-encode the form data - no use but test later
//             // formData = encodeURIComponent(formData);

//           // Create an AJAX request for the form submission
//           jQuery.ajax({
//               url: front_end_data.admin_ajax,
//               method: 'POST', // Change to POST for form submission
//               data: {
//                   action: 'simpleform_get_submit_data', // Adjust the action accordingly
//                   nonce: nonce,
//                   id: formId,
//                   form_data: formData, // Include the serialized form data
//               },
//               success: function (response) {
//                   var responseData = response.data;

//                   // Split the form data into key-value pairs
//                   var formDataArray = formData.split('&');
//                   var formDataObject = {};

//                   formDataArray.forEach(function (item) {
//                       var pair = item.split('=');
//                       var key = decodeURIComponent(pair[0]);
//                       var value = decodeURIComponent(pair[1]);
//                       formDataObject[key] = value;
//                   });

//                   /* formDataArray.forEach(function (item) {
//                     var pair = item.split('=');
//                     var key = decodeURIComponent(pair[0]);
//                     var value = decodeURIComponent(pair[1]);
                    
//                     // Properly encode the key and value before adding to formDataObject
//                     formDataObject[key] = encodeURIComponent(value);
//                 }); */

//                   console.log('Formatted Form Data:', formDataObject);

//                   // Handle the response data as needed
//               },
//               error: function (error) {
//                   // Handle the error for this form
//                   console.error('Form', formId, 'Error:', error);
//               }
//           });
//       });
//   });
// });



