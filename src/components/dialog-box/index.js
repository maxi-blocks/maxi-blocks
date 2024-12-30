/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createPortal, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';
import { getIsSiteEditor } from '@extensions/fse';

/**
 * Styles and icons
 */
import { closeIcon, dialogIcon } from '@maxi-icons';
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
		isHidden: isHiddenProp,
		setIsHidden: setIsHiddenProp,
	} = props;

	const [isHiddenState, setIsHiddenState] = useState(true);

	const isHidden = isHiddenProp ?? isHiddenState;
	const setIsHidden = setIsHiddenProp ?? setIsHiddenState;

	const getContainer = () =>
		!getIsSiteEditor()
			? document.getElementById('editor')
			: document.getElementById('site-editor');

	return isHidden ? (
		buttonChildren ? (
			<Button
				disabled={buttonDisabled}
				className={buttonClassName}
				onClick={() => {
					setIsHidden(false);
				}}
			>
				{buttonChildren}
			</Button>
		) : null
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
