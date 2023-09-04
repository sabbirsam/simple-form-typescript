import React from 'react';
import '../styles/_render.scss';

const renderToggleCheckbox = (field) => (
    <div className='simple-form-checkbox-toggle'>
      <label className="switch-label">
        {field.label}
        <input
          type="checkbox"
          id={field.id}
          name={field.id}
          className={field.className}
          required={field.required}
        />
        <span className="slider round"></span>
      </label>
      <div>
        {field.options.map((option) => (
          <label key={option.value}>
            {option.label}
            <input
              type="checkbox"
              name={`${field.id}[]`} // Use an array for multiple options
              value={option.value}
            />
          </label>
        ))}
      </div>
    </div>
  );
  
  const renderDefaultCheckbox = (field) => (
    <div className='simple-form-checkbox-default'>
      <label htmlFor={field.id}>{field.label}</label>
      <div>
        {field.options.map((option) => (
          <label key={option.value}>
            <input
              type="checkbox"
              id={option.value}
              name={`${field.id}[]`} // Use an array for multiple options
              value={option.value}
              className={field.className}
              required={field.required}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );

/**
 * 
 * @param param0 Main function here 
 * @returns 
 */

const RenderField = ({ field }) => {
  switch (field.type) {
    case 'text':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
            <label>{field.label}</label>
            <input
            type="text"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            data-unique-id={field.uniqueId}
            />
        </div>
      );
    case 'radio':
      return (
        <div key={field.uniqueId} className='simple-form-radio'>
        <label>{field.label}</label>
          {field.options.map((option, index) => (
            <label key={index}>
              <input 
              type="radio" 
              name={field.id} 
              required={field.required}
              id={field.id}
              data-unique-id={field.uniqueId}
              value={option.value} />
              {option.label}
            </label>
          ))}
        </div>
      );
    case 'checkbox':
        return (
            <div key={field.uniqueId}>
            {field.toggle ? renderToggleCheckbox(field) : renderDefaultCheckbox(field)}
            </div>
        );
    case 'select':
      return (
        <div key={field.uniqueId} className='simple-form-select'>
            <label>{field.label}</label>
            {field.options.map((option) => (
            <div key={option.value} className='simple-form-fields'>
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
    case 'file':
        return (
            <div key={field.uniqueId} className='simple-form-file' >
              <label>{field.label}</label>
              <input type="file" />
            </div>
          );
    default:
      return null; // Handle unsupported field types or return an appropriate default.
  }
};

export default RenderField;
