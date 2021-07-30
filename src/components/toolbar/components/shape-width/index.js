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
 * ShapeWidth
 */
const ShapeWidth = props => {
	const {
		blockName,
		onChange,
		'shape-width': shapeWidth,
		'shape-unit': shapeUnit,
	} = props;

	if (blockName !== 'maxi-blocks/shape-maxi') return null;

	const shapeWidthMinMaxSettings = {
		px: {
			min: 0,
			max: 999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 100,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	return (
		<ToolbarPopover
			className='toolbar-item__shape-size'
			tooltip={__('Shape Width', 'maxi-blocks')}
			icon={toolbarShapeWidth}
		>
			<div className='toolbar-item__shape-size__popover'>
				<AdvancedNumberControl
					label={__('Shape Width', 'maxi-blocks')}
					enableUnit
					unit={shapeUnit}
					onChangeUnit={val =>
						onChange({
							'shape-width-unit': val,
						})
					}
					value={shapeWidth}
					onChangeValue={val => {
						onChange({
							'shape-width':
								val !== undefined && val !== '' ? val : '',
						});
					}}
					minMaxSettings={shapeWidthMinMaxSettings}
					onReset={() =>
						onChange({
							'shape-width': getDefaultAttribute('shape-width'),
							'shape-width-unit':
								getDefaultAttribute('shape-width-unit'),
						})
					}
					initialPosition={getDefaultAttribute('shape-width')}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default ShapeWidth;
