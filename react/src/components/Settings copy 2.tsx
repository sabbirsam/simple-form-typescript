import React, { useState, useEffect } from "react";
import ReactSwitchreview from "react-switch";
import ReactSwitchsupport from "react-switch";
const Settingsicon = require('../../../assets/public/icons/Settings.gif');
import { useLocation } from 'react-router-dom';
import { getNonce, getTables, getFormSettings } from './../Helpers';
import "../styles/_setting.scss";

const Settings = () => {


  const location = useLocation();
  const [tables, setTables] = useState(getTables());
  const [settings, setSettings] = useState([]);


  useEffect(() => {
    getFormSettings();
  }, []);

  function getFormSettings() {
    const simple_settings = {
      selectedTable: null,
      selectedWhatsapp: null,
      whatsappRedirection: 'false',
      formCustomization: 'false',
      floatingwidgets: 'false',
      whatsappNumber: '',
      openInNewTab: 'false',

      formheader: "Have question? - Submit the Form",
      formcta: '',

      submitbtntext: 'Send Message',
      submitbtnbgcolor: '#FFA500',
      submitbtntextcolor: "#FFFFFF",
      submitbtntexthovercolor: "#3F98D2",

      headerbackgroundcolor: "#293239",
      headertextcolor: "#FFFFFF",

      formfieldtextcolor: "#293239",
      formbackgroundcolor: "#F7F7F7",
      flotingwidgetsbgcolor: "#0065A0",
      selectedFont: "",
    };
    const settingsData = JSON.parse(localStorage.getItem("simple_form_settings") || JSON.stringify(simple_settings));
    setSettings(settingsData);
  }

  const [selectedTable, setSelectedTable] = useState(settings.selectedTable || null);

  const [selectedWhatsapp, setSelectedWhatsapp] = useState(settings.selectedWhatsapp || null);
  const [whatsappRedirection, setWhatsappRedirection] = useState(settings.whatsappRedirection === 'false');
  const [formCustomization, setformCustomization] = useState(settings.formCustomization === 'false');
  const [floatingwidgets, setFloating] = useState(settings.floatingwidgets === 'false');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || "");
  const [openInNewTab, setOpenInNewTab] = useState(settings.openInNewTab === 'false');

  const [formheader, setFormheader] = useState(settings.formheader || "Have question? - Submit the Form");
  const [formcta, setFormCTA] = useState(settings.formcta || "");

  const [submitbtntext, setSubmitbtntext] = useState(settings.submitbtntext || 'Send Message');
  const [submitbtnbgcolor, setSubmitbtnbgcolor] = useState(settings.submitbtnbgcolor || "#FFA500");
  const [submitbtntextcolor, setSubmitbtntextcolor] = useState(settings.submitbtntextcolor || "#FFFFFF");
  const [submitbtntexthovercolor, setSubmitbtntexthovercolor] = useState(settings.submitbtntexthovercolor || "#3F98D2");

  const [headerbackgroundcolor, setHeaderbackgroundcolor] = useState(settings.headerbackgroundcolor || "#293239");
  const [headertextcolor, setHeadertextcolor] = useState(settings.headertextcolor || "#FFFFFF");

  const [formfieldtextcolor, setFormfieldtextcolor] = useState(settings.formfieldtextcolor || "#293239");
  const [formbackgroundcolor, setFormbackgroundcolor] = useState(settings.formbackgroundcolor || "#F7F7F7");

  const [flotingwidgetsbgcolor, setFlotingwidgetsbgcolor] = useState(settings.flotingwidgetsbgcolor || "#0065A0");
  const [selectedFont, setSelectedFont] = useState(settings.selectedFont || "");


  const [formSettings, setFormsettings] = useState({
    selectedTable: settings.selectedTable,
    selectedWhatsapp: settings.selectedWhatsapp,
    whatsappRedirection: settings.whatsappRedirection,
    formCustomization: settings.formCustomization,
    floatingwidgets: settings.floatingwidgets,
    whatsappNumber: settings.whatsappNumber,
    openInNewTab: settings.openInNewTab,

    formheader: settings.formheader,
    formcta: settings.formcta,

    submitbtntext: settings.submitbtntext,
    submitbtnbgcolor: settings.submitbtnbgcolor,
    submitbtntextcolor: settings.submitbtntextcolor,
    submitbtntexthovercolor: settings.submitbtntexthovercolor,

    headerbackgroundcolor: settings.headerbackgroundcolor,
    headertextcolor: settings.headertextcolor,

    formfieldtextcolor: settings.formfieldtextcolor,
    formbackgroundcolor: settings.formbackgroundcolor,
    flotingwidgetsbgcolor: settings.flotingwidgetsbgcolor,
    selectedFont: settings.selectedFont,

  });



  useEffect(() => {
    wp.ajax.send('simpleform_get_tables', {
      data: {
        nonce: getNonce(),
      },
      success(response) {
        setTables(response.tables);
      },
      error(error) {
        console.error(error);
      },
    });
  }, []);


  //Setting fetch
  useEffect(() => {
    wp.ajax.send('simpleform_get_settings', {
      data: {
        nonce: getNonce(),
      },
      success(response) {
        setSettings(response.settings);
      },
      error(error) {
        console.error(error);
      },
    });
  }, [location.hash]);


  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("simple_form_settings", JSON.stringify(formSettings));

    Swal.fire({
      text: 'Are you done!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Save!',
    }).then((result) => {
      if (result.isConfirmed) {

        wp.ajax.send('simpleform_save_settings', {
          data: {
            nonce: getNonce(),
            settings: formSettings,
          },

          success({ }) {
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
          },
        });

      }
    });
    // console.log(settings);
  };


  const fontList = [
    'Arial',
    'Verdana',
    'Times New Roman',
    'Helvetica',
    'Courier New',
    'circular',
    'auto',
    'cursive',
    'emoji',
    'fangsong',
    'fantasy',
    'inherit',
    'initial',
    'monospace',
    'system-ui',
    'ui-monospace',
    'unset'
  ];

  // const handleFontChange = (e) => {
  //   setSelectedFont(e.target.value);
  // };

  return (
    <div className="acb_bottom" id="acb_bottom">
      <div className="acb_left">
        <h3 className="review-case-title">Simple Form settings panel</h3>
        <div className="wpnts-switch-floating">
          <label htmlFor="floating-widgets">Enable floating widgets:</label>
          <ReactSwitchsupport
            checked={formSettings.floatingwidgets}
            className="supportSwitch-2"
            name="wpnts-switch-floating"
            id="floating-widgets"
            // onChange={(checked) => setFloating(checked)}
            onChange={(checked) => setFormsettings(prev => ({ ...prev, floatingwidgets: checked }))}
          //setFormsettings(prev => ({ ...prev, [e.target.name]: e.target.value }))
          />
        </div>

        <div className="wpnts-switch-review">
          <label htmlFor="reviewnoti">Enable WhatsApp redirection:</label>
          <ReactSwitchreview
            checked={formSettings.whatsappRedirection}
            className="reviewSwitch"
            name="wpnts-switch-review"
            id="reviewnoti"
            // onChange={(checked) => setWhatsappRedirection(checked)}
            onChange={(checked) => setWhatsappRedirection(prev => ({ ...prev, whatsappRedirection: checked }))}
          />
        </div>

        <div className="wpnts-switch-review">
          <label htmlFor="reviewnoti">Enable Form customization:</label>
          <ReactSwitchreview
            checked={formSettings.formCustomization}
            className="customizationSwitch"
            name="wpnts-switch-review"
            id="form-customization"
            // onChange={(checked) => setformCustomization(checked)}
            onChange={(checked) => setformCustomization(prev => ({ ...prev, formCustomization: checked }))}
          />
        </div>

        {!whatsappRedirection && !floatingwidgets ? (
          <form onSubmit={handleSubmit} id="wpntswebhook">
            <button type="submit" className="save-webhook">SAVE</button>
          </form>
        ) : null}
        <div className="no-tables-intro-img">
          <img style={{ width: '40vh', height: '40vh' }} src={Settingsicon} alt="Cloud Icon" />
        </div>
      </div>

      <div className="acb_right">
        <form onSubmit={handleSubmit} id="wpntswebhook">
          {floatingwidgets && (
            <div className="formInput">
              <label htmlFor="selectedTable">Select Form to display as floating widgets</label>
              <div className="wpnts-setting">
                <select
                  id="selectedTable"
                  name="selectedTable"
                  value={formSettings.selectedTable || ''}
                  // onChange={(e) => setSelectedTable(parseInt(e.target.value, 10))}
                  onChange={(e) => setSelectedTable(prev => ({ ...prev, selectedTable: e.target.value }))}

                >
                  <option value="">Select a form</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.form_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="seperationLine">
                <hr />
              </div>

            </div>
          )}
          {whatsappRedirection && (
            <div className="formInput">
              <label htmlFor="webhook">WhatsApp number</label>
              <div className="wpnts-setting">
                <input
                  type="text"
                  placeholder="Add country code ex. +88013071089564"
                  name="webhook"
                  value={formSettings.whatsappNumber}
                  // onChange={(e) => setWhatsappNumber(e.target.value)}
                  onChange={(e) => setWhatsappNumber(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                />
              </div>
            </div>
          )}

          {whatsappRedirection && (
            <div className="sf-customization">
              <div className="formInput open-new-tab">
                <label htmlFor="interval_review">Open in new tab</label>
                <input
                  type="checkbox"
                  name="interval_review"
                  checked={formSettings.openInNewTab}
                  // onChange={(e) => setOpenInNewTab(e.target.checked)}
                  onChange={(e) => setOpenInNewTab(prev => ({ ...prev, openInNewTab: e.target.value }))}
                />
              </div>

              <div className="formInput">
                <label htmlFor="selectedWhatsapp">Select Forms for WhatsApp redirection:</label>
                <div className="wpnts-setting">
                  <select
                    id="selectedWhatsapp"
                    name="selectedWhatsapp"
                    multiple
                    value={formSettings.selectedWhatsapp || []} // Initialize as an empty array
                    onChange={(e) => {
                      const selectedWhatsappid = Array.from(e.target.selectedOptions, (option) => option.value);
                      // setSelectedWhatsapp(selectedWhatsappid);
                      setSelectedWhatsapp(prev => ({ ...prev, selectedWhatsapp: selectedWhatsappid }))
                    }}
                  >
                    {tables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.form_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="seperationLine">
                <hr />
              </div>

            </div>
          )}


          {formCustomization && (
            <div>

              <div className="formInput">
                <label htmlFor="webhook">Submit button text</label>
                <div className="wpnts-setting">
                  <input
                    type="text"
                    name="interval_review"
                    value={formSettings.submitbtntext}
                    // onChange={(e) => setSubmitbtntext(e.target.value)}
                    onChange={(e) => setSubmitbtntext(prev => ({ ...prev, submitbtntext: e.target.value }))}

                  />
                </div>
              </div>


              <div className="formInput">
                <label htmlFor="webhook">Form Header text</label>
                <div className="wpnts-setting">
                  <input
                    type="text"
                    name="interval_review"
                    value={formSettings.formheader}
                    // onChange={(e) => setFormheader(e.target.value)}
                    onChange={(e) => setFormheader(prev => ({ ...prev, formheader: e.target.value }))}
                  />
                </div>
              </div>

              <div className="formInput">
                <label htmlFor="webhook">Form CTA text</label>
                <div className="wpnts-setting">
                  <input
                    type="text"
                    name="interval_review"
                    value={formSettings.formcta}
                    // onChange={(e) => setFormCTA(e.target.value)}
                    onChange={(e) => setFormCTA(prev => ({ ...prev, formcta: e.target.value }))}
                  />
                </div>
              </div>

              <div className="seperationLine">
                <hr />
              </div>

              <div className="formInput">
                <label htmlFor="selectedFont">Select Font</label>
                <div className="wpnts-setting">
                  <select
                    id="selectedFont"
                    name="selectedFont"
                    value={formSettings.selectedFont}
                    // onChange={handleFontChange}
                    onChange={(e) => setSelectedFont(prev => ({ ...prev, selectedFont: e.target.value }))}
                  >
                    <option value="">Select a font</option>
                    {fontList.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="formInput simpleform-colorplate">
                <label htmlFor="flotingwidgetsbgcolor">Floting widgets color</label>
                <div className="wpnts-setting">
                  <input
                    className="colorSelectionformtext"
                    type="color"
                    name="flotingwidgetsbgcolor"
                    value={formSettings.flotingwidgetsbgcolor}
                    // onChange={(e) => setFlotingwidgetsbgcolor(e.target.value)}
                    onChange={(e) => setFlotingwidgetsbgcolor(prev => ({ ...prev, flotingwidgetsbgcolor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="formInput simpleform-colorplate">
                <label htmlFor="headertextcolor">Header text color</label>
                <div className="wpnts-setting">
                  <input
                    className="colorSelectionformtext"
                    type="color"
                    name="headertextcolor"
                    value={formSettings.headertextcolor}
                    // onChange={(e) => setHeadertextcolor(e.target.value)}
                    onChange={(e) => setHeadertextcolor(prev => ({ ...prev, headertextcolor: e.target.value }))}
                  />
                </div>
              </div>

              {/* Form color  */}
              <div className="formInput simpleform-colorplate">
                <label htmlFor="headerbackgroundcolor">header background color</label>
                <div className="wpnts-setting">
                  <input
                    className="colorSelectionbg"
                    type="color"
                    name="headerbackgroundcolor"
                    value={formSettings.headerbackgroundcolor}
                    // onChange={(e) => setHeaderbackgroundcolor(e.target.value)}
                    onChange={(e) => setHeaderbackgroundcolor(prev => ({ ...prev, headerbackgroundcolor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="formInput simpleform-colorplate">
                <label htmlFor="formbackgroundcolor">Form background color</label>
                <div className="wpnts-setting">
                  <input
                    className="colorSelectionbg"
                    type="color"
                    name="formbackgroundcolor"
                    value={formSettings.formbackgroundcolor}
                    // onChange={(e) => setFormbackgroundcolor(e.target.value)}
                    onChange={(e) => setFormbackgroundcolor(prev => ({ ...prev, formbackgroundcolor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="formInput simpleform-colorplate">
                <label htmlFor="formfieldtextcolor">Form fields text/lable color</label>
                <div className="wpnts-setting">
                  <input
                    className="colorSelectionformtextcolor"
                    type="color"
                    name="formfieldtextcolor"
                    value={formSettings.formfieldtextcolor}
                    // onChange={(e) => setFormfieldtextcolor(e.target.value)}
                    onChange={(e) => setFormfieldtextcolor(prev => ({ ...prev, formfieldtextcolor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="formInput simpleform-colorplate">
                <label htmlFor="submitbtnbgcolor">Submit button BG color</label>
                <div className="wpnts-setting">
                  <input
                    id="submitbtnbgcolor"
                    className="colorSelectionbg"
                    type="color"
                    name="submitbtnbgcolor"
                    value={formSettings.submitbtnbgcolor}
                    // onChange={(e) => setSubmitbtnbgcolor(e.target.value)}
                    onChange={(e) => setSubmitbtnbgcolor(prev => ({ ...prev, submitbtnbgcolor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="formInput simpleform-colorplate">
                <label htmlFor="submitbtntextcolor">Submit button text color</label>
                <div className="wpnts-setting">
                  <input
                    id="submitbtntextcolor"
                    className="colorSelectiontext"
                    type="color"
                    name="submitbtntextcolor"
                    value={formSettings.submitbtntextcolor}
                    // onChange={(e) => setSubmitbtntextcolor(e.target.value)}
                    onChange={(e) => setSubmitbtntextcolor(prev => ({ ...prev, submitbtntextcolor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="formInput simpleform-colorplate">
                <label htmlFor="submitbtntexthovercolor">Submit button hover color</label>
                <div className="wpnts-setting">
                  <input
                    id="submitbtntexthovercolor"
                    className="colorSelectionhover"
                    type="color"
                    name="submitbtntexthovercolor"
                    value={formSettings.submitbtntexthovercolor}
                    onChange={(e) => setSubmitbtntexthovercolor(prev => ({ ...prev, submitbtntexthovercolor: e.target.value }))}
                  // onChange={(e) => setSubmitbtntexthovercolor(e.target.value)}
                  />
                </div>
              </div>

              <div className="seperationLine">
                <hr />
              </div>
            </div>
          )}


          {whatsappRedirection || floatingwidgets || formCustomization ? (
            <button type="submit" className="save-webhook">
              SAVE
            </button>
          ) : null}
        </form>
      </div>

    </div>
  );
};

export default Settings;
