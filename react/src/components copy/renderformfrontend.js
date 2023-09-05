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