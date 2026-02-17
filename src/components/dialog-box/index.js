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
		children,
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
		children ? (
			<Button
				disabled={buttonDisabled}
				className={buttonClassName}
				onClick={() => {
					setIsHidden(false);
				}}
			>
				{children}
			</Button>
		) : null
	) : (
		createPortal(
			<div className='maxi-dialog-box'>
				<div className='maxi-dialog-box__overlay' />
				<div className='maxi-dialog-box__content'>
					<div className='maxi-dialog-box__title'>
						<Icon icon={dialogIcon} />
					</div>
					<div className='maxi-dialog-box__message'>{message}</div>
					<div className='maxi-dialog-box__buttons'>
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
					<div className='maxi-dialog-box__close-button'>
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
