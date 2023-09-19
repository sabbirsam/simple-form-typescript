import React, { useState, useEffect} from "react";
import ReactSwitchreview from "react-switch";
import ReactSwitchsupport from "react-switch";
import { getNonce, getTables, getFormSettings } from './../Helpers';
import "../styles/_setting.scss";

const Settings = () => {
  const [tables, setTables] = useState(getTables());
  const [formSettings, setSettings] = useState(getFormSettings());


  const [selectedTable, setSelectedTable] = useState(formSettings.selectedTable || null);
  const [selectedWhatsapp, setSelectedWhatsapp] = useState(formSettings.selectedWhatsapp || null);
  const [isProUser, setisProUser] = useState(true);
  const [whatsappRedirection, setWhatsappRedirection] = useState(formSettings.whatsappRedirection === 'true');
  const [mailNotification, setMailNotification] = useState(formSettings.mailNotification === 'true');
  const [floatingwidgets, setFloating] = useState(formSettings.floatingwidgets === 'true');
  const [whatsappNumber, setWhatsappNumber] = useState(formSettings.whatsappNumber || "");
  const [openInNewTab, setOpenInNewTab] = useState(formSettings.openInNewTab === 'true');
  const [recipientMail, setRecipientMail] = useState(formSettings.recipientMail || "");

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
      floatingwidgets,
      whatsappNumber,
      openInNewTab,
      recipientMail,
      selectedTable,
      selectedWhatsapp,
      
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

            success({}) {
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

// console.log(formSettings);
// console.log(formSettings["whatsappRedirection"]);

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
            onChange={(checked) => { if (!isProUser) {  return; } setFloating(checked)}}
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
              if (!isProUser) {  return; }
              setWhatsappRedirection(checked);
            }}
            disabled={!isProUser}
            
          />
        </div>
        <div className="wpnts-switch-support">
          <label htmlFor="supportnoti">Enable mail notification:</label>
          <ReactSwitchsupport
            checked={mailNotification}
            className="supportSwitch-1"
            name="wpnts-switch-support"
            id="supportnoti"
            onChange={(checked) => {
              if (!isProUser) {  return; }
              setMailNotification(checked)
            }}
          />
        </div>

        {!mailNotification && !whatsappRedirection && !floatingwidgets ? (
             <form onSubmit={handleSubmit} id="wpntswebhook">
              <button type="submit" className="save-webhook">SAVE</button>
            </form>
          ) : null}

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
            </div>
          )}

          {mailNotification && (
            <div className="formInput">
              <label htmlFor="interval">Add recipient mail</label>
              <div className="wpnts-setting">
                <input
                  type="email"
                  placeholder="add email to receive mail"
                  name="interval"
                  value={recipientMail}
                  onChange={(e) => setRecipientMail(e.target.value)}
                />
              </div>
            </div>
          )}

          
          {mailNotification || whatsappRedirection || floatingwidgets ? (
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
