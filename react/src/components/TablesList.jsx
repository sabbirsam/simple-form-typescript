import Card from '../core/Card';
import React, { useState, useEffect } from 'react';
import { getTables, getNonce } from '../Helpers';

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
		</Card>
	);
}

export default TablesList;
