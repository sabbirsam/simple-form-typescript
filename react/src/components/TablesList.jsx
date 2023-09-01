import Card from '../core/Card';
import React, { useState, useEffect } from 'react';
import { getTables, getNonce } from '../Helpers';

import AddNewTable from './AddNewTable';
import TableItem from './TableItem';

function TablesList({ copiedTables, tables, setCopiedTables, setTableCount, setTables, setLoader }) {

	return (
		<Card customClass="table-item-card">
			{tables &&
				tables.map((table) => (
					<TableItem
						key={table.id}
						table={table}
						setCopiedTables={setCopiedTables}
						setTableCount={setTableCount}
						setTables={setTables}
						setLoader={setLoader}
					/>
				))}

			<div className="add-new-wrapper">
				<AddNewTable />
			</div>
		</Card>
	);
}

export default TablesList;
