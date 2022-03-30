/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorLayer from '../../../background-control/colorLayer';
import { colorOptions as colorLayerAttr } from '../../../background-control/layers';
import SettingTabsControl from '../../../setting-tabs-control';
import {
	getBlockStyle,
	getColorRGBAString,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, findIndex, isEqual } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { setBreakpointToLayer } from '../../../background-control/utils';

/**
 * BlockBackgroundColor
 */
const ALLOWED_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi',
];

const BlockBackgroundColor = props => {
	const {
		blockName,
		onChange,
		clientId,
		breakpoint,
		'background-layers': backgroundLayers = [],
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const colorLayers =
		backgroundLayers &&
		backgroundLayers.filter(layer => layer.type === 'color');
	const layer = colorLayers ? colorLayers[colorLayers.length - 1] : null;

	const isBackgroundColor = !isEmpty(layer);

	const getStyle = () => {
		if (!isBackgroundColor)
			return {
				background: '#fff',
				clipPath:
					'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
			};

		const bgPaletteStatus = getLastBreakpointAttribute({
			target: 'background-palette-status',
			breakpoint,
			attributes: layer,
		});
		const bgPaletteColor = getLastBreakpointAttribute({
			target: 'background-palette-color',
			breakpoint,
			attributes: layer,
		});
		const bgPaletteOpacity = getLastBreakpointAttribute({
			target: 'background-palette-opacity',
			breakpoint,
			attributes: layer,
		});
		const bgColor = getLastBreakpointAttribute({
			target: 'background-color',
			breakpoint,
			attributes: layer,
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

	const getNewLayerId = () =>
		backgroundLayers && !isEmpty(backgroundLayers)
			? backgroundLayers.reduce((layerA, layerB) =>
					layerA.id > layerB.id ? layerA : layerB
			  ).id + 1
			: 1;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions='background layer'
			tab={1}
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
					onChange={val => {
						if (val) {
							onChange({
								'background-layers': [
									...backgroundLayers,
									{
										...setBreakpointToLayer({
											layer: colorLayerAttr,
											breakpoint,
										}),
										id: getNewLayerId(),
									},
								],
							});
						} else {
							const newBGLayers = backgroundLayers.filter(
								bgLayer => bgLayer.id !== layer.id
							);

							onChange({ 'background-layers': newBGLayers });
						}
					}}
				/>
				{isBackgroundColor && (
					<ColorLayer
						key={`background-color-layer--${layer.id}`}
						colorOptions={layer}
						onChange={obj => {
							const newLayer = { ...layer, ...obj };
							const newLayers = cloneDeep(backgroundLayers);

							backgroundLayers.forEach((lay, i) => {
								if (lay.id === newLayer.id) {
									const index = findIndex(newLayers, {
										id: newLayer.id,
									});

									newLayers[index] = newLayer;
								}
							});

							if (!isEqual(newLayers, backgroundLayers))
								onChange({
									'background-layers': newLayers,
								});
						}}
						breakpoint={breakpoint}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BlockBackgroundColor;
