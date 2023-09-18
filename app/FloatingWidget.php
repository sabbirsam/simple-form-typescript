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
class FloatingWidget  {

	/**
	 * Class constructor.
	 *
	 * @since 2.12.15
	 */
	public function __construct() {
        add_action( 'wp_enqueue_scripts', [ $this, 'simple_form_public_chat' ] );
		add_action('wp_footer', [ $this, 'display_floating_widget' ]);
	}

    public function simple_form_public_chat() {

		$options = get_option('form_settings');

		if (isset($options['floatingwidgets']) && $options['floatingwidgets'] === 'true') {

			wp_enqueue_style(
				'simpleform-frontend-css',
				SIMPLEFORM_BASE_URL . 'assets/public/styles/frontend.scss',
				[],
				SIMPLEFORM_VERSION,
				'all'
			);

			wp_enqueue_script(
				'simpleform-frontend-js',
				SIMPLEFORM_BASE_URL . 'assets/public/scripts/frontend/frontend.min.js',
				[ 'jquery', 'jquery-ui-draggable' ],
				SIMPLEFORM_VERSION,
				true
			);

			wp_enqueue_script(
				'simpleform-sweet-alert-js',
				SIMPLEFORM_BASE_URL . 'assets/public/library/sweetalert2@11.js',
				[ 'jquery' ],
				SIMPLEFORM_VERSION,
				true
			);
			

			$iconsURLs = apply_filters( 'export_buttons_logo_frontend', false );

			wp_localize_script('simpleform-frontend-js', 'front_end_data', [
				'admin_ajax'           => esc_url( admin_url( 'admin-ajax.php' ) ),
				'isProActive'          => SIMPLEFORM()->helpers->is_pro_active(),
				'iconsURL'             => $iconsURLs,
				'nonce'                => wp_create_nonce( 'simpleform_sheet_nonce_action' )
			]);
		}

    }

	public function display_floating_widget() {
		// Get the options from the options table
		$options = get_option('form_settings');
	
		// Check if floatingwidgets is true and selectedTable is set
		if (isset($options['floatingwidgets']) && $options['floatingwidgets'] === 'true' && isset($options['selectedTable'])) {
			
			$selectedTable = $options['selectedTable'];
			$output = '
			<div class="floating-whatsapp">
				<button type="button" class="whatsapp-icon">&#x1F4AC;</button>
				<div class="form-content">    
					<div class="simple_form_container ' . esc_attr($selectedTable) . '" data-form-id="' . esc_attr($selectedTable) . '" data-nonce="' . esc_attr(wp_create_nonce('simpleform_sheet_nonce_action')) . '">
						<form class="simple_form" data-form-id="' . esc_attr($selectedTable) . '" data-nonce="' . esc_attr(wp_create_nonce('simpleform_sheet_nonce_action')) . '">
							<div class="simple_form_content">
								<div class="ui segment simple_form_loader" id="' . esc_attr($selectedTable) . '"></div>
								<br>
								<button type="button" class="submit-button">Submit</button>
							</div>
						</form>
					</div>
				</div>
			</div>';
	
			$output .= '<script type="text/javascript">var markupId = "' . esc_js($selectedTable) . '";</script>';
			echo $output;
		}
	}
	
}