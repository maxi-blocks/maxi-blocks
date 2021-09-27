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
} from '../../icons';

/**
 * Components
 */
const ResponsiveSelector = props => {
	const { className, isOpen, onClose } = props;

	const { insertBlock } = useDispatch('core/block-editor');

	const { deviceType, breakpoints } = useSelect(select => {
		const { receiveMaxiDeviceType, receiveMaxiBreakpoints } =
			select('maxiBlocks');

		return {
			deviceType: receiveMaxiDeviceType(),
			breakpoints: receiveMaxiBreakpoints(),
		};
	});

	const { setMaxiDeviceType } = useDispatch('maxiBlocks');

	const addCloudLibrary = () => {
		insertBlock(createBlock('maxi-blocks/maxi-cloud'));
	};

	const classes = classnames('maxi-responsive-selector', className);

	const setScreenSize = size => {
		const xxlSize = select('maxiBlocks').receiveXXLSize();

		if (size === 'general') setMaxiDeviceType('general');
		else
			setMaxiDeviceType(
				size,
				size !== 'xxl' ? breakpoints[size] : xxlSize
			);
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
			</div>
			<MaxiStyleCardsEditorPopUp />
		</div>
	);
};

export default ResponsiveSelector;
