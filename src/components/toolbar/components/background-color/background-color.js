/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorLayer from '../../../background-control/colorLayer';
import {
	getAttributeKey,
	// getBlockStyle,
	// getColorRGBAString,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';
import ToggleSwitch from '../../../toggle-switch';

/**
 * Styles
 */
import './editor.scss';

/**
 * Icons
 */
import { backgroundColor } from '../../../../icons';

/**
 * BackgroundColor
 */

const ALLOWED_BLOCKS = ['maxi-blocks/button-maxi'];

const BackgroundColor = props => {
	const {
		blockName,
		onChange,
		clientId,
		breakpoint,
		prefix = '',
		globalProps,
		advancedOptions = 'background',
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const activeMedia = getLastBreakpointAttribute(
		`${prefix}background-active-media`,
		breakpoint,
		props
	);
	const isBackgroundColor = activeMedia === 'color';

	// const getStyle = () => {
	// 	if (!isBackgroundColor)
	// 		return {
	// 			background: '#fff',
	// 			clipPath:
	// 				'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
	// 		};

	// 	const bgPaletteStatus = getLastBreakpointAttribute(
	// 		`${prefix}background-palette-status`,
	// 		breakpoint,
	// 		props
	// 	);
	// 	const bgPaletteColor = getLastBreakpointAttribute(
	// 		`${prefix}background-palette-color`,
	// 		breakpoint,
	// 		props
	// 	);
	// 	const bgPaletteOpacity = getLastBreakpointAttribute(
	// 		`${prefix}background-palette-opacity`,
	// 		breakpoint,
	// 		props
	// 	);
	// 	const bgColor = getLastBreakpointAttribute(
	// 		`${prefix}background-color`,
	// 		breakpoint,
	// 		props
	// 	);

	// 	return {
	// 		background: bgPaletteStatus
	// 			? getColorRGBAString({
	// 					firstVar: `color-${bgPaletteColor}`,
	// 					opacity: bgPaletteOpacity,
	// 					blockStyle: getBlockStyle(clientId),
	// 			  })
	// 			: bgColor,
	// 	};
	// };

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions={advancedOptions}
			tooltip={
				!isBackgroundColor
					? __('Background Colour Disabled', 'maxi-blocks')
					: __('Background Colour', 'maxi-blocks')
			}
			icon={backgroundColor}
		>
			<div className='toolbar-item__background__popover'>
				<ToggleSwitch
					label={__('Enable background colour', 'maxi-blocks')}
					selected={isBackgroundColor}
					onChange={val => {
						onChange({
							[getAttributeKey(
								'background-active-media',
								false,
								prefix,
								breakpoint
							)]: val ? 'color' : 'none',
						});
					}}
				/>
				{isBackgroundColor && (
					<ColorLayer
						colorOptions={{
							...getGroupAttributes(
								props,
								'backgroundColor',
								false,
								prefix
							),
						}}
						key={`background-color-layer--${clientId}`}
						onChange={obj => onChange(obj)}
						breakpoint={breakpoint}
						globalProps={globalProps}
						prefix={prefix}
						clientId={clientId}
						disableClipPath
						isToolbar
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BackgroundColor;
