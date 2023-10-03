import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Modal from '../core/Modal';
import { getNonce, } from './../Helpers';
import { useNavigate } from 'react-router-dom';
import { EditIcon, DeleteIcon, Cross } from '../icons';
import availableFieldsList from './fieldData';
import { useParams } from 'react-router-dom';
import '../styles/_createForm.scss';

import RenderField from './Render';


const CreateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formName, setFormName] = useState('');
  const [formJson, setFormJson] = useState({});
  const [availableFields, setAvailableFields] = useState(availableFieldsList)
  const [createTableModal, setCreateTableModal] = useState(false);
  const createTableModalRef = useRef();
  //formFields are used to store all fileds in JSON 
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [showjson, setShowjson] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  // Add state to keep track of whether the field is being edited
  const [isEditingField, setIsEditingField] = useState(false);

  const handleClosePopup = () => {
    setCreateTableModal(false);
    setShowjson((showjson) => !showjson);
  };

  /**
   * Alert if clicked on outside of element
   *
   * @param  event
   */
  function handleCancelOutside(event: MouseEvent) {
    if (
      createTableModalRef.current &&
      !createTableModalRef.current.contains(event.target)
    ) {
      handleClosePopup();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleCancelOutside);
    return () => {
      document.removeEventListener('mousedown', handleCancelOutside);
    };
  }, [handleCancelOutside]);

  /**
   * 
   * @param result DRAGEND 
   * @returns 
   * unique identifier
   */
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (result.source.droppableId === 'available-fields') {
      const sourceField = availableFields[sourceIndex];
      const newField = {
        ...sourceField,
        id: `${sourceField.id}-${new Date().getTime()}`,
        name: `${sourceField.name}-${new Date().getTime()}`,
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

  /**
   * 
   * @param uniqueId Remove added filed from canvas
   */
  const handleRemoveField = (uniqueId) => {
    const updatedFormFields = formFields.filter((field) => field.uniqueId !== uniqueId);
    setFormFields(updatedFormFields);
    setEditingField(null);
  };

  /**
   * 
   * @param uniqueId Field edit panel handle
   */

  const handleEditField = (uniqueId) => {
    const fieldToEdit = formFields.find((field) => field.uniqueId === uniqueId);
    setEditingField({ ...fieldToEdit });

  };

  /**
   * Handle update edited filed
   */
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

  /**
   * Handle Json add and show
   */
  const handleShowJsonForm = () => {
    setFormData(formFields);
    setShowjson((showjson) => !showjson);
    setCreateTableModal(true);
  };

  /**
   * Select and other option value add
   */
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

    if (editingField && (editingField.type === 'select' || editingField.type === 'radio' || editingField.type === 'checkbox') &&
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


  /**
   * Get edit table data from DB
   */
  const getTableData = () => {
    wp.ajax.send('simpleform_edit_table', {
      data: {
        nonce: getNonce(),
        id: id,
      },
      success(response) {
        setFormName(response.form_name);
        setFormJson({ ...response, id: id });

        setFormFields(response.table_settings);


      },
      error(error) {
        console.error('Error:', error);
      },
    });
  };
  useEffect(() => {
    getTableData();
  }, []);


  console.log(formJson);



  /**
   * Update table in DB
   */
  const handleUpdateFormtoDB = () => {
    setFormData(formFields);
    setShowjson((showjson) => !showjson);

    console.log('formFields:', formFields);

    Swal.fire({
      text: 'Are you done!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Save!',
    }).then((result) => {
      if (result.isConfirmed) {
        const allData = formFields;
        const formNameInput = document.getElementById('formName');
        const formName = formNameInput.value;

        const formidinput = document.getElementById('formid');
        const formid = formidinput.value;

        /**
         * Save form
         */
        wp.ajax.send('simpleform_save_table', {
          data: {
            nonce: getNonce(),
            id: formid,
            name: formName,
            formdata: allData,
          },

          success({ id }) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your Form has been saved',
              showConfirmButton: false,
              timer: 1500,
            });

            // navigate(`/`);
          },
          error({ message }) {
            console.log(message)
          },
        });
      }
    });
  };


  return (
    <div className='simple-form-builder'>
      <h2>Drag and Drop Form Builder</h2>

      <div className="checkbox-wrapper">
        <span className="formname">
          <input type="text" value={formName} placeholder='Add form name' name='simpleformname' className="js-open-modal" id="formName" onChange={(e) => setFormName(e.target.value)} />

          <input type="hidden" name="formid" id="formid" value={formJson.id || ''} />

        </span>
      </div>

      <div className='button-sub-group-simple-form'>
        {!editingField && (
          <button className='jsonbtn' onClick={handleShowJsonForm}>
            {showjson ? 'Hide Json' : 'Show Json'}
          </button>
        )}

        <button className="js-open-modal saveData" onClick={handleUpdateFormtoDB} id="saveData" type="button">Update</button>

      </div>
      {/* Drag & Drop Available Fields  */}

      <div className="form-builder-container">
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

            {/* Canvas  */}
            <div className="form-canvas">
              <h3>Form Canvas</h3>
              <Droppable droppableId="form-canvas" direction="vertical">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="form-canvas-container"
                  >
                    {Array.isArray(formFields) && formFields.map((field, index) => (
                      <Draggable key={field.uniqueId} draggableId={field.uniqueId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            // className="draggable-field"
                            className={`draggable-field ${isEditingField && field.uniqueId === editingField.uniqueId
                              ? 'remove-background'
                              : ''
                              }`}
                          >
                            {/* Render the field using the RenderField component */}
                            <RenderField field={field} />
                            {/* <button className='form-edit' onClick={() => handleEditField(field.uniqueId)}>
                              {EditIcon}
                            </button> */}
                            <button className={`form-edit ${isEditingField && field.uniqueId === editingField.uniqueId
                              ? 'remove-background'
                              : ''
                              }`}
                              onClick={() => {
                                handleEditField(field.uniqueId);
                                setIsEditingField(true); // Set editing state to false when removing
                              }}
                            >{EditIcon}</button>

                            <button className='form-remove' onClick={() => handleRemoveField(field.uniqueId)}>
                              {DeleteIcon}
                            </button>
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

        {/* Update panel  */}
        {editingField && (
          <div className="edit-field-form">
            <div className='form-btn-group'>
              {/* <button className='jsonbtn' onClick={handleUpdateField}>Update</button> */}
              <button className='jsonbtn' onClick={() => { handleUpdateField(); setIsEditingField(false); }} >Update</button>
              <button className='jsonbtn' onClick={handleShowJsonForm}>	 {showjson ? 'Hide Json' : 'Show Json'}</button>
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
              <label>Name:</label>
              <input
                type="text"
                value={editingField.name}
                onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
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
                  <option value="text">Text Input</option>
                  <option value="textarea">Text Area</option>
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

            <div className='simple-form-id-panel'>
              <label>Subtype:</label>
              <input
                type="text"
                value={editingField.subtype}
                onChange={(e) => setEditingField({ ...editingField, subtype: e.target.value })}
              />
            </div>

            <div className='simple-form-id-panel'>
              <label>Placeholder:</label>
              <input
                type="text"
                value={editingField.placeholder}
                onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
              />
            </div>

            {editingField.type === 'image' && (
              <>
                <div className='simple-form-id-panel'>
                  <label>Sorce:</label>
                  <input
                    type="text"
                    value={editingField.src}
                    onChange={(e) => setEditingField({ ...editingField, src: e.target.value })}
                  />
                </div>

                <div className='simple-form-id-panel'>
                  <label>Width:</label>
                  <input
                    type="text"
                    value={editingField.width}
                    onChange={(e) => setEditingField({ ...editingField, width: e.target.value })}
                  />
                </div>

                <div className='simple-form-id-panel'>
                  <label>Height:</label>
                  <input
                    type="text"
                    value={editingField.height}
                    onChange={(e) => setEditingField({ ...editingField, height: e.target.value })}
                  />
                </div>
                <div className='simple-form-id-panel'>
                  <label>Alt:</label>
                  <input
                    type="text"
                    value={editingField.alt}
                    onChange={(e) => setEditingField({ ...editingField, alt: e.target.value })}
                  />
                </div>

              </>

            )}

            {editingField.type === 'checkbox' && (
              <div className='simple-form-id-panel'>
                <label>Toggle:
                  <input
                    type="checkbox"
                    checked={editingField.toggle === 'true'} // Convert to boolean
                    onChange={(e) => {
                      setEditingField({ ...editingField, toggle: e.target.checked ? 'true' : 'false' });
                    }}
                  />
                </label>
              </div>
            )}

            <div className='simple-form-id-panel'>
              <label>Required:
                <input
                  type="checkbox"
                  checked={editingField.required === 'true'}
                  onChange={(e) => {
                    setEditingField({ ...editingField, required: e.target.checked ? 'true' : 'false' });
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
                    {/* <button className='option-remover' onClick={() => handleRemoveOption(optionIndex)}>Remove</button> */}
                    <button className='option-remover-multiple' onClick={() => handleRemoveOption(optionIndex)}> {DeleteIcon} </button>
                  </div>
                ))}
                <button className='jsonbtn' onClick={handleAddOption}>Add Option</button>

              </div>
            )}

          </div>
        )}


        {createTableModal && (
          <Modal>
            <div
              className="create-table-modal-wrap modal-content manage-modal-content"
              ref={createTableModalRef}>
              <div
                className="cross_sign"
                onClick={() => handleClosePopup()}
              >
                {Cross}
              </div>
              <pre>Form Data: {JSON.stringify(formData, null, 2)}</pre>
            </div>
          </Modal>
        )}


      </div>


    </div>
  );
};

export default CreateForm;
