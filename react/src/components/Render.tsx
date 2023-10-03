import React from 'react';
import '../styles/_render.scss';

const renderToggleCheckbox = (field) => (
  <div className='simple-form-checkbox-toggle'>
    <label className="switch-label">
      {field.label}
      <input
        type="checkbox"
        id={field.id}
        name={field.name}
        className={`switch-input ${field.className}`}
        required={field.required}
      />
      <span className="slider round"></span>
    </label>
    {field.toggle ? null : (
      <div>
        {field.options.map((option) => (
          <label key={option.value}>
            {option.label}
            <input
              type="checkbox"
              name={`${field.name}[]`}
              value={option.value}
            />
          </label>
        ))}
      </div>
    )}
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
            name={`${field.name}[]`} // Use an array for multiple options
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
            name={field.name}
            data-unique-id={field.uniqueId}
            value={field.value}
            subtype={field.subtype}
          />
        </div>
      );
    case 'textarea':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <textarea
            type="textarea"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            data-unique-id={field.uniqueId}
            value={field.value}
            subtype={field.subtype}
          />
        </div>
      );
    case 'number':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="number"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            data-unique-id={field.uniqueId}
            value={field.value}
          />
        </div>
      );
    case 'button':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="button"
            value={field.value}
            className={field.className}
            required={field.required}
            id={field.id}
            data-unique-id={field.uniqueId}
          />
        </div>
      );

    case 'hidden':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          {/* <label>{field.label}</label> */}
          <input
            type="hidden"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'email':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="email"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
            subtype={field.subtype}
          />
        </div>
      );
    case 'date':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="date"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'color':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="color"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'datetime-local':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="datetime-local"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'password':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="password"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'tel':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="tel"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'submit':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="submit"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'time':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="time"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'url':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="url"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'week':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="week"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'search':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="search"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'reset':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="reset"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'range':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="range"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'image':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="image"
            src={field.src}
            alt={field.alt}
            width={field.width}
            height={field.height}
            // placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            // value={field.value}
            data-unique-id={field.uniqueId}
          />
        </div>
      );
    case 'month':
      return (
        <div key={field.uniqueId} className='simple-form-text'>
          <label>{field.label}</label>
          <input
            type="month"
            placeholder={field.placeholder}
            className={field.className}
            required={field.required}
            id={field.id}
            name={field.name}
            value={field.value}
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
                name={field.name}
                subtype={field.subtype}
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
          {field.toggle === 'true' ? renderToggleCheckbox(field) : renderDefaultCheckbox(field)}
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
                name={field.name}
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
