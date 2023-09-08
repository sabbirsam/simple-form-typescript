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
		add_action( 'wp_ajax_simpleform_get_leads', [ $this, 'get_all_leads' ] );

		add_action( 'wp_ajax_simpleform_delete_table', [ $this, 'delete' ] );  
		add_action( 'wp_ajax_simpleform_delete_leads', [ $this, 'delete_leads' ] );  

		add_action( 'wp_ajax_simpleform_edit_table', [ $this, 'edit' ] );
		add_action( 'wp_ajax_simpleform_save_table', [ $this, 'save' ] );

		add_action( 'wp_ajax_simpleform_table_html', [ $this, 'rendertable' ] );
		add_action( 'wp_ajax_simpleform_get_submit_data', [ $this, 'get_submitdata' ] );
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


	public function get_all_leads() {
		if ( ! wp_verify_nonce( $_POST['nonce'], 'SIMPLEFORM-admin-app-nonce-action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', '' )
			]);
		}

		$table_id = ! empty( $_POST['form_id'] ) ? absint( $_POST['form_id'] ) : 0;


		if ( ! $table_id ) {
			wp_send_json_error([
				'message' => __( 'Invalid table to edit.', 'simpleform' )
			]);
		}

		$table = SIMPLEFORM()->database->table->getleads( $table_id );

		// error_log( 'Data Received: ' . print_r( $table, true ) );

		if ( ! $table ) {
			wp_send_json_error([
				'type'   => 'invalid_request',
				'output' => esc_html__( 'Request is invalid', 'simpleform' )
			]);
		}

		wp_send_json_success([
			'tables'       => $table,
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
					'message'      => sprintf( __( '%s form deleted.', '' ), $response ),
					'tables'       => $tables,
					'tables_count' => count( SIMPLEFORM()->database->table->get_all() )
				]);
			}

			wp_send_json_error([
				'message'      => sprintf( __( 'Failed to delete form with id %d' ), $id ),
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

	public function delete_leads() {
		if ( ! wp_verify_nonce( $_POST['nonce'], 'SIMPLEFORM-admin-app-nonce-action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', '' )
			]);
		}

		$id = ! empty( $_POST['id'] ) ? absint( $_POST['id'] ) : false;
		$tables = SIMPLEFORM()->database->table->get_all();

		if ( $id ) {
			$response = SIMPLEFORM()->database->table->deleteleads( $id );

			if ( $response ) {
				wp_send_json_success([
					'message'      => sprintf( __( '%s form deleted.', '' ), $response ),
					'tables'       => $tables,
					'tables_count' => count( SIMPLEFORM()->database->table->get_all() )
				]);
			}

			wp_send_json_error([
				'message'      => sprintf( __( 'Failed to delete form with id %d' ), $id ),
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


	/**
	 * Edit table on ajax request.
	 *
	 * @since 3.0.0
	 */
	public function edit() {
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'SIMPLEFORM-admin-app-nonce-action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', '' )
			]);
		}

		$table_id = ! empty( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;

		// error_log( 'Data Received: ' . print_r( $table_id, true ) );

		if ( ! $table_id ) {
			wp_send_json_error([
				'message' => __( 'Invalid table to edit.', 'simpleform' )
			]);
		}

		$table = SIMPLEFORM()->database->table->get( $table_id );

		if ( ! $table ) {
			wp_send_json_error([
				'type'   => 'invalid_request',
				'output' => esc_html__( 'Request is invalid', 'simpleform' )
			]);
		}

		$settings   = json_decode( $table['form_fields'], true );

		// error_log( 'Data Received: ' . print_r( $settings, true ) );

		wp_send_json_success([
			'form_name'     => esc_attr( $table['form_name'] ),
			'table_settings' => $settings
		]);
	}


	/**
	 * Save table by id.
	 */
	public function save() {
		if ( ! wp_verify_nonce( $_POST['nonce'], 'SIMPLEFORM-admin-app-nonce-action' ) ) {
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

		
		$id = ! empty( $_POST['id'] ) ? absint( $_POST['id'] ) : false;
		$name     = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : __( 'Untitled', 'simpleform' );
		$from_data = isset( $_POST['formdata'] ) ? sanitize_text_or_array_field( $_POST['formdata'] ) : [];

		$table = [
			'id'  => $id ,
			'form_name'     => $name ,
			'form_fields'     => $from_data,
			'time'     => current_time('mysql'),
		];

		// error_log( 'Data Received: ' . print_r( $id, true ) );

		$table_id = SIMPLEFORM()->database->table->update( $id, $table );

		
		wp_send_json_success([
			'id'      => absint( $table_id ),
			'form_name'     => esc_attr( $name ),
			'form_fields' => json_encode( $from_data , true ),
			'message' => __( 'Table updated successfully.', '' ),
			
		]);

	}


	/**
	 * Get Form tables on ajax request.
	 *
	 * @since 3.0.0
	 */
	public function rendertable() {
		if ( ! isset( $_GET['nonce'] ) || ! wp_verify_nonce( $_GET['nonce'], 'simpleform_sheet_nonce_action' ) ) {
			wp_send_json_error([
				'message' => __( 'Invalid nonce.', '' )
			]);
		}
	
		$table_id = ! empty( $_GET['id'] ) ? absint( $_GET['id'] ) : 0;
	
		if ( ! $table_id ) {
			wp_send_json_error([
				'message' => __( 'Invalid table to edit.', 'simpleform' )
			]);
		}
	
		$table = SIMPLEFORM()->database->table->get( $table_id );
	
		if ( ! $table ) {
			wp_send_json_error([
				'type'   => 'invalid_request',
				'output' => esc_html__( 'Request is invalid', 'simpleform' )
			]);
		}
	
		$settings   = json_decode( $table['form_fields'], true );
	
		wp_send_json_success([
			'form_name'     => esc_attr( $table['form_name'] ),
			'table_settings' => $settings
		]);
	}

	/**
	 * Get Form submitted data on ajax request.
	 *
	 * @since 3.0.0
	 */
	public function get_submitdata() {
		if (!wp_verify_nonce($_POST['nonce'], 'simpleform_sheet_nonce_action')) {
			wp_send_json_error([
				'message' => __('Invalid nonce.', 'simpleform')
			]);
		}
		
		// Get the form data from the POST request.
		$id = isset($_POST['id']) ? sanitize_text_field($_POST['id']) : '';
		$form_data = isset($_POST['form_data']) ? json_decode(stripslashes($_POST['form_data']), true) : [];
	
		// error_log('Data Received: ' . print_r($form_data, true));
	
		$table = [
			'form_id' => $id,
			'fields' => $form_data,
			'time' => current_time('mysql'),
		];
	
		$table_id = SIMPLEFORM()->database->table->insertleads($table);
	
		wp_send_json_success([
			'message' => __('Form data received and processed successfully.', 'simpleform'),
			'form_data' => $table,
		]);
	}
	

}