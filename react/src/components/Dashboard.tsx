import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Modal from './../core/Modal';
import { Cloud, WhitePlusIcon, searchIcon } from '../icons';
import '../styles/_table_item.scss';
import Title from '../core/Title';
import TablesList from './TablesList';
import { getNonce, getTables } from './../Helpers';
// Import your image
const cloudImage = require('../../../assets/public/icons/No-form.gif');

import '../styles/_dashboard.scss';
import Card from '../core/Card';

function Dashboard() {
	const [loader, setLoader] = useState<boolean>(false);
	const [tables, setTables] = useState(getTables());
	const [copiedTables, setCopiedTables] = useState(getTables());
	const [searchKey, setSearchKey] = useState<string>('');


	/**
	 * Receving all table data
	 */
	useEffect(() => {
		setLoader(true);
		wp.ajax.send('simpleform_get_tables', {
			data: {
				nonce: getNonce(),
			},
			success(response) {
				// console.log(response.tables) 
				setTables(response.tables);
				setCopiedTables(response.tables);

				setLoader(false);
			},
			error(error) {
				console.error(error);
			},
		});
	}, []);

	/**
	 * Search functionality
	 */
	useEffect(() => {
		if (searchKey !== '') {
			const filtered = tables.filter(({ form_name }: any) =>
				form_name
					.toLowerCase()
					.includes(searchKey.toString().toLowerCase())
			);

			setCopiedTables(filtered);
		} else {
			setCopiedTables(tables);
		}
	}, [searchKey]);

	return (
		<>
			{tables.length < 1 ? (
				<>
					<div className="no-tables-created-intro text-center">
						<div className="no-tables-intro-img"><img style={{ width: '42vh', height: '40vh' }} src={cloudImage} alt="Cloud Icon" /></div>
						<h2>Because you didn't create one</h2>
						<Link className='btn btn-lg' to="/create-form">Add Form</Link>
						<p className="help">
							Need help? <a href="https://youtu.be/1PnGVuAqIxk" target="_blank">Watch Now</a>
						</p>
					</div>
				</>
			) : (
				<>
					<div className="table-header">
						{/* <Title tagName="h4">
							<strong>Total Table: {tableCount}</strong>&nbsp;
						</Title> */}

						<div className="table-search-box">
							<input
								type="text"
								placeholder="Search tables"
								onChange={(e) =>
									setSearchKey(e.target.value.trim())
								}
							/>
							<div className='table-create-form'>
								<Link className="create-table btn btn-md" to="/create-form"	>
									Create form
								</Link>
							</div>
						</div>
					</div>

					{loader ? (
						<Card>
							<h1>Loading...</h1>
						</Card>
					) : (
						<div>
							<TablesList
								tables={copiedTables}
								copiedTables={copiedTables}
								setCopiedTables={setCopiedTables}
								setTables={setTables}
								setLoader={setLoader}
							/>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default Dashboard;
