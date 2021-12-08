/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorLayer from '../../../background-control/colorLayer';
import ButtonGroupControl from '../../../button-group-control';
import {
	getBlockStyle,
	getColorRGBAString,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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
const BackgroundColor = props => {
	const {
		blockName,
		onChange,
		clientId,
		breakpoint,
		'background-layers': backgroundLayers,
	} = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi'
	)
		return null;

	const colorLayers =
		backgroundLayers &&
		backgroundLayers.filter(layer => layer.type === 'color');
	const layer = colorLayers ? colorLayers[colorLayers.length - 1] : null;

	const isBackgroundColor = !isEmpty(layer);

	const getStyle = () => {
		// if (!isBackgroundColor)
		// 	return {
		// 		background: '#fff',
		// 		clipPath:
		// 			'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
		// 	};

		const bgPaletteStatus = getLastBreakpointAttribute(
			'background-palette-color-status',
			breakpoint,
			layer
		);
		const bgPaletteColor = getLastBreakpointAttribute(
			'background-palette-color',
			breakpoint,
			layer
		);
		const bgPaletteOpacity = getLastBreakpointAttribute(
			'background-palette-opacity',
			breakpoint,
			layer
		);
		const bgColor = getLastBreakpointAttribute(
			'background-color',
			breakpoint,
			layer
		);

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
			advancedOptions='background'
			tooltip={
				!isBackgroundColor
					? __('Background Colour Disabled', 'maxi-blocks')
					: __('Background Colour', 'maxi-blocks')
			}
			// icon={<div className='toolbar-item__icon' style={getStyle()} />}
			icon={backgroundColor}
		>
			<div className='toolbar-item__background__popover'>
				<ButtonGroupControl
					label={__('Enable Background Colour', 'maxi-blocks')}
					selected={isBackgroundColor}
					options={[
						{
							label: __('Yes', 'maxi-blocks'),
							value: 1,
						},
						{
							label: __('No', 'maxi-blocks'),
							value: 0,
						},
					]}
					onChange={val => {
						if (val) {
							onChange({
								'background-layers': [
									...backgroundLayers,
									{
										type: 'color',
										'display-general': 'block',
										'background-palette-color-status-general': true,
										'background-palette-color-general': 1,
										'background-palette-opacity': 100,
										'background-color-general': '',
										'background-color-clip-path-general':
											'',
										id: backgroundLayers.length,
									},
								],
							});
						} else {
							onChange({
								'background-layers': backgroundLayers.map(
									bgLayer => {
										if (bgLayer.id !== layer.id)
											return bgLayer;
									}
								),
							});
						}
					}}
				/>
				{isBackgroundColor && (
					<ColorLayer
						key={`background-color-layer--${layer.id}`}
						colorOptions={layer}
						onChange={obj => onChange({ ...layer, ...obj })}
						breakpoint={breakpoint}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BackgroundColor;
