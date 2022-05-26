/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../../../advanced-number-control';
import ToolbarPopover from '../toolbar-popover';
import { getDefaultAttribute } from '../../../../extensions/styles';
import SvgWidthControl from '../../../svg-width-control';
import SvgStrokeWidthControl from '../../../svg-stroke-width-control';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarShapeWidth } from '../../../../icons';

/**
 * Component
 */
const IconSize = props => {
	const { blockName, onChange, breakpoint } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__icon-size'
			tooltip={__('Icon Size/Spacing', 'maxi-blocks')}
			icon={toolbarShapeWidth}
		>
			<div className='toolbar-item__icon-size__popover'>
				<SvgWidthControl
					prefix='icon-'
					{...props}
					onChange={onChange}
					breakpoint={breakpoint}
				/>
				<SvgStrokeWidthControl
					prefix='icon-'
					{...props}
					onChange={onChange}
					breakpoint={breakpoint}
				/>
				<AdvancedNumberControl
					label={__('Spacing', 'maxi-blocks')}
					min={0}
					max={999}
					initial={1}
					step={1}
					value={props[`icon-spacing-${breakpoint}`]}
					onChangeValue={val => {
						onChange({
							[`icon-spacing-${breakpoint}`]:
								val !== undefined && val !== '' ? val : '',
						});
					}}
					onReset={() =>
						onChange({
							[`icon-spacing-${breakpoint}`]: getDefaultAttribute(
								`icon-spacing-${breakpoint}`
							),
						})
					}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default IconSize;
