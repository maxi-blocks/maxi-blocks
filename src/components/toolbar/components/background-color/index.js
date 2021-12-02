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
import ButtonGroupControl from '../../../button-group-control';
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
 * BackgroundColor
 */
const BackgroundColor = props => {
	const {
		blockName,
		onChange,
		clientId,
		breakpoint,
		'background-layers': backgroundLayers = [],
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
		if (!isBackgroundColor)
			return {
				background: '#fff',
				clipPath:
					'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
			};

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

	const getNewLayerId = () =>
		backgroundLayers && !isEmpty(backgroundLayers)
			? backgroundLayers.reduce((layerA, layerB) =>
					layerA.id > layerB.id ? layerA : layerB
			  ).id + 1
			: 1;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions='background'
			tooltip={
				!isBackgroundColor
					? __('Background Colour Disabled', 'maxi-blocks')
					: __('Background Colour', 'maxi-blocks')
			}
			icon={<div className='toolbar-item__icon' style={getStyle()} />}
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

export default BackgroundColor;
