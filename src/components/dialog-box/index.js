/**
 * External dependencies
 */
import { createPortal } from 'react-dom';
/**
 * Internal dependencies
 */
import Button from '../button';
import './editor.scss';

const DialogBox = props => {
	return props.isDisabled ? (
		<div className='maxi-dialog-box-disabled'>{props.children}</div>
	) : (
		createPortal(
			<div className='maxi-dialog-box'>
				<div className='maxi-dialog-box-overlay' />
				<div className='maxi-dialog-box-content'>
					<div className='maxi-dialog-box-message'>
						{props.message}
					</div>
					<div className='maxi-dialog-box-buttons'>
						<Button onClick={props.onCancel}>{props.cancel}</Button>
						<Button onClick={props.onConfirm}>
							{props.confirm}
						</Button>
					</div>
				</div>
			</div>,
			document.getElementById('editor')
		)
	);
};

export default DialogBox;
