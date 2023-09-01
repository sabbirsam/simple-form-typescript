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
 * Responsible for handling table operations.
 *
 * @since 2.12.15
 * @package SIMPLEFORM
 */
class Tables {

	/**
	 * Class constructor.
	 *
	 * @since 2.12.15
	 */
	public function __construct() {
		add_action( 'wp_ajax_simpleform_create_form', [ $this, 'create' ] );
		add_action( 'wp_ajax_simpleform_get_tables', [ $this, 'get_all' ] );
		add_action( 'wp_ajax_simpleform_delete_table', [ $this, 'delete' ] );  

		/* add_action( 'wp_ajax_simpleform_sheet_create', [ $this, 'sheet_creation' ] );
		add_action( 'wp_ajax_nopriv_simpleform_sheet_create', [ $this, 'sheet_creation' ] );
		add_action( 'wp_ajax_simpleform_manage_tab_toggle', [ $this, 'tabNameToggle' ] );
		add_action( 'wp_ajax_simpleform_ud_table', [ $this, 'update_name' ] );

		add_action( 'wp_ajax_simpleform_edit_table', [ $this, 'edit' ] );
		add_action( 'wp_ajax_simpleform_save_table', [ $this, 'save' ] );
		add_action( 'wp_ajax_simpleform_sheet_fetch', [ $this, 'get' ] );
		add_action( 'wp_ajax_nopriv_simpleform_sheet_fetch', [ $this, 'get' ] );
		add_action( 'wp_ajax_simpleform_get_table_preview', [ $this, 'get_table_preview' ] ); */
	}

	/**
	 * Create table on ajax request.
	 *
	 * @since 3.0.0
	 */
	public function create() {
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'SIMPLEFORM-admin-app-nonce-action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', '' )
			]);
		}

		function sanitize_text_or_array_field($array_or_string) {
			if( is_string($array_or_string) ){
				$array_or_string = sanitize_text_field($array_or_string);
			}elseif( is_array($array_or_string) ){
				foreach ( $array_or_string as $key => &$value ) {
					if ( is_array( $value ) ) {
						$value = sanitize_text_or_array_field($value);
					}
					else {
						$value = sanitize_text_field( $value );
					}
				}
			} 
			return $array_or_string;
		}

		$name     = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : __( 'Untitled', 'simpleform' );
		$from_data = isset( $_POST['formdata'] ) ? sanitize_text_or_array_field( $_POST['formdata'] ) : [];

		// error_log( 'Data Received: ' . print_r( $from_data, true ) );
		
		$table = [
			'form_name'     => $name ,
			'form_fields'     => $from_data,
			'time'     => current_time('mysql'),
		];

		$table_id = SIMPLEFORM()->database->table->insert( $table );

		
		wp_send_json_success([
			'id'      => absint( $table_id ),
			'form_name'      => $name,
			'form_fields'     => $from_data,
			'message' => esc_html__( 'Table created successfully', 'simpleform' ),
		]);
	}


	/**
	 * Get all tables on ajax request.
	 *
	 * @since 3.0.0
	 */
	public function get_all() {
		if ( ! wp_verify_nonce( $_POST['nonce'], 'SIMPLEFORM-admin-app-nonce-action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', '' )
			]);
		}

		$tables = SIMPLEFORM()->database->table->get_all();

	
		wp_send_json_success([
			'tables'       => $tables,
			'tables_count' => count( $tables )
		]);

	}


	/**
	 * Delete table by id.
	 *
	 * @param  int $id The table ID.
	 * @return int|false
	 */
	public function delete() {
		if ( ! wp_verify_nonce( $_POST['nonce'], 'SIMPLEFORM-admin-app-nonce-action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', '' )
			]);
		}

		$id = ! empty( $_POST['id'] ) ? absint( $_POST['id'] ) : false;
		$tables = SIMPLEFORM()->database->table->get_all();

		if ( $id ) {
			$response = SIMPLEFORM()->database->table->delete( $id );

			if ( $response ) {
				wp_send_json_success([
					'message'      => sprintf( __( '%s table deleted.', '' ), $response ),
					'tables'       => $tables,
					'tables_count' => count( SIMPLEFORM()->database->table->get_all() )
				]);
			}

			wp_send_json_error([
				'message'      => sprintf( __( 'Failed to delete table with id %d' ), $id ),
				'tables'       => $tables,
				'tables_count' => count( SIMPLEFORM()->database->table->get_all() )
			]);
		}


		wp_send_json_error([
			'message'      => sprintf( __( 'Invalid table to perform delete.' ), $id ),
			'tables'       => $tables,
			'tables_count' => count( SIMPLEFORM()->database->table->get_all() )
		]);
	}


}