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
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * BackgroundColor
 */
const BackgroundColor = props => {
	const { blockName, background, defaultBackground, onChange } = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi' ||
		blockName === 'maxi-blocks/svg-icon-maxi'
	)
		return null;

	const value = !isObject(background) ? JSON.parse(background) : background;

	const defaultValue = !isObject(defaultBackground)
		? JSON.parse(defaultBackground)
		: defaultBackground;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions='background'
			tooltip={__('Background color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background: value.colorOptions.color,
						border: '1px solid #fff',
					}}
				/>
			}
			content={
				<ColorControl
					label={__('Background', 'maxi-blocks')}
					color={value.colorOptions.color}
					defaultColor={defaultValue.colorOptions.color}
					onChange={val => {
						value.colorOptions.color = val;
						value.colorOptions.activeColor = val;
						onChange(JSON.stringify(value));
					}}
				/>
			}
		/>
	);
};

export default BackgroundColor;
