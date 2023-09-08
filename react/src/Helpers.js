const config = Object.assign({}, window.SIMPLEFORM_APP);

export function getNonce() {
	return config.nonce;
}

export function getTables() {
	return config.tables;
}



// Default setting once table create.
export function getDefaultSettings() {
	return {	
		table_title: false,
		default_rows_per_page: 10,
		show_info_block: true,
		responsive_table: false,
		show_x_entries: true,
		swap_filter_inputs: false,
		swap_bottom_options: false,
		allow_sorting:false,
		search_bar: true,
		table_export: [],
		vertical_scroll: null,
		cell_format: "expand",
		responsive_style: "default_style",
		redirection_type: "_blank",
		table_cache: false,
		table_style: 'default-style',
		hide_column: [],

		hide_on_desktop:true,
		hide_on_mobile:false,

		hide_rows: [],
		hide_cell: [],
		table_styles: false,
		table_cache: false,
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