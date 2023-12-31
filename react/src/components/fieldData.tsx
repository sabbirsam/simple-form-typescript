const availableFieldsList = [
  {
    id: 'text-input',
    name: 'name-text-input',
    label: 'Text Input',
    type: 'text',
    placeholder: 'Enter text...',
    className: 'custom-input',
    required: true,
    value: '',
    subtype: 'text',
  },
  {
    id: 'number-input',
    name: 'number-text-input',
    label: 'Number',
    type: 'number',
    placeholder: 'Enter no...',
    className: 'custom-input',
    required: true,
    value: '',
  },
  {
    id: 'email-input',
    name: 'email-text-input',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email...',
    className: 'custom-input',
    required: true,
    value: '',
    subtype: 'email',
  },
  {
    id: 'text-field',
    name: 'textfield-text-input',
    label: 'Text Field',
    type: 'text',
    placeholder: '',
    className: 'custom-input',
    required: true,
    value: '',
    subtype: 'text',
  },
  {
    id: 'text-area',
    name: 'textarea-text-input',
    label: 'Text Area',
    type: 'textarea',
    placeholder: '',
    className: 'custom-input-text-area',
    required: true,
    value: '',
    subtype: 'textarea',
  },
  {
    id: 'radio-button',
    label: 'Radio Button',
    type: 'radio',
    required: false,
    name: 'radio-button',
    options: [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ],
    subtype: 'radio',
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    type: 'checkbox',
    name: 'checkbox-button',
    toggle: false,
    required: false,
    options: [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ],
  },
  {
    id: 'select-input',
    name: 'select-input',
    label: 'Select',
    type: 'select',
    required: false,
    options: [
      { label: 'Option 1', value: 'Option 1' },
      { label: 'Option 2', value: 'Option 2' },
    ],
  },
  /* {
    id: 'file-input',
    name: 'file-text-input',
    label: 'File Upload',
    type: 'file',
    required: false,
    subtype: 'file',
  }, */

  {
    id: 'text-hidden',
    name: 'hidden-text-input',
    label: 'Hidden Field',
    type: 'hidden',
    placeholder: '',
    className: 'custom-input',
    required: false,
    value: '',
  },

];

export default availableFieldsList;