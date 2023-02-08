/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { createPortal } from 'react-dom';

/**
 * Internal dependencies
 */
import Button from '../button';
import Icon from '../icon';

/**
 * Styles and icons
 */
import { closeIcon, dialogIcon } from '../../icons';
import './editor.scss';

const DialogBox = props => {
	return props.isDisabled
		? props.children
		: createPortal(
				<div className='maxi-dialog-box'>
					<div className='maxi-dialog-box-overlay' />
					<div className='maxi-dialog-box-content'>
						<div className='maxi-dialog-box-title'>
							{/* <h4>{__('Confirm', 'maxi-blocks')}</h4> */}
							<Icon icon={dialogIcon} />
						</div>
						<div className='maxi-dialog-box-message'>
							{props.message}
						</div>
						<div className='maxi-dialog-box-buttons'>
							<Button onClick={props.onCancel}>
								{props.cancel}
							</Button>
							<Button onClick={props.onConfirm}>
								{props.confirm}
							</Button>
						</div>
						<div className='maxi-dialog-close-button'>
							<Button
								label={__('Close', 'maxi-blocks')}
								showTooltip
								onClick={props.onCancel}
								icon={closeIcon}
							/>
						</div>
					</div>
				</div>,
				document.getElementById('editor')
		  );
};

export default DialogBox;
