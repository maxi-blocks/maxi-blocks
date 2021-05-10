/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Button from '../../components/button';

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
	globalOptions,
} from '../../icons';

/**
 * Components
 */
const ResponsiveSelector = props => {
	const { className, isOpen, onClose } = props;

	const addCloudLibrary = () => {
		insertBlock(createBlock('maxi-blocks/maxi-cloud'));
	};

	const { insertBlock } = useDispatch('core/block-editor');

	const { deviceType, breakpoints } = useSelect(select => {
		const { receiveMaxiDeviceType, receiveMaxiBreakpoints } = select(
			'maxiBlocks'
		);

		return {
			deviceType: receiveMaxiDeviceType(),
			breakpoints: receiveMaxiBreakpoints(),
		};
	});

	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

	const classes = classnames('maxi-responsive-selector', className);

	const setScreenSize = size => {
		const editorWrapper = document.querySelector(
			'.edit-post-visual-editor.editor-styles-wrapper'
		);
		const winHeight = window.outerWidth;
		const responsiveWidth =
			(size === 'general' && 'none') ||
			(size === 'xxl' && 2000) ||
			breakpoints[size];

		editorWrapper.setAttribute('maxi-blocks-responsive', size);
		editorWrapper.setAttribute(
			'maxi-blocks-responsive-width',
			responsiveWidth
		);

		if (size === 'general') {
			editorWrapper.style.width = '';
			editorWrapper.style.margin = '';

			setMaxiDeviceType('general');
		} else {
			const xxlSize = 2000; // Temporary value, needs to be fixed

			setMaxiDeviceType(
				size,
				size !== 'xxl' ? breakpoints[size] : xxlSize
			);

			if (size !== 'xxl')
				editorWrapper.style.width = `${breakpoints[size]}px`;
			else editorWrapper.style.width = `${xxlSize}px`;

			if (winHeight > breakpoints[size])
				editorWrapper.style.margin = '36px auto';
			else editorWrapper.style.margin = '';
		}
	};

	return (
		<div className={classes} style={{ display: isOpen ? 'block' : 'none' }}>
			<span className='maxi-responsive-selector__close' onClick={onClose}>
				X
			</span>
			<Button
				className='maxi-responsive-selector__button'
				onClick={() => setScreenSize('general')}
				aria-pressed={deviceType === 'general'}
			>
				{__('Base', 'maxi-blocks')}
			</Button>
			<Button
				className='maxi-responsive-selector__button'
				onClick={() => setScreenSize('xxl')}
				aria-pressed={deviceType === 'xxl'}
			>
				{xllMode}
			</Button>
			<Button
				className='maxi-responsive-selector__button'
				onClick={() => setScreenSize('xl')}
				aria-pressed={deviceType === 'xl'}
			>
				{xlMode}
			</Button>
			<Button
				className='maxi-responsive-selector__button'
				onClick={() => setScreenSize('l')}
				aria-pressed={deviceType === 'l'}
			>
				{largeMode}
			</Button>
			<Button
				className='maxi-responsive-selector__button'
				onClick={() => setScreenSize('m')}
				aria-pressed={deviceType === 'm'}
			>
				{mediumMode}
			</Button>
			<Button
				className='maxi-responsive-selector__button'
				onClick={() => setScreenSize('s')}
				aria-pressed={deviceType === 's'}
			>
				{smallMode}
			</Button>
			<Button
				className='maxi-responsive-selector__button'
				onClick={() => setScreenSize('xs')}
				aria-pressed={deviceType === 'xs'}
			>
				{xsMode}
			</Button>
			<div className='action-buttons'>
				<Button
					className='action-buttons__button'
					aria-label='Cloud Library'
					onClick={() => addCloudLibrary()}
				>
					<Icon icon={cloudLib} />
					<span>{__('Cloud Library', 'maxi-blocks')}</span>
				</Button>
				<Button
					className='action-buttons__button'
					aria-label='Global Styles'
				>
					<Icon icon={globalOptions} />
					<span>{__('Global Styles', 'maxi-blocks')}</span>
				</Button>
			</div>
		</div>
	);
};

export default ResponsiveSelector;
