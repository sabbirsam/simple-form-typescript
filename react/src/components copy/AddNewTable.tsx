import React from 'react';
import { Link } from 'react-router-dom';
import { GrayPlusIcon } from '../icons';

function AddNewTable() {
	return (
		<Link
			to="/create-form"
			className="add-new-table btn add-new-table-btn"
		>
			{ GrayPlusIcon }
			Add new form
		</Link>
	);
}

export default AddNewTable;
