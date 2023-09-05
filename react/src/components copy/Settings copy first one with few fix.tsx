import React from 'react';
import '../styles/_lead.scss';

function Settings() {
  // Sample JSON data (replace with your actual JSON data)
  const formData = [
	{
	  "id": "text-input",
	  "label": "Text Input",
	  "type": "text",
	  "placeholder": "Enter text...",
	  "className": "custom-input",
	  "uniqueId": "field-1693753646275"
	},
	{
	  "id": "radio-button",
	  "label": "Radio Button",
	  "type": "radio",
	  "options": [
		{
		  "label": "Option 1",
		  "value": "Option 1"
		},
		{
		  "label": "Option 2",
		  "value": "Option 2"
		}
	  ],
	  "uniqueId": "field-1693753648295"
	},
	{
	  "id": "checkbox",
	  "label": "Checkbox",
	  "type": "checkbox",
	  "options": [
		{
		  "label": "Option 1",
		  "value": "Option 1"
		},
		{
		  "label": "Option 2",
		  "value": "Option 2"
		}
	  ],
	  "uniqueId": "field-1693753650044"
	},
	{
	  "id": "select-input",
	  "label": "Select",
	  "type": "select",
	  "options": [
		{
		  "label": "Option 1",
		  "value": "Option 1"
		},
		{
		  "label": "Option 2",
		  "value": "Option 2"
		}
	  ],
	  "uniqueId": "field-1693753651911"
	},
	{
	  "id": "file-input",
	  "label": "File Upload",
	  "type": "file",
	  "uniqueId": "field-1693753653546"
	},
	{
	  "id": "checkbox",
	  "label": "Checkbox",
	  "type": "checkbox",
	  "options": [
		{
		  "label": "Option 1",
		  "value": "Option 1"
		},
		{
		  "label": "Option 2",
		  "value": "Option 2"
		}
	  ],
	  "uniqueId": "field-1693753655313"
	},
	{
	  "id": "text-input",
	  "label": "Text Input",
	  "type": "text",
	  "placeholder": "Enter text...",
	  "className": "custom-input",
	  "uniqueId": "field-1693753658097"
	},
	{
	  "id": "file-input",
	  "label": "File Upload",
	  "type": "file",
	  "uniqueId": "field-1693753661197"
	}
  ];

  // Function to render HTML based on JSON data
  const renderForm = (formData) => {
    return formData.map((field) => {
      switch (field.type) {
        case 'text':
          return (
            <div key={field.uniqueId}>
              <label>{field.label}</label>
              <input
                type="text"
                placeholder={field.placeholder}
                className={field.className}
              />
            </div>
          );

        case 'select':
          return (
            <div key={field.uniqueId}>
              <label>{field.label}</label>
              <select>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );

        case 'file':
          return (
            <div key={field.uniqueId}>
              <label>{field.label}</label>
              <input type="file" />
            </div>
          );

        case 'checkbox':
          return (
            <div key={field.uniqueId}>
              <label>{field.label}</label>
              {field.options.map((option) => (
                <div key={option.value}>
                  <input
                    type="checkbox"
                    id={option.value}
                    name={field.id}
                    value={option.value}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          );

        case 'radio':
          return (
            <div key={field.uniqueId}>
              <label>{field.label}</label>
              {field.options.map((option) => (
                <div key={option.value}>
                  <input
                    type="radio"
                    id={option.value}
                    name={field.id}
                    value={option.value}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div>
      <h2>Rendered Form</h2>
      {renderForm(formData)}
    </div>
  );
}

export default Settings;
