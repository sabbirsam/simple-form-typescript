import React, { useState, useEffect } from "react";
import ReactSwitchreview from "react-switch";
import ReactSwitchsupport from "react-switch";
const Settingsicon = require('../../../assets/public/icons/Settings.gif');
import { getNonce, getTables, getFormSettings } from './../Helpers';
import "../styles/_setting.scss";

const Settings = () => {
  const [tables, setTables] = useState(getTables());
  const [formSettings, setSettings] = useState(getFormSettings());

  // Hook to handle local storage for a specific key
  const useLocalStorage = (key, defaultValue) => {
    const [state, setState] = useState(() => {
      const storedState = localStorage.getItem(key);
      try {
        const parsedState = storedState ? JSON.parse(storedState) : defaultValue;
        return parsedState;
      } catch (error) {
        console.error(`Error parsing JSON for key ${key}:`, error);
        return defaultValue;
      }
    });

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, setState];
  };


  const [selectedTable, setSelectedTable] = useLocalStorage('selectedTable', formSettings.selectedTable || null);

  const [whatsappRedirection, setWhatsappRedirection] = useLocalStorage('whatsappRedirection', formSettings.whatsappRedirection || false);

  const [formCustomization, setformCustomization] = useLocalStorage('formCustomization', formSettings.formCustomization || false);

  const [floatingwidgets, setFloating] = useLocalStorage('floatingwidgets', formSettings.floatingwidgets || false);

  const [openInNewTab, setOpenInNewTab] = useLocalStorage('openInNewTab', formSettings.openInNewTab || false);

  const [selectedWhatsapp, setSelectedWhatsapp] = useLocalStorage('selectedWhatsapp', formSettings.selectedWhatsapp || false);

  const [whatsappNumber, setWhatsappNumber] = useLocalStorage('whatsappNumber', formSettings.whatsappNumber || '');

  const [submitbtntext, setSubmitbtntext] = useLocalStorage('submitbtntext', formSettings.submitbtntext || 'Send Message');

  const [formheader, setFormheader] = useLocalStorage('formheader', formSettings.formheader || "Have question? - Submit the Form");

  const [formcta, setFormCTA] = useLocalStorage('formcta', formSettings.formcta || "Have queries?");

  const [submitbtnbgcolor, setSubmitbtnbgcolor] = useLocalStorage('submitbtnbgcolor', formSettings.submitbtnbgcolor || "#FFA500");

  const [submitbtntextcolor, setSubmitbtntextcolor] = useLocalStorage('submitbtntextcolor', formSettings.submitbtntextcolor || "#FFFFFF");

  const [submitbtntexthovercolor, setSubmitbtntexthovercolor] = useLocalStorage('submitbtntexthovercolor', formSettings.submitbtntexthovercolor || "#3F98D2");

  const [headerbackgroundcolor, setHeaderbackgroundcolor] = useLocalStorage('headerbackgroundcolor', formSettings.headerbackgroundcolor || "#293239");

  const [headertextcolor, setHeadertextcolor] = useLocalStorage('headertextcolor', formSettings.headertextcolor || "#FFFFFF");

  const [formfieldtextcolor, setFormfieldtextcolor] = useLocalStorage('formfieldtextcolor', formSettings.formfieldtextcolor || "#293239");

  const [formbackgroundcolor, setFormbackgroundcolor] = useLocalStorage('formbackgroundcolor', formSettings.formbackgroundcolor || "#F7F7F7");

  const [flotingwidgetsbgcolor, setFlotingwidgetsbgcolor] = useLocalStorage('flotingwidgetsbgcolor', formSettings.flotingwidgetsbgcolor || "#0065A0");

  const [selectedFont, setSelectedFont] = useLocalStorage('selectedFont', formSettings.selectedFont || 'Arial');


  useEffect(() => {
    wp.ajax.send('simpleform_get_tables', {
      data: {
        nonce: getNonce(),
      },
      success(response) {
        // console.log(response)
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
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    const settings = {
      whatsappRedirection,
      formCustomization,
      floatingwidgets,
      whatsappNumber,
      openInNewTab,
      selectedTable,
      selectedWhatsapp,
      submitbtntext,
      selectedFont,
      formcta,
      formheader,

      flotingwidgetsbgcolor,
      formbackgroundcolor,
      formfieldtextcolor,
      headerbackgroundcolor,
      headertextcolor,
      submitbtntextcolor,
      submitbtnbgcolor,
      submitbtntexthovercolor
    };

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
            settings: settings,
          },

          success({ }) {

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

            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your Form has been saved',
              showConfirmButton: false,
              timer: 1500,
            });
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

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  // console.log(whatsappRedirection == "true" ? true : false);

  return (
    <div className="acb_bottom" id="acb_bottom">
      <div className="acb_left">
        <h3 className="review-case-title">Simple Form settings panel</h3>

        <div className="wpnts-switch-review">
          <label htmlFor="floatingwidgets">Enable floating widgets:</label>
          <ReactSwitchsupport
            // checked={false}
            checked={floatingwidgets}
            className="floatingwidgets"
            name="floatingwidgets"
            id="floatingwidgets"
            onChange={(checked) => setFloating(checked)}
          />
        </div>

        <div className="wpnts-switch-review">
          <label htmlFor="whatsappRedirection">Enable WhatsApp redirection:</label>
          <ReactSwitchreview
            // checked={true}
            // checked={whatsappRedirection === "true" ? true : false}
            checked={whatsappRedirection}
            className="whatsappRedirection"
            name="whatsappRedirection"
            id="whatsappRedirection"
            onChange={(checked) => setWhatsappRedirection(checked)}
          />
        </div>

        <div className="wpnts-switch-review">
          <label htmlFor="formCustomization">Enable Form customization:</label>
          <ReactSwitchreview
            // checked={false}
            checked={formCustomization}
            className="formCustomization"
            name="formCustomization"
            id="formCustomization"
            onChange={(checked) => setformCustomization(checked)}
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
                  value={selectedTable || ''}
                  onChange={(e) => setSelectedTable(parseInt(e.target.value, 10))}
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
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>
            </div>
          )}

          {whatsappRedirection && (
            <div className="sf-customization">
              <div className="formInput open-new-tab">
                <label htmlFor="openinnewtab">Open in new tab</label>
                <input
                  type="checkbox"
                  name="openinnewtab"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                />
              </div>

              <div className="formInput">
                <label htmlFor="selectedWhatsapp">Select Forms for WhatsApp redirection:</label>
                <div className="wpnts-setting">
                  <select
                    id="selectedWhatsapp"
                    name="selectedWhatsapp"
                    multiple
                    value={selectedWhatsapp || []} // Initialize as an empty array
                    onChange={(e) => {
                      const selectedWhatsappid = Array.from(e.target.selectedOptions, (option) => option.value);
                      setSelectedWhatsapp(selectedWhatsappid);
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
                    value={submitbtntext}
                    onChange={(e) => setSubmitbtntext(e.target.value)}
                  />
                </div>
              </div>


              <div className="formInput">
                <label htmlFor="webhook">Form Header text</label>
                <div className="wpnts-setting">
                  <input
                    type="text"
                    name="interval_review"
                    value={formheader}
                    onChange={(e) => setFormheader(e.target.value)}
                  />
                </div>
              </div>

              <div className="formInput">
                <label htmlFor="webhook">Form CTA text</label>
                <div className="wpnts-setting">
                  <input
                    type="text"
                    name="interval_review"
                    value={formcta}
                    onChange={(e) => setFormCTA(e.target.value)}
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
                    value={selectedFont}
                    onChange={handleFontChange}
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
                    value={flotingwidgetsbgcolor}
                    onChange={(e) => setFlotingwidgetsbgcolor(e.target.value)}
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
                    value={headertextcolor}
                    onChange={(e) => setHeadertextcolor(e.target.value)}
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
                    value={headerbackgroundcolor}
                    onChange={(e) => setHeaderbackgroundcolor(e.target.value)}
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
                    value={formbackgroundcolor}
                    onChange={(e) => setFormbackgroundcolor(e.target.value)}
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
                    value={formfieldtextcolor}
                    onChange={(e) => setFormfieldtextcolor(e.target.value)}
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
                    value={submitbtnbgcolor}
                    onChange={(e) => setSubmitbtnbgcolor(e.target.value)}
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
                    value={submitbtntextcolor}
                    onChange={(e) => setSubmitbtntextcolor(e.target.value)}
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
                    value={submitbtntexthovercolor}
                    onChange={(e) => setSubmitbtntexthovercolor(e.target.value)}
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
