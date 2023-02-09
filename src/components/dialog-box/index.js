/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createPortal } from '@wordpress/element';

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
	const {
		isDisabled,
		children,
		message,
		onCancel,
		cancel,
		onConfirm,
		confirm,
	} = props;

	return isDisabled
		? children
		: createPortal(
				<div className='maxi-dialog-box'>
					<div className='maxi-dialog-box__overlay' />
					<div className='maxi-dialog-box__content'>
						<div className='maxi-dialog-box-title'>
							<Icon icon={dialogIcon} />
						</div>
						<div className='maxi-dialog-box-message'>{message}</div>
						<div className='maxi-dialog-box-buttons'>
							<Button onClick={onCancel}>{cancel}</Button>
							<Button onClick={onConfirm}>{confirm}</Button>
						</div>
						<div className='maxi-dialog-close-button'>
							<Button
								label={__('Close', 'maxi-blocks')}
								showTooltip
								onClick={onCancel}
								icon={closeIcon}
							/>
						</div>
					</div>
				</div>,
				document.getElementById('editor')
		  );
};

export default DialogBox;
