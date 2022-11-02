/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { library, help, fullScreen } from '../../icons';
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
	const { type, onChange, onRequestClose, cardId } = props;

	const buttons = [
		{ label: 'Style Cards', value: 'styleCards' },
		{ label: 'Pages', value: 'pages' },
		{ label: 'Block Patterns', value: 'patterns' },
		{ label: 'Global', value: 'global' },
		{ label: 'Blocks', value: 'blocks' },
		{ label: 'Preview', value: 'preview' },
	];

	const goFullScreen = () => {
		const elem = document.getElementsByClassName(
			'components-modal__frame maxi-library-modal__preview'
		)[0];

		if (!document.fullscreenElement) {
			elem.requestFullscreen().catch(err => {
				console.warn(
					`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
				);
			});
		} else {
			document.exitFullscreen();
		}
	};

	const clickLoadButton = id => {
		const button = document.querySelector(
			`#${id} .maxi-cloud-masonry-card__button-load`
		);

		button?.click();
	};

	return (
		<div className='maxi-cloud-toolbar'>
			<a className='maxi-cloud-toolbar__logo'>
				{library}
				{type === 'svg' && __('Icon library', 'maxi-blocks')}
				{type === 'patterns' && __('Template library', 'maxi-blocks')}
				{type === 'preview' && __('Preview', 'maxi-blocks')}
				{type === 'sc' && __('Style cards', 'maxi-blocks')}
				{type.includes('shape') && __('Shape library', 'maxi-blocks')}
				{(type.includes('button') || type.includes('search')) &&
					__('Button icon library', 'maxi-blocks')}
				{type.includes('accordion') &&
					__('Accordion icon library', 'maxi-blocks')}
				{type.includes('video') &&
					__('Video icon library', 'maxi-blocks')}
			</a>
			{type === 'preview' && (
				<>
					<ToolbarButton
						label={__('Go back', 'maxi-blocks')}
						onClick={onRequestClose}
					/>
					<Button icon={fullScreen} onClick={goFullScreen} />
					<ToolbarButton
						label={__('Insert', 'maxi-blocks')}
						onClick={() => {
							clickLoadButton(cardId);
							onRequestClose();
						}}
					/>
				</>
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
			<a className='maxi-cloud-toolbar__help-button'>
				{help}
				{__('Help', 'maxi-blocks')}
			</a>
		</div>
	);
};

export default LibraryToolbar;
