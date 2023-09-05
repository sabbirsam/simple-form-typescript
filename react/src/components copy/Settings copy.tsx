import React, { useState } from 'react';
import '../styles/_setting.scss';

function Settings() {
  // Sample JSON data (replace with your actual JSON data)
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
              {field.toggle
                ? renderToggleCheckbox(field)
                : renderDefaultCheckbox(field)}
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

  // Function to render checkboxes with switch-like style
  const renderToggleCheckbox = (field) => (
    <div>
      {field.options.map((option) => (
        <label key={option.value} className="switch-label">
          {option.label}
          <input
            type="checkbox"
            id={option.value}
            name={field.id}
            value={option.value}
          />
          <span className="slider round"></span>
        </label>
      ))}
    </div>
  );

  // Function to render checkboxes with default style
  const renderDefaultCheckbox = (field) => (
    <div>
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

  return (
    <div>
      <h2>Rendered Form</h2>
      {renderForm(formData)}
    </div>
  );
}

export default Settings;
