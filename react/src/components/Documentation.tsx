import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import '../styles/_documentation.scss';

import RenderField from './Render';


const Leads = () => {
  const [availableFields, setAvailableFields] = useState([
    {
      id: 'text-input',
      label: 'Text Input',
      type: 'text',
      placeholder: 'Enter text...',
      className: 'custom-input',
      required: false,
      value: '',
    },
    {
      id: 'radio-button',
      label: 'Radio Button',
      type: 'radio',
      required: false,
      options: [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' },
      ],
    },
    {
      id: 'checkbox',
      label: 'Checkbox',
      type: 'checkbox',
      required: false,
      options: [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' },
      ],
    },
    {
      id: 'select-input',
      label: 'Select',
      type: 'select',
      required: false,
      options: [
        { label: 'Option 1', value: 'Option 1' },
        { label: 'Option 2', value: 'Option 2' },
      ],
    },
    {
      id: 'file-input',
      label: 'File Upload',
      type: 'file',
      required: false,
    },
  ]);

  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [showjson, setShowjson] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  //   Make id as unique 
	const onDragEnd = (result) => {
    if (!result.destination) return;
      
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      
      if (result.source.droppableId === 'available-fields') {
        const sourceField = availableFields[sourceIndex];
        const newField = {
        ...sourceField,
        id: `${sourceField.id}-${new Date().getTime()}`, // Append a unique identifier
        uniqueId: `field-${new Date().getTime()}`,
        };
      
        setFormFields((prevFormFields) => {
        const updatedFormFields = [...prevFormFields];
        updatedFormFields.splice(destinationIndex, 0, newField);
        return updatedFormFields;
        });
      } else if (result.source.droppableId === 'form-canvas') {
        setFormFields((prevFormFields) => {
        const updatedFormFields = [...prevFormFields];
        const [movedField] = updatedFormFields.splice(sourceIndex, 1);
        updatedFormFields.splice(destinationIndex, 0, movedField);
        return updatedFormFields;
        });
      }
	  };

  const handleRemoveField = (uniqueId) => {
    const updatedFormFields = formFields.filter((field) => field.uniqueId !== uniqueId);
    setFormFields(updatedFormFields);
    setEditingField(null);
  };

  const handleEditField = (uniqueId) => {
    const fieldToEdit = formFields.find((field) => field.uniqueId === uniqueId);
    setEditingField({ ...fieldToEdit });
  };

  const handleUpdateField = () => {
    const updatedFormFields = formFields.map((field) => {
      if (field.uniqueId === editingField.uniqueId) {
        return { ...editingField };
      }
      return field;
    });
    setFormFields(updatedFormFields);
    setEditingField(null);
  };

  const handleSaveForm = () => {
    setFormData(formFields);
    // setShowjson(true)
    setShowjson((showjson) => !showjson);
  };

  const handleAddOption = () => {
    if (editingField && (editingField.type === 'select' || editingField.type === 'radio' || editingField.type === 'checkbox')) {
      const updatedOptions = [
        ...editingField.options,
        { label: 'New Option', value: 'New Option' },
      ];
      setEditingField({ ...editingField, options: updatedOptions });
    }
  };

  const handleRemoveOption = (optionIndex) => {
   
    if (
      editingField &&
      (editingField.type === 'select' || editingField.type === 'radio' || editingField.type === 'checkbox') &&
      optionIndex !== null
    ) {
      const updatedOptions = [...editingField.options];
      updatedOptions.splice(optionIndex, 1);
      setEditingField({ ...editingField, options: updatedOptions });
      setEditingOptionIndex(null);
    }
  };

  const handleEditOption = (index) => {
    setEditingOptionIndex(index);
  };

  return (
    <div>
      <h2>Drag and Drop Form Builder</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="form-builder">
          <div className="form-fields">
            <h3>Available Fields</h3>
            <Droppable droppableId="available-fields" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="draggable-field-container"
                >
                  {availableFields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-field"
                        >
                          {field.label}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          
          <div className="form-canvas">
              <h3>Form Canvas</h3>
              <Droppable droppableId="form-canvas" direction="vertical">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="form-canvas-container"
                  >
                    {formFields.map((field, index) => (
                      <Draggable key={field.uniqueId} draggableId={field.uniqueId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="draggable-field"
                          >
                            {/* Render the field using the RenderField component */}
                            <RenderField field={field} />
                            <button className='form-edit' onClick={() => handleEditField(field.uniqueId)}>Edit</button>
                            <button className='form-remove' onClick={() => handleRemoveField(field.uniqueId)}>Remove</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
        </div>
      </DragDropContext>

      {editingField && (
        <div className="edit-field-form">
          <div className='form-btn-group'>
            <button onClick={handleUpdateField}>Update</button>
            {/* <button onClick={handleSaveForm}>Show Json</button> */}
            <button onClick={handleSaveForm}>
              {showjson ? 'Hide Json' : 'Show Json'}
            </button>

          </div>
          <h3>Edit Field</h3>
          <div className='simple-form-id-panel'>
            <label>ID:</label>
            <input
              type="text"
              value={editingField.id}
              onChange={(e) => setEditingField({ ...editingField, id: e.target.value })}
            />
          </div>

          <div className='simple-form-id-panel'>
            <label>Label:</label>
            <input
              type="text"
              value={editingField.label}
              onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
            />
          </div>

          <div className='simple-form-id-panel type-dropdown'>
            <label>Type:</label>
            {/* {editingField.type === 'text' ? ( */}
            {!(editingField.type === 'file' || editingField.type === 'select' || editingField.type === 'checkbox' || editingField.type === 'radio') ? (
              <select
                className='select-type-class'
                value={editingField.type}
                onChange={(e) => setEditingField({ ...editingField, type: e.target.value })}
              >
                <option value="button">Button</option>
                <option value="color">Color</option>
                <option value="date">Date</option>
                <option value="datetime-local">Datetime-local</option>
                <option value="email">Email</option>
                <option value="hidden">Hidden</option>
                <option value="image">Image</option>
                <option value="month">Month</option>
                <option value="number">Number</option>
                <option value="password">Password</option>
                <option value="range">Range</option>
                <option value="reset">Reset</option>
                <option value="search">Search</option>
                <option value="submit">Submit</option>
                <option value="tel">Tel</option>
                <option value="text">Text</option>
                <option value="time">Time</option>
                <option value="url">URL</option>
                <option value="week">Week</option>
              </select>
            ) : (
                <input
                  type="text"
                  value={editingField.type}
                  onChange={(e) => setEditingField({ ...editingField, type: e.target.value })}
                />
            )}
          </div>
          {/* <div className='simple-form-id-panel'>
            <label>Type:</label>
            <input
              type="text"
              value={editingField.type}
              onChange={(e) => setEditingField({ ...editingField, type: e.target.value })}
            />
          </div> */}

          <div className='simple-form-id-panel'>
            <label>Placeholder:</label>
            <input
              type="text"
              value={editingField.placeholder}
              onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
            />
          </div>

          <div className='simple-form-id-panel'>
            <label>Required:
            <input
              type="checkbox"
              checked={editingField.required}
              onChange={(e) => {
              setEditingField({ ...editingField, required: e.target.checked });
              }}
            />
            </label>
          </div>

          <div className='simple-form-id-panel'>
            <label>Class Name:</label>
            <input
              type="text"
              value={editingField.className}
              onChange={(e) => setEditingField({ ...editingField, className: e.target.value })}
            />
          </div>

          <div className='simple-form-id-panel'>
            <label>Value:</label>
            <input
              type="text"
              value={editingField.value}
              onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
            />
          </div>

          {['select', 'radio', 'checkbox'].includes(editingField.type) && (
            <div>
              <h4>{editingField.type === 'select' ? 'Select Options' : 'Options'}</h4>
              {editingField.options.map((option, optionIndex) => (
                <div className='simple-form-id-panel select-fields-panel' key={optionIndex}>
                  <label>Label:</label>
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => {
                      const updatedOptions = [...editingField.options];
                      updatedOptions[optionIndex] = { ...option, label: e.target.value };
                      setEditingField({ ...editingField, options: updatedOptions });
                    }}
                  />
                  <label>Value:</label>
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const updatedOptions = [...editingField.options];
                      updatedOptions[optionIndex] = { ...option, value: e.target.value };
                      setEditingField({ ...editingField, options: updatedOptions });
                    }}
                  />
                  <button className='option-remover' onClick={() => handleRemoveOption(optionIndex)}>Remove</button>
                </div>
              ))}
              <button onClick={handleAddOption}>Add Option</button>
              
            </div>
          )}
          
        </div>
      )}

    {!editingField && (
      <button onClick={handleSaveForm}>Show Json</button> 
    )}
    {showjson && (
      <pre>Form Data: {JSON.stringify(formData, null, 2)}</pre>
    )}  
    </div>
  );
};

export default Leads;