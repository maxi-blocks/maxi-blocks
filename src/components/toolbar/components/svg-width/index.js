/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import AdvancedNumberControl from '../../../advanced-number-control';
import { getDefaultAttribute } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarShapeWidth } from '../../../../icons';

/**
 * SvgWidth
 */
const SvgWidth = props => {
	const {
		blockName,
		onChange,
		'svg-width': svgWidth,
		'svg-stroke': svgStroke,
	} = props;

	if (blockName !== 'maxi-blocks/svg-icon-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__svg-size'
			tooltip={__('SVG Width/Stroke', 'maxi-blocks')}
			icon={toolbarShapeWidth}
		>
			<div className='toolbar-item__svg-size__popover'>
				<AdvancedNumberControl
					label={__('Width', 'maxi-blocks')}
					value={svgWidth}
					onChangeValue={val => {
						onChange({
							'svg-width':
								val !== undefined && val !== '' ? val : '',
						});
					}}
					min={10}
					max={500}
					step={1}
					onReset={() => onChange(getDefaultAttribute('svg-width'))}
					initialPosition={getDefaultAttribute('svg-width')}
				/>
				<AdvancedNumberControl
					label={__('Stroke Width', 'maxi-blocks')}
					value={svgStroke}
					onChangeValue={val => {
						onChange({
							'svg-stroke':
								val !== undefined && val !== '' ? val : '',
						});
					}}
					min={0.1}
					max={5}
					step={0.1}
					onReset={() => onChange(getDefaultAttribute('svg-stroke'))}
					initialPosition={getDefaultAttribute('svg-stroke')}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default SvgWidth;
