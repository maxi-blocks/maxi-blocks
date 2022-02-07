/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Button from '../../components/button';
import Icon from '../../components/icon';
import MaxiStyleCardsEditorPopUp from '../style-cards';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';
import {
	xsMode,
	xlMode,
	xllMode,
	largeMode,
	mediumMode,
	smallMode,
	cloudLib,
	closeIcon,
	helpIcon,
} from '../../icons';

/**
 * Components
 */
const ResponsiveButton = ({
	winBreakpoint,
	icon,
	breakpoint,
	target,
	breakpoints,
}) => {
	const isWinBreakpoint = winBreakpoint === target;

	const classes = classnames(
		'maxi-responsive-selector__button-wrapper',
		isWinBreakpoint && 'maxi-responsive-selector__base'
	);

	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

	const setScreenSize = size => {
		const xxlSize = select('maxiBlocks').receiveXXLSize();

		if (size === 'general') setMaxiDeviceType('general');
		else
			setMaxiDeviceType(
				size,
				size !== 'xxl' ? breakpoints[size] : xxlSize
			);
	};

	const getIsPressed = () => {
		if (breakpoint === 'general') return winBreakpoint === target;

		return breakpoint === target;
	};

	return (
		<div className={classes}>
			<Button
				className='maxi-responsive-selector__button-item'
				onClick={() =>
					setScreenSize(isWinBreakpoint ? 'general' : target)
				}
				aria-pressed={getIsPressed()}
			>
				<div>
					{icon}
					{isWinBreakpoint && (
						<>
							<svg
								className='maxi-tabs-control__notification'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 9 9'
							>
								<path
									fill='#ff4a17'
									d='M4.5 0H9v4.5A4.5 4.5 0 0 1 4.5 9 4.5 4.5 0 0 1 0 4.5 4.5 4.5 0 0 1 4.5 0Z'
								/>
							</svg>
							<div className='maxi-responsive-selector__button-current-size'>
								Your size
							</div>
						</>
					)}
				</div>
			</Button>
		</div>
	);
};

const ResponsiveSelector = props => {
	const { className, isOpen, onClose } = props;

	const { insertBlock } = useDispatch('core/block-editor');

	const { deviceType, breakpoints, winBreakpoint } = useSelect(select => {
		const {
			receiveMaxiDeviceType,
			receiveMaxiBreakpoints,
			receiveWinBreakpoint,
		} = select('maxiBlocks');

		const winBreakpoint = receiveWinBreakpoint();

		return {
			deviceType: receiveMaxiDeviceType(),
			breakpoints: receiveMaxiBreakpoints(),
			winBreakpoint,
		};
	});

	const addCloudLibrary = () => {
		insertBlock(createBlock('maxi-blocks/maxi-cloud'));
	};

	const classes = classnames('maxi-responsive-selector', className);

	return (
		<div className={classes} style={{ display: isOpen ? 'flex' : 'none' }}>
			<ResponsiveButton
				icon={xllMode}
				target='xxl'
				breakpoint={deviceType}
				winBreakpoint={winBreakpoint}
				breakpoints={breakpoints}
			/>
			<ResponsiveButton
				icon={xlMode}
				target='xl'
				breakpoint={deviceType}
				winBreakpoint={winBreakpoint}
				breakpoints={breakpoints}
			/>
			<ResponsiveButton
				icon={largeMode}
				target='l'
				breakpoint={deviceType}
				winBreakpoint={winBreakpoint}
				breakpoints={breakpoints}
			/>
			<ResponsiveButton
				icon={mediumMode}
				target='m'
				breakpoint={deviceType}
				winBreakpoint={winBreakpoint}
				breakpoints={breakpoints}
			/>
			<ResponsiveButton
				icon={smallMode}
				target='s'
				breakpoint={deviceType}
				winBreakpoint={winBreakpoint}
				breakpoints={breakpoints}
			/>
			<ResponsiveButton
				icon={xsMode}
				target='xs'
				breakpoint={deviceType}
				winBreakpoint={winBreakpoint}
				breakpoints={breakpoints}
			/>
			<div className='action-buttons'>
				<Button
					className='action-buttons__button'
					aria-label='Cloud Library'
					onClick={() => addCloudLibrary()}
				>
					<Icon icon={cloudLib} />
					<span>{__('Cloud Library', 'maxi-blocks')}</span>
				</Button>
			</div>
			<MaxiStyleCardsEditorPopUp />
			<Button className='action-buttons__help' href='#'>
				<Icon className='toolbar-item__icon' icon={helpIcon} /> Help
			</Button>
			<span className='maxi-responsive-selector__close' onClick={onClose}>
				<Icon icon={closeIcon} />
			</span>
		</div>
	);
};

export default ResponsiveSelector;
