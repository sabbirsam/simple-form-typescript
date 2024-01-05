<?php
/**
 * Responsible for managing ajax endpoints.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */

namespace SIMPLEFORM\Ajax;

// If direct access than exit the file.
defined( 'ABSPATH' ) || exit;

/**
 * Manage notices.
 *
 * @since 2.12.15
 */
class Settings {

	/**
	 * Class constructor.
	 *
	 * @since 2.12.15
	 */
	public function __construct() {
		add_action( 'wp_ajax_simpleform_get_settings', [ $this, 'get' ] );
		add_action( 'wp_ajax_simpleform_save_settings', [ $this, 'save' ] );
	}

	/**
	 * Get function.
	 *
	 * @since 2.12.15
	 */
	public function get() {
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'simpleform-admin-app-nonce-action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', 'simpleform' ),
			]);
		}

		wp_send_json_success([
			'async' => get_option( 'asynchronous_loading', false ),
			'css'   => get_option( 'css_code_value' ),
		]);
	}

	public function save() {
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'simpleform-admin-app-nonce-action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', 'simpleform' ),
			]);
		}

		// $settings = ! empty( $_POST['settings'] ) ? json_decode( wp_unslash( $_POST['settings'] ), true ) : false;
		$settings = ! empty( $_POST['settings'] ) ? json_decode( wp_unslash( sanitize_text_field( $_POST['settings'] ) ), true ) : false;


		update_option( 'asynchronous_loading', sanitize_text_field( $settings['async_loading'] ) );
		update_option( 'css_code_value', sanitize_text_field( $settings['css_code_value'] ) );

		wp_send_json_success([
			'message' => __( 'Settings saved successfully.', 'simpleform' ),
			'async' => get_option( 'asynchronous_loading', false ),
			'css'   => get_option( 'css_code_value' ),
		]);
	}
}
