<?php
/**
 * Registering WordPress shortcode for the plugin.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */

namespace SIMPLEFORM;

// If direct access than exit the file.
defined( 'ABSPATH' ) || exit;

/**
 * Responsible for registering shortcode.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */
class Shortcode {

	/**
	 * Class constructor.
	 *
	 * @since 2.12.15
	 */
	public function __construct() {
		add_shortcode( 'simple_form', [ $this, 'shortcode' ] );
	}

	public function shortcode($atts){
		$output = '<h5><b>' . __( 'Form may be deleted or can\'t be loaded.', 'simpleform' ) . '</b></h5><br>';
		$shortcodeID = isset($atts['id']) ? absint($atts['id']) : null;
		$form_id = 'simple_form_' . uniqid(); // Generate a unique ID for each form
	
		if ($shortcodeID !== null) {
			$form_data = SIMPLEFORM()->database->table->get($shortcodeID);
	
			if ($form_data !== null && isset($form_data['id'])) {
				// Generate a unique identifier for the markup element based on the shortcode ID
				$markup_id = 'markup_' . esc_attr($form_id);
	
				$output = '
					<div class="simple_form_container ' . esc_attr($form_id) . '" data-form-id="' . esc_attr($shortcodeID) . '" data-nonce="' . esc_attr(wp_create_nonce('simpleform_sheet_nonce_action')) . '">
						<form class="simple_form" data-form-id="' . esc_attr($shortcodeID) . '" data-nonce="' . esc_attr(wp_create_nonce('simpleform_sheet_nonce_action')) . '">
							<div class="simple_form_content">
								<div class="ui segment simple_form_loader" id="' . esc_attr($markup_id) . '"></div>
								<button type="button" class="submit-button">Submit</button>
							</div>
						</form>
					</div>
					<br><br>
				';
	
				// Pass the unique markup identifier as an attribute to the JavaScript code
				$output .= '<script type="text/javascript">var markupId = "' . esc_js($markup_id) . '";</script>';
			}
		}
	
		return $output;
	}
	
	
	
}