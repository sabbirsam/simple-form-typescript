import React, { useEffect } from 'react';
import Container from '../core/Container';
import Row from '../core/Row';
import Column from '../core/Column';
import Card from '../core/Card';

import { book, videoPlay, support } from './../icons';

import { isProActive, getNonce } from '../Helpers';
import '../styles/_documentation.scss';

const Documentation = () => {
  return (
    	<Container className="documentation-page-wrap documentation-page">
			<Row customClass='documentation-flex-row'>
				<Column lg="3" sm="4">
					<Card customClass='documentation-card'>
						<a href="" target="_blank" className="single-doc-item">
						</a>
						{book}
						<h4>Documentation</h4>
					</Card>
				</Column>

				<Column lg="3" sm="4">
					<Card customClass='documentation-card'>
						<a href="" target="_blank" className="single-doc-item"></a>
						{videoPlay}
						<h4>Video Tutorial</h4>
					</Card>
				</Column>

				<Column lg="3" sm="4">
					<a href="" target="_blank" className="documentation-contact">
						{support}
						<h4>Need more help?</h4>
						<p>Get professional help via our ticketing system</p>
					</a>
				</Column>
			</Row>

		</Container>
  )
}

export default Documentation
