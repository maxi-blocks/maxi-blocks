/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createPortal, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../button';
import Icon from '../icon';
import { getIsSiteEditor } from '../../extensions/fse';

/**
 * Styles and icons
 */
import { closeIcon, dialogIcon } from '../../icons';
import './editor.scss';

const DialogBox = props => {
	const {
		message,
		cancelLabel,
		confirmLabel,
		onConfirm,
		buttonDisabled,
		buttonClassName,
		buttonChildren,
	} = props;

	const [isHidden, setIsHidden] = useState(true);

	const getContainer = () =>
		!getIsSiteEditor()
			? document.getElementById('editor')
			: document.getElementById('site-editor');

	return isHidden ? (
		<Button
			disabled={buttonDisabled}
			className={buttonClassName}
			onClick={() => {
				setIsHidden(false);
			}}
		>
			{buttonChildren}
		</Button>
	) : (
		createPortal(
			<div className='maxi-dialog-box'>
				<div className='maxi-dialog-box__overlay' />
				<div className='maxi-dialog-box__content'>
					<div className='maxi-dialog-box-title'>
						<Icon icon={dialogIcon} />
					</div>
					<div className='maxi-dialog-box-message'>{message}</div>
					<div className='maxi-dialog-box-buttons'>
						<Button onClick={() => setIsHidden(true)}>
							{cancelLabel}
						</Button>
						<Button
							onClick={() => {
								onConfirm();
								setIsHidden(true);
							}}
						>
							{confirmLabel}
						</Button>
					</div>
					<div className='maxi-dialog-close-button'>
						<Button
							label={__('Close', 'maxi-blocks')}
							showTooltip
							onClick={() => setIsHidden(true)}
							icon={closeIcon}
						/>
					</div>
				</div>
			</div>,
			getContainer()
		)
	);
};

export default DialogBox;
