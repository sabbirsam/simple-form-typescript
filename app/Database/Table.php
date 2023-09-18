<?php
/**
 * Managing database operations for tables.
 *
 * @since 3.0.0
 * @package SIMPLEFORM
 */

namespace SIMPLEFORM\Database;

// If direct access than exit the file.
defined( 'ABSPATH' ) || exit;

/**
 * Manages plugin database operations.
 *
 * @since 3.0.0
 */
class Table {

	

	/**
	 * Insert table into the db.
	 *
	 * @param array $data The data to save.
	 * @return int|false
	 */
	public function insert( array $data ) {
		global $wpdb;
		
		// Initialize an array to store the formatted data
		$formatted_data = [];

		// Extract values from the $data array and format them.
		foreach ($data as $key => $value) {
			if ($key === 'form_fields') {
				// Serialize the form_fields array as a JSON string.
				$formatted_data[$key] = json_encode($value);
			} else {
				// Use the %s format for non-array values.
				$formatted_data[$key] = is_array($value) ? '' : $value;
			}
		}


		$table  = $wpdb->prefix . 'simple_form_tables';
		$format = [ '%s', '%s', '%s', '%s' ];

		$wpdb->insert( $table, $formatted_data, $format );
		return $wpdb->insert_id;
	}


	/**
	 * Insert Leads into the db.
	 *
	 * @param array $data The data to save.
	 * @return int|false
	 */
	public function insertleads( array $data ) {
		global $wpdb;
		
		// Initialize an array to store the formatted data
		$formatted_data = [];

		// Extract values from the $data array and format them.
		foreach ($data as $key => $value) {
			if ($key === 'fields') {
				// Serialize the form_fields array as a JSON string.
				$formatted_data[$key] = json_encode($value);
			} else {
				// Use the %s format for non-array values.
				$formatted_data[$key] = is_array($value) ? '' : $value;
			}
		}


		$table  = $wpdb->prefix . 'simple_form_leads';
		$format = [ '%s', '%s', '%s', '%s' ];

		$wpdb->insert( $table, $formatted_data, $format );
		return $wpdb->insert_id;
	}


	/**
	 * Fetch table with specific ID.
	 *
	 * @param  int $id The table id.
	 * @return mixed
	 */
	public function get( int $id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'simple_form_tables';

		$result = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE id=%d", absint( $id ) ), ARRAY_A ); // phpcs:ignore

		return ! is_null( $result ) ? $result : null;
	}

	public function getleads(int $id) {
		global $wpdb;
		$table = $wpdb->prefix . 'simple_form_leads';
	
		$results = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table WHERE form_id = %d", absint($id)), ARRAY_A);
	
		return !empty($results) ? $results : null;
	}
	

	/**
	 * Update table with specific ID.
	 *
	 * @param int   $id The table id.
	 * @param array $data The data to update.
	 */
	public function update( int $id, array $data ) {
		global $wpdb;
		$table = $wpdb->prefix . 'simple_form_tables';

		// Initialize an array to store the formatted data
		$formatted_data = [];

		// Extract values from the $data array and format them.
		foreach ($data as $key => $value) {
			if ($key === 'form_fields') {
				// Serialize the form_fields array as a JSON string.
				$formatted_data[$key] = json_encode($value);
			} else {
				// Use the %s format for non-array values.
				$formatted_data[$key] = is_array($value) ? '' : $value;
			}
		}


		$where  = [ 'id' => $id ];
		$format = [ '%s', '%s', '%s', '%s' ];

		$where_format = [ '%d' ];

		return $wpdb->update( $table, $formatted_data, $where, $format, $where_format );
	}

	/**
	 * Delete table data from the DB.
	 *
	 * @param int $id  The table id to delete.
	 * @return int|false
	 */
	public function delete( int $id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'simple_form_tables';

		return $wpdb->delete( $table, [ 'id' => $id ], [ '%d' ] );
	}

	public function deleteleads( int $id ) {
		global $wpdb;
		$table = $wpdb->prefix . 'simple_form_leads';

		return $wpdb->delete( $table, [ 'id' => $id ], [ '%d' ] );
	}

	/**
	 * Fetch all the saved tables
	 *
	 * @return mixed
	 */
	public function get_all() {
		global $wpdb;

		$table  = $wpdb->prefix . 'simple_form_tables';
		$query  = "SELECT * FROM $table";
		$result = $wpdb->get_results( $query ); // phpcs:ignore

		return $result;
	}


	public function get_settings() {
		$options = get_option('form_settings');
		// return $options ? $options : [];
		if ($options) {
			return $options;
		} else {
			return array(
				'floatingwidgets' => false,
				'mailNotification' => false,
				'openInNewTab' => false,
				'whatsappRedirection' => false,
				'recipientMail' => "",
				'selectedTable' => "",
				'selectedWhatsapp' => "",
				'whatsappNumber' => "",
			);
		}
	}


}