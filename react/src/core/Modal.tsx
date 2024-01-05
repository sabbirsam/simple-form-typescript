import { FC } from 'react';
import { createPortal } from 'react-dom';
import { Cross } from '../icons';
import CloseIcon from '@mui/icons-material/Close';

import './_modal.scss';

const Modal = ({ onClose, children }) => {
	return createPortal(
		<>
			<div className="modal-overlay" />
			<div className="modal-content">
				<div>
					{/* <button className="modal-close" onClick={onClose}>{Cross}</button> */}
					<button className="modal-close" onClick={onClose}><CloseIcon /></button>
					<div className="modal-body">{children}</div>
				</div>
			</div>

		</>,
		document.getElementById('simpleform-app-portal')
	);
};

export default Modal;
