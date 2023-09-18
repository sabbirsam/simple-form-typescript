<?php
/**
 * Represents as plugin base file.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */

namespace SIMPLEFORM {

	// If direct access than exit the file.
	defined( 'ABSPATH' ) || exit;

	/**
	 * Represents as plugin base file.
	 *
	 * @since 2.12.15
	 */
	final class SIMPLEFORM {

		/**
		 * Holds the instance of the plugin currently in use.
		 *
		 * @var SIMPLEFORM\SIMPLEFORM
		 */
		private static $instance = null;

		/**
		 * Contains the helpers methods.
		 *
		 * @var SIMPLEFORM\Helpers
		 */
		public $helpers;

		/**
		 * Contains plugin notices.
		 *
		 * @var SIMPLEFORM\Notices
		 */
		public $notices;

		/**
		 * Contains the plugin assets.
		 *
		 * @var SIMPLEFORM\Assets
		 */
		public $assets;

		/**
		 * Contains the plugin multisite functionalities.
		 *
		 * @var SIMPLEFORM\Multisite
		 */
		public $multisite;

		/**
		 * Contains the admin functionalities.
		 *
		 * @var SIMPLEFORM\Admin
		 */
		public $admin;

		/**
		 * Contains the plugin settings.
		 *
		 * @var SIMPLEFORM\Settings
		 */
		public $settings;

		/**
		 * Contains the plugin settings api.
		 *
		 * @var SIMPLEFORM\SettingsApi
		 */
		public $settingsApi;

		/**
		 * Contains the plugin shortcode.
		 *
		 * @var SIMPLEFORM\Shortcode
		 */
		public $shortcode;
		public $floatingWidgets;

		/**
		 * Contains the plugin database helpers.
		 *
		 * @var SIMPLEFORM\Database
		 */
		public $database;

		/**
		 * Contains the plugin ajax endpoints.
		 *
		 * @var SIMPLEFORM\Ajax
		 */
		public $ajax;

		/**
		 * Main Plugin Instance.
		 *
		 * Insures that only one instance of the addon exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @since  1.0.0
		 * @return SIMPLEFORM\SIMPLEFORM
		 */
		public static function getInstance() {
			if ( null === self::$instance || ! self::$instance instanceof self ) {
				self::$instance = new self();

				self::$instance->init();
			}

			return self::$instance;
		}

		/**
		 * Class constructor.   
		 *
		 * @since 2.12.15
		 */
		public function init() {
			$this->includes();
            $this->loader();

			if ( SIMPLEFORM()->helpers->version_check() ) {
				return;
			}
		}

        /**
		 * Instantiate plugin available classes.
		 *
		 * @since 2.12.15
		 */
		public function includes() {
			$dependencies = [
				'/vendor/autoload.php',
			];

			foreach ( $dependencies as $path ) {
				if ( ! file_exists( SIMPLEFORM_BASE_PATH . $path ) ) {
					status_header( 500 );
					wp_die( esc_html__( 'Plugin is missing required dependencies. Please contact support for more information.', 'simpleform' ) );
				}

				require SIMPLEFORM_BASE_PATH . $path;
			}
		}

		/**
		 * Load plugin classes.
		 *
		 * @since  2.12.15
		 * @return void
		 */
		private function loader() {
			add_action( 'admin_init', [ $this, 'redirection' ] );
			add_filter( 'plugin_action_links_' . plugin_basename( SIMPLEFORM_PLUGIN_FILE ), [ $this, 'add_action_links' ] );

			register_activation_hook( SIMPLEFORM_PLUGIN_FILE, [ $this, 'register_active_deactive_hooks' ] );

			$this->helpers     = new \SIMPLEFORM\Helpers();
			$this->settings    = new \SIMPLEFORM\Settings();
			$this->notices     = new \SIMPLEFORM\Notices();
			$this->multisite   = new \SIMPLEFORM\Multisite();
			$this->assets      = new \SIMPLEFORM\Assets();
			$this->admin       = new \SIMPLEFORM\Admin();
			$this->shortcode   = new \SIMPLEFORM\Shortcode();
			$this->floatingWidgets   = new \SIMPLEFORM\FloatingWidget();
			$this->database    = new \SIMPLEFORM\Database();
			$this->ajax        = new \SIMPLEFORM\Ajax();

		}

		

		/**
		 * Add plugin action links.
		 *
		 * @param array $links The plugin links.
		 * @return array
		 */
		public function add_action_links( $links ) {
			$plugin = [
				sprintf(
					'<a href="%s">%s</a>',
					esc_url( admin_url( 'admin.php?page=simpleform-dashboard' ) ),
					esc_html__( 'Dashboard', 'simpleform' )
				),
				
			];

            // if ( ! $this->helpers->check_pro_plugin_exists() ) {
			// 	array_push(
			// 		$plugin,
			// 		sprintf(
			// 			'<a style="font-weight: bold; color: #ff3b00; text-transform: uppercase; font-style: italic;"
			// 				href="%s"
			// 				target="_blank">%s</a>',
			// 			esc_url( '#' ),
			// 			esc_html__( 'Get Pro', 'sheetstowptable' )
			// 		)
			// 	);
			// }


			return array_merge( $links, $plugin );
		}

		/**
		 * Redirect to admin page on plugin activation
		 *
		 * @since 1.0.0
		 */
		public function redirection() {
			$redirect_to_admin_page = absint( get_option( 'simpleform_activation_redirect', 0 ) );

			if ( 1 === $redirect_to_admin_page ) {
				delete_option( 'simpleform_activation_redirect' );
				wp_safe_redirect( admin_url( 'admin.php?page=simpleform-dashboard' ) );
				// wp_safe_redirect( admin_url( 'admin.php' ) );
				exit;
			}
		}

		/**
		 * Registering activation and deactivation Hooks
		 *
		 * @param int $network_wide The network site ID.
		 * @return void
		 */
		public function register_active_deactive_hooks( $network_wide ) {
			SIMPLEFORM()->database->migration->run( $network_wide );

			add_option( 'simpleform_activation_redirect', 1 );

			if ( ! get_option( 'simpleformActivationTime' ) ) {
				add_option( 'simpleformActivationTime', time() );
			}

			// Review notice options.
			add_option( 'gswptsReviewNotice', false );

			add_option( 'deafaultNoticeInterval', ( time() + 7 * 24 * 60 * 60 ) );


			flush_rewrite_rules();
		}
	}
}

namespace {
	// if direct access than exit the file.
	defined( 'ABSPATH' ) || exit;

	/**
	 * This function is responsible for running the main plugin.
	 *
	 * @since  2.12.15
	 * @return object SIMPLEFORM\SIMPLEFORM The plugin instance.
	 */
	function SIMPLEFORM() {
		return \SIMPLEFORM\SIMPLEFORM::getInstance();
	}
}