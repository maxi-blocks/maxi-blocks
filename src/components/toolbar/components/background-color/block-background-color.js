/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import ColorLayer from '@components/background-control/colorLayer';
import { colorOptions as colorLayerAttr } from '@components/background-control/layers';
import ToggleSwitch from '@components/toggle-switch';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, findIndex, isEqual } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { setBreakpointToLayer } from '@components/background-control/utils';

/**
 * Icons
 */
import { backgroundColor } from '@maxi-icons';

/**
 * BackgroundColor
 */
const ALLOWED_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi',
	'maxi-blocks/slide-maxi',
	'maxi-blocks/slider-maxi',
];

const BlockBackgroundColor = props => {
	const {
		blockName,
		onChangeInline,
		onChange,
		breakpoint,
		'background-layers': backgroundLayers = [],
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const colorLayers =
		backgroundLayers &&
		backgroundLayers.filter(layer => layer.type === 'color');
	const layer = colorLayers ? colorLayers[colorLayers.length - 1] : null;

	const isBackgroundColor = !isEmpty(layer);

	const getNewLayerOrder = () =>
		backgroundLayers && !isEmpty(backgroundLayers)
			? backgroundLayers.reduce((layerA, layerB) =>
					layerA.order > layerB.order ? layerA : layerB
			  ).order + 1
			: 1;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions='background layer'
			tooltip={
				!isBackgroundColor
					? __('Background colour disabled', 'maxi-blocks')
					: __('Background colour', 'maxi-blocks')
			}
			icon={backgroundColor}
		>
			<div className='toolbar-item__background__popover'>
				<ToggleSwitch
					label={__('Enable background colour', 'maxi-blocks')}
					selected={isBackgroundColor}
					onChange={val => {
						if (val) {
							onChange({
								'background-layers': [
									...backgroundLayers,
									{
										...setBreakpointToLayer({
											layer: colorLayerAttr,
											breakpoint: 'general',
										}),
										order: getNewLayerOrder(),
									},
								],
							});
						} else {
							const newBGLayers = backgroundLayers.filter(
								bgLayer => bgLayer.order !== layer.order
							);

							onChange({ 'background-layers': newBGLayers });
						}
					}}
				/>
				{isBackgroundColor && (
					<ColorLayer
						disableClipPath
						key={`background-color-layer--${layer.order}`}
						colorOptions={layer}
						onChangeInline={obj =>
							onChangeInline(
								obj,
								`.maxi-background-displayer__${layer.order}`
							)
						}
						onChange={obj => {
							const newLayer = { ...layer, ...obj };
							const newLayers = cloneDeep(backgroundLayers);

							backgroundLayers.forEach((lay, i) => {
								if (lay.order === newLayer.order) {
									const index = findIndex(newLayers, {
										order: newLayer.order,
									});

									newLayers[index] = newLayer;
								}
							});

							if (!isEqual(newLayers, backgroundLayers))
								onChange(
									{
										'background-layers': newLayers,
									},
									`.maxi-background-displayer__${layer.order}`
								);
						}}
						breakpoint={breakpoint}
						isToolbar
						disableResponsiveTabs
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BlockBackgroundColor;
