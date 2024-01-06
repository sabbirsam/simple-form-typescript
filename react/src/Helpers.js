const config = Object.assign({}, window.SIMPLEFORM_APP);

export function getNonce() {
	return config.nonce;
}

export function getTables() {
	return config.tables;
}

export function getFormSettings() {
	return config.formsettings;
}

// Default setting once table create.
export function getDefaultSettings() {
	return {	
		floatingwidgets: false,
		mailNotification: false,
		openInNewTab: false,
		whatsappRedirection: false,
		recipientMail: "",
		selectedTable: "",
		selectedWhatsapp: "",
		whatsappNumber: "",
	};
}