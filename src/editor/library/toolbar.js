/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { library, help } from '../../icons';
import Button from '../../components/button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ToolbarButton = props => {
	const { label, onClick, className, isSelected } = props;

	const classes = classnames('maxi-cloud-toolbar__button', className);

	return (
		<Button className={classes} onClick={onClick} aria-pressed={isSelected}>
			{label}
		</Button>
	);
};

const LibraryToolbar = props => {
	const { type, onChange, onRequestClose } = props;

	const buttons = [
		{ label: 'Style Cards', value: 'styleCards' },
		{ label: 'Pages', value: 'pages' },
		{ label: 'Block Patterns', value: 'patterns' },
		{ label: 'Global', value: 'global' },
		{ label: 'Blocks', value: 'blocks' },
		{ label: 'Preview', value: 'preview' },
	];

	const goFullScreen = () => {
		const element = document.getElementsByClassName(
			'components-modal__frame maxi-library-modal__preview'
		)[0];
		const requestMethod =
			element.requestFullScreen ||
			element.webkitRequestFullScreen ||
			element.mozRequestFullScreen ||
			element.msRequestFullScreen;

		if (requestMethod) {
			requestMethod.call(element);
		} else if (typeof window.ActiveXObject !== 'undefined') {
			const script = new ActiveXObject('WScript.Shell');
			if (script !== null) {
				script.SendKeys('{F11}');
			}
		}
	};

	return (
		<div className='maxi-cloud-toolbar'>
			<a className='maxi-cloud-toolbar__logo'>
				{library}
				{type === 'svg' && __('Maxi SVG icons', 'maxi-blocks')}
				{type === 'patterns' && __('Template library', 'maxi-blocks')}
				{type === 'preview' && __('Preview', 'maxi-blocks')}
				{type === 'sc' && __('Style cards', 'maxi-blocks')}
				{type.includes('shape') &&
					__('Maxi cloud shape library', 'maxi-blocks')}
				{type.includes('button') &&
					__('Maxi button icon library', 'maxi-blocks')}
			</a>
			{type === 'preview' && (
				<ToolbarButton
					label={__('Go back', 'maxi-blocks')}
					onClick={onRequestClose}
				/>
			)}
			{type === 'all' && (
				<div>
					{buttons.map(button => (
						<ToolbarButton
							key={`maxi-cloud-toolbar__button__${button.value}`}
							label={button.label}
							onClick={() => onChange(button.value)}
							isSelected={type === button.value}
						/>
					))}
				</div>
			)}
			{type === 'preview' && (
				<ToolbarButton
					label={__('Full Screen', 'maxi-blocks')}
					onClick={goFullScreen}
				/>
			)}
			<a className='maxi-cloud-toolbar__help-button'>
				{help}
				{__('Help', 'maxi-blocks')}
			</a>
		</div>
	);
};

export default LibraryToolbar;
