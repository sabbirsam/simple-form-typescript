import React, { useState, useEffect } from "react";
import ReactSwitchreview from "react-switch";
import ReactSwitchsupport from "react-switch";
import { getNonce, getTables, getFormSettings } from './../Helpers';
import "../styles/_setting.scss";
const Settingsicon = require('../../../assets/public/icons/Settings.gif');

const Settings = () => {
  const [tables, setTables] = useState(getTables());
  const [formSettings, setSettings] = useState(getFormSettings());


  const [selectedTable, setSelectedTable] = useState(formSettings.selectedTable || null);
  const [selectedWhatsapp, setSelectedWhatsapp] = useState(formSettings.selectedWhatsapp || null);
  const [isProUser, setisProUser] = useState(true);
  const [whatsappRedirection, setWhatsappRedirection] = useState(formSettings.whatsappRedirection === 'true');
  const [formCustomization, setformCustomization] = useState(formSettings.formCustomization === 'true');
  const [mailNotification, setMailNotification] = useState(formSettings.mailNotification === 'true');
  const [floatingwidgets, setFloating] = useState(formSettings.floatingwidgets === 'true');
  const [whatsappNumber, setWhatsappNumber] = useState(formSettings.whatsappNumber || "");
  const [openInNewTab, setOpenInNewTab] = useState(formSettings.openInNewTab === 'true');
  const [recipientMail, setRecipientMail] = useState(formSettings.recipientMail || "");
  const [submitbtntext, setSubmitbtntext] = useState(formSettings.submitbtntext || 'Send');
  const [formheader, setFormheader] = useState(formSettings.formheader || "");
  const [formcta, setFormCTA] = useState(formSettings.formcta || "");

  const [submitbtnbgcolor, setSubmitbtnbgcolor] = useState(formSettings.submitbtnbgcolor || "");
  const [flotingwidgetsbgcolor, setFlotingwidgetsbgcolor] = useState(formSettings.flotingwidgetsbgcolor || "");
  const [submitbtntextcolor, setSubmitbtntextcolor] = useState(formSettings.submitbtntextcolor || "");
  const [submitbtntexthovercolor, setSubmitbtntexthovercolor] = useState(formSettings.submitbtntexthovercolor || "");
  const [selectedFont, setSelectedFont] = useState(formSettings.selectedFont || "");
  const isSaveButtonDisabled = !whatsappRedirection && !mailNotification;

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


  const handleSubmit = (e) => {
    e.preventDefault();
    const settings = {
      whatsappRedirection,
      mailNotification,
      formCustomization,
      floatingwidgets,
      whatsappNumber,
      openInNewTab,
      recipientMail,
      selectedTable,
      selectedWhatsapp,
      flotingwidgetsbgcolor,
      submitbtntext,
      formheader,
      submitbtnbgcolor,
      submitbtntextcolor,
      selectedFont,
      formcta

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

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  return (
    <div className="acb_bottom" id="acb_bottom">
      {/* <h3 className="upcomming">UPCOMMING</h3> */}
      <div className="acb_left">
        <h3 className="review-case-title">Simple Form settings panel</h3>

        <div className="wpnts-switch-floating">
          <label htmlFor="floating-widgets">Enable floating widgets:</label>
          <ReactSwitchsupport
            checked={floatingwidgets}
            className="supportSwitch-2"
            name="wpnts-switch-floating"
            id="floating-widgets"
            onChange={(checked) => { if (!isProUser) { return; } setFloating(checked) }}
          //onChange={(checked) => setFloating(checked)}
          />
        </div>

        <div className="wpnts-switch-review">
          <label htmlFor="reviewnoti">Enable WhatsApp redirection:</label>
          <ReactSwitchreview
            checked={whatsappRedirection}
            className="reviewSwitch"
            name="wpnts-switch-review"
            id="reviewnoti"
            onChange={(checked) => {
              if (!isProUser) { return; }
              setWhatsappRedirection(checked);
            }}
            disabled={!isProUser}

          />
        </div>


        <div className="wpnts-switch-review">
          <label htmlFor="reviewnoti">Enable Form customization:</label>
          <ReactSwitchreview
            checked={formCustomization}
            className="customizationSwitch"
            name="wpnts-switch-review"
            id="form-customization"
            onChange={(checked) => {
              if (!isProUser) { return; }
              setformCustomization(checked);
            }}
            disabled={!isProUser}

          />
        </div>


        {/* {!mailNotification && !whatsappRedirection && !floatingwidgets ? ( */}
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
            <div>
              <div className="formInput open-new-tab">
                <label htmlFor="interval_review">Open in new tab</label>
                <div className="wpnts-setting">
                  <input
                    type="checkbox"
                    name="interval_review"
                    checked={openInNewTab}
                    onChange={(e) => setOpenInNewTab(e.target.checked)}
                  />
                </div>
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
                  {/* {selectedFont && (
                      <p style={{ fontFamily: selectedFont, fontSize:'15px' }}>Selected font: {selectedFont}</p>
                    )} */}
                </div>

              </div>

              <div className="formInput open-new-tab">
                <label htmlFor="interval_review">Floting widgets color</label>
                <div className="wpnts-setting">
                  <input
                    className="FlotingSelectionbg"
                    type="color"
                    name="interval_review"
                    value={flotingwidgetsbgcolor}
                    onChange={(e) => setFlotingwidgetsbgcolor(e.target.value)}
                  />
                </div>
              </div>


              <div className="formInput open-new-tab">
                <label htmlFor="interval_review">Submit button BG color</label>
                <div className="wpnts-setting">
                  <input
                    className="colorSelectionbg"
                    type="color"
                    name="interval_review"
                    value={submitbtnbgcolor}
                    onChange={(e) => setSubmitbtnbgcolor(e.target.value)}
                  />
                </div>
              </div>

              <div className="formInput open-new-tab">
                <label htmlFor="interval_review">Submit button text color</label>
                <div className="wpnts-setting">
                  <input
                    className="colorSelectiontext"
                    type="color"
                    name="interval_review"
                    value={submitbtntextcolor}
                    onChange={(e) => setSubmitbtntextcolor(e.target.value)}
                  />
                </div>
              </div>

              <div className="formInput open-new-tab">
                <label htmlFor="interval_review">Submit button hover color</label>
                <div className="wpnts-setting">
                  <input
                    className="colorSelectionhover"
                    type="color"
                    name="interval_review"
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

      <div className="acb_right_two">
        {/* HERE  */}

        {/* HERE  */}
      </div>
    </div>
  );
};

export default Settings;
