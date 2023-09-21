<?php
/**
 * Responsible for managing plugin admin area.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */

namespace SIMPLEFORM;

// If direct access than exit the file.
defined( 'ABSPATH' ) || exit;

/**
 * Responsible for registering admin menus.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */
class Admin {

	/**
	 * Class constructor.
	 *
	 * @since 2.12.15
	 */
	public function __construct() {
		add_action( 'admin_menu', [ $this, 'admin_menus' ] );
	}

	/**
	 * Registers admin menus.
	 *
	 * @since 2.12.15
	 */
	public function admin_menus() {
		add_menu_page(
			__( 'Simple Form', 'simpleform' ),
			__( 'Simple Form', 'simpleform' ),
			'manage_options',
			'simpleform-dashboard',
			[ $this, 'dashboardPage' ],
			SIMPLEFORM_BASE_URL . 'assets/public/icons/logo.svg'
			// 'dashicons-welcome-widgets-menus'
		);

		if ( current_user_can( 'manage_options' ) ) {
			global $submenu;

			$submenu['simpleform-dashboard'][] = [ __( 'Dashboard', 'simpleform-dashboard' ), 'manage_options', 'admin.php?page=simpleform-dashboard#/' ]; // phpcs:ignore

			$submenu['simpleform-dashboard'][] = [ __( 'Create Form', 'simpleform-dashboard' ), 'manage_options', 'admin.php?page=simpleform-dashboard#/create-form' ]; // phpcs:ignore
		
			$submenu['simpleform-dashboard'][] = [ __( 'Leads', 'simpleform-dashboard' ), 'manage_options', 'admin.php?page=simpleform-dashboard#/Leads' ]; // phpcs:ignore
			
			$submenu['simpleform-dashboard'][] = [ __( 'Settings', 'simpleform-dashboard' ), 'manage_options', 'admin.php?page=simpleform-dashboard#/settings' ]; // phpcs:ignore
		}
	}

	/**
	 * Displays admin page.
	 *
	 * @return void
	 */
	public static function dashboardPage() {
		echo '<div id="simpleform-app-root"></div>';
		echo '<div id="simpleform-app-portal"></div>';
	}

	
	
}