/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';

/**
 * Styles
 */
import './editor.scss';

/**
 * BackgroundColor
 */
const BackgroundColor = props => {
	const { blockName, onChange } = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi' ||
		blockName === 'maxi-blocks/svg-icon-maxi'
	)
		return null;

	const background = { ...props.background };
	const defaultBackground = { ...props.defaultBackground };

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions='background'
			tooltip={__('Background color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background: background.colorOptions.color,
						border: '1px solid #fff',
					}}
				/>
			}
			content={
				<ColorControl
					label={__('Background', 'maxi-blocks')}
					color={background.colorOptions.color}
					defaultColor={defaultBackground.colorOptions.color}
					onChange={val => {
						background.colorOptions.color = val;
						background.colorOptions.activeColor = val;
						onChange(background);
					}}
				/>
			}
		/>
	);
};

export default BackgroundColor;
