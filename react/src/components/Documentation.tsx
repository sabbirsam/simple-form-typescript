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
    <Container className="documentation-page-wrap">
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

			{!isProActive() && (<Card><Row middleXs={true}>

				<Column xs="12" sm='6'>
					<div className='get-pro-promo'>
						<h2>Get PRO</h2>
						<p>Get the most out of the plugin. Go Pro!</p>
						<a href="" target="_blank" className="unlock-features button">Unlock all features</a>
						<p className='documention-list'>Link Support to import links from sheet</p>
						<p className='documention-list'>Pre-built amazing table styles where Each styles is different from one another</p>
						<p className='documention-list'>Hide your google sheet table rows based on your custom row selection</p>
						<p className='documention-list'>Unlimited Row Sync and fetch unlimited rows from Google spreadsheet</p>

					</div>
				</Column>
				<Column xs="12" sm='6' textXs='center' textSm='right'>
				</Column>

			</Row></Card>)}
		</Container>
  )
}

export default Documentation
