<?php
/**
 * Plugin Name: Simple Form
 *
 * @author            wpxpertise, devsabbirahmed
 * @copyright         2022- Sabbir Sam, wpxpertise
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: Simple Form
 * Plugin URI: https://github.com/sabbirsam/Simple-Form/tree/free
 * Description: It's a simple contact form with a drag-and-drop feature that allows you to quickly design and build forms. It's also free to collect leads and deliver them directly to Social site.
 * Version:           2.1.7
 * Requires at least: 5.9 or higher
 * Requires PHP:      5.4 or higher
 * Author:            WPXpertise
 * Author URI:        https://github.com/wpxpertise/
 * Text Domain:       simpleform
 * Domain Path: /languages/
 * License:           GPL v2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * 
 */

defined('ABSPATH') or die('Hey, what are you doing here? You silly human!');

define( 'SIMPLEFORM_VERSION', '2.1.7' );
define( 'SIMPLEFORM_BASE_PATH', plugin_dir_path( __FILE__ ) );
define( 'SIMPLEFORM_BASE_URL', plugin_dir_url( __FILE__ ) );
define( 'SIMPLEFORM_PLUGIN_FILE', __FILE__ );
define( 'SIMPLEFORM_PLUGIN_NAME', 'Simple Form' );

// Define the class and the function.
require_once dirname( __FILE__ ) . '/app/SIMPLEFORM.php';

// Run the plugin.
SIMPLEFORM();