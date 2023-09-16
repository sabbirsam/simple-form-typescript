<?php
/**
 * Responsible for enqueuing assets.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */

namespace SIMPLEFORM;

// If direct access than exit the file.
defined( 'ABSPATH' ) || exit;

/**
 * Responsible for enqueuing assets.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */
class Assets {

	/**
	 * Class constructor.
	 *
	 * @since 2.12.15
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', [ $this, 'admin_scripts' ] );
		add_filter( 'the_content', [ $this, 'load_assets_for_shortcode' ] );
	}

	/**
	 * Enqueue backend files.
	 *
	 * @since 2.12.15
	 */
	public function admin_scripts() {
		$current_screen = get_current_screen();

		if ( 'toplevel_page_simpleform-dashboard' === $current_screen->id ) {
			// We don't want any plugin adding notices to our screens. Let's clear them out here.
			remove_all_actions( 'admin_notices' );
			remove_all_actions( 'all_admin_notices' );

			$this->formTableScripts();

			$dependencies = require_once SIMPLEFORM_BASE_PATH . 'react/build/index.asset.php';
			$dependencies['dependencies'][] = 'wp-util';

			wp_enqueue_style(
				'SIMPLEFORM-admin',
				SIMPLEFORM_BASE_URL . 'assets/admin.css',
				'',
				'1.0.0',
				'all'
			);

			if ( ! SIMPLEFORM()->helpers->is_pro_active() ) {
			
			}

			wp_enqueue_style(
				'SIMPLEFORM-app',
				SIMPLEFORM_BASE_URL . 'react/build/index.css',
				'',
				'1.0.0',
				'all'
			);

			wp_enqueue_script(
				'SIMPLEFORM-app',
				SIMPLEFORM_BASE_URL . 'react/build/index.js',
				$dependencies['dependencies'],
				'1.0.0',
				true
			);

			$icons = apply_filters( 'export_buttons_logo_backend', false );

			$localize = [
				'nonce'            => wp_create_nonce( 'SIMPLEFORM-admin-app-nonce-action' ),
				'icons'            => $icons,
				'tables'           => SIMPLEFORM()->database->table->get_all(),
				'ran_setup_wizard' => wp_validate_boolean( get_option( 'SIMPLEFORM_ran_setup_wizard', false ) )
			];

			wp_localize_script(
				'SIMPLEFORM-app',
				'SIMPLEFORM_APP',
				$localize
			);

			wp_enqueue_script(
				'SIMPLEFORM-admin-js',
				SIMPLEFORM_BASE_URL . 'assets/public/scripts/backend/admin.min.js',
				[ 'jquery' ],
				SIMPLEFORM_VERSION,
				true
			);

		}
	}

	/**
	 * Load assets for shortcode
	 *
	 * @param  mixed $content The page content.
	 * @return mixed
	 */
	public function load_assets_for_shortcode( $content ) {

		// Check if the page contains the desired shortcode.
		$shortcode = 'simple_form';

		if ( has_shortcode( $content, $shortcode ) ) {
			$this->frontend_scripts();
		}

		if ( wp_validate_boolean( did_action( 'elementor/loaded' ) ) ) {
			global $post;
			$isBuiltWithElementor = \Elementor\Plugin::$instance->documents->get( $post->ID )->is_built_with_elementor();
			if ($isBuiltWithElementor) {
				if (has_shortcode($post->post_content, 'simple_form')) {
					$this->frontend_scripts();
				}
			}
			/* if ( is_admin() && defined( 'ELEMENTOR_PATH' ) && \Elementor\Plugin::$instance->editor->is_edit_mode() ) {} */
		}

		return $content;
	}

	/**
	 * Enqueue frontend files.
	 *
	 * @since 2.12.15
	 */
	public function frontend_scripts() {
	
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


	/**
	 * Enqueue data tables scripts.
	 *
	 * @since 2.12.15
	 */
	public function formTableScripts() {
		wp_enqueue_script(
			'simpleform-sweet-alert-js',
			SIMPLEFORM_BASE_URL . 'assets/public/library/sweetalert2@11.js',
			[ 'jquery' ],
			SIMPLEFORM_VERSION,
			true
		);
		
	}

}