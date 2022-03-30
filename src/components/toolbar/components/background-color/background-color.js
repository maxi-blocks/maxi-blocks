/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorLayer from '../../../background-control/colorLayer';
import SettingTabsControl from '../../../setting-tabs-control';
import {
	getAttributeKey,
	getBlockStyle,
	getColorRGBAString,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

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

	const activeMedia = getLastBreakpointAttribute({
		target: `${prefix}background-active-media`,
		breakpoint,
		attributes: props,
	});
	const isBackgroundColor = activeMedia === 'color';

	const getStyle = () => {
		if (!isBackgroundColor)
			return {
				background: '#fff',
				clipPath:
					'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
			};

		const bgPaletteStatus = getLastBreakpointAttribute({
			target: `${prefix}background-palette-status`,
			breakpoint,
			attributes: props,
		});
		const bgPaletteColor = getLastBreakpointAttribute({
			target: `${prefix}background-palette-color`,
			breakpoint,
			attributes: props,
		});
		const bgPaletteOpacity = getLastBreakpointAttribute({
			target: `${prefix}background-palette-opacity`,
			breakpoint,
			attributes: props,
		});
		const bgColor = getLastBreakpointAttribute({
			target: `${prefix}background-color`,
			breakpoint,
			attributes: props,
		});

		return {
			background: bgPaletteStatus
				? getColorRGBAString({
						firstVar: `color-${bgPaletteColor}`,
						opacity: bgPaletteOpacity,
						blockStyle: getBlockStyle(clientId),
				  })
				: bgColor,
		};
	};

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions={advancedOptions}
			tab={0}
			tooltip={
				!isBackgroundColor
					? __('Background Colour Disabled', 'maxi-blocks')
					: __('Background Colour', 'maxi-blocks')
			}
			icon={<div className='toolbar-item__icon' style={getStyle()} />}
		>
			<div className='toolbar-item__background__popover'>
				<SettingTabsControl
					label={__('Enable Background Colour', 'maxi-blocks')}
					type='buttons'
					selected={isBackgroundColor}
					items={[
						{
							label: __('Yes', 'maxi-blocks'),
							value: 1,
						},
						{
							label: __('No', 'maxi-blocks'),
							value: 0,
						},
					]}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'background-active-media',
								false,
								prefix,
								breakpoint
							)]: val ? 'color' : 'none',
						})
					}
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
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BackgroundColor;
