import React, { useState } from "react";
import ReactSwitchreview from "react-switch";
import ReactSwitchsupport from "react-switch";
import "../styles/_setting.scss";

const Settings = () => {
  const [whatsappRedirection, setWhatsappRedirection] = useState(false);
  const [mailNotification, setMailNotification] = useState(false);
  const [floatingwidgets, setFloating] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [recipientMail, setRecipientMail] = useState("");

  const isSaveButtonDisabled = !whatsappRedirection && !mailNotification;

  const handleSubmit = (e) => {
    e.preventDefault();
    const settings = {
      whatsappRedirection,
      mailNotification,
      floatingwidgets,
      whatsappNumber,
      openInNewTab,
      recipientMail,
    };
    console.log("Settings:", settings);
  };

  return (
    <div className="acb_bottom" id="acb_bottom">
      <div className="acb_left">
        <h3 className="review-case-title">Simple Form settings panel</h3>
        <div className="wpnts-switch-review">
          <label htmlFor="reviewnoti">Enable WhatsApp redirection:</label>
          <ReactSwitchreview
            checked={whatsappRedirection}
            className="reviewSwitch"
            name="wpnts-switch-review"
            id="reviewnoti"
            onChange={(checked) => setWhatsappRedirection(checked)}
          />
        </div>
        <div className="wpnts-switch-support">
          <label htmlFor="supportnoti">Enable mail notification:</label>
          <ReactSwitchsupport
            checked={mailNotification}
            className="supportSwitch-1"
            name="wpnts-switch-support"
            id="supportnoti"
            onChange={(checked) => setMailNotification(checked)}
          />
        </div>

        <div className="wpnts-switch-floating">
          <label htmlFor="floating-widgets">Enable floating widgets:</label>
          <ReactSwitchsupport
            checked={floatingwidgets}
            className="supportSwitch-2"
            name="wpnts-switch-floating"
            id="floating-widgets"
            onChange={(checked) => setFloating(checked)}
          />
        </div>

      </div>
      <div className="acb_right">
        <form onSubmit={handleSubmit} id="wpntswebhook">
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
          {mailNotification || whatsappRedirection ? (
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
