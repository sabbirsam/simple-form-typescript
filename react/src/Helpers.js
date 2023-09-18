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

export function getLicenseUrl() {
	return config.pro.license_url;
}

export function isProInstalled() {
	return config.pro.installed;
}

export function isProActive() {
	return config.pro.active;
}

export function isProLicenseActive() {
	return config.pro.license;
}

export const screenSize = () => {
	// Desktop screen size
	if (screen.width > 740) {
		return "desktop";
	} else {
		return "mobile";
	}
}