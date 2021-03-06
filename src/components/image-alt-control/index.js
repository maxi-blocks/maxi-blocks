/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl, TextControl } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ImageAltControl = props => {
	const {
		className,
		mediaAlt,
		altSelector,
		onChangeAltSelector,
		onChangeMediaAlt,
	} = props;

	const classes = classnames('maxi-image-alt-control', className);

	return (
		<div className={classes}>
			<SelectControl
				label={__('Image Alt Tag', 'maxi-blocks')}
				value={altSelector}
				options={[
					{
						label: __('WordPress Alt', 'maxi-blocks'),
						value: 'wordpress',
					},
					{ label: __('Image Title', 'maxi-blocks'), value: 'title' },
					{ label: __('Custom', 'maxi-blocks'), value: 'custom' },
					{ label: __('None', 'maxi-blocks'), value: 'none' },
				]}
				onChange={value => onChangeAltSelector(value)}
			/>
			{altSelector === 'custom' && (
				<TextControl
					placeholder={__('Add Your Alt Tag Here', 'maxi-blocks')}
					value={mediaAlt || ''}
					onChange={value => onChangeMediaAlt(value)}
				/>
			)}
		</div>
	);
};

export default ImageAltControl;
