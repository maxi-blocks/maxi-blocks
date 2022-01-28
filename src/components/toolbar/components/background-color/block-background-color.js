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
import ToggleSwitch from '../../../toggle-switch';

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
 * Icons
 */
import { backgroundColor } from '../../../../icons';

/**
 * BackgroundColor
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
		breakpoint,
		'background-layers': backgroundLayers = [],
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const colorLayers =
		backgroundLayers &&
		backgroundLayers.filter(layer => layer.type === 'color');
	const layer = colorLayers ? colorLayers[colorLayers.length - 1] : null;

	const isBackgroundColor = !isEmpty(layer);

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
						disableClipPath
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
						isToolbar
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BlockBackgroundColor;
