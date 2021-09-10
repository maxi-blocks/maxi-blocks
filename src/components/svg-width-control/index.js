/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';

/**
 * Component
 */
const SvgWidthControl = props => {
	const { onChange, breakpoint, prefix } = props;

	const width = props[`${prefix}width-${breakpoint}`];
	const defaultWidth = getDefaultAttribute(`${prefix}width-${breakpoint}`);
	const widthUnit = getLastBreakpointAttribute(
		`${prefix}width-unit`,
		breakpoint,
		props
	);
	const defaultWidthUnit = getDefaultAttribute(
		`${prefix}width-unit-${breakpoint}`
	);

	return (
		<>
			<AdvancedNumberControl
				label={__('Width', 'maxi-blocks')}
				value={width}
				placeholder={
					breakpoint !== 'general'
						? getLastBreakpointAttribute(
								`${prefix}width`,
								breakpoint,
								props
						  )
						: null
				}
				onChangeValue={val => {
					onChange({
						[`${prefix}width-${breakpoint}`]:
							val !== undefined && val !== '' ? val : '',
					});
				}}
				enableUnit
				unit={widthUnit}
				allowedUnits={['px', 'em', 'vw', '%']}
				onChangeUnit={val => {
					onChange({
						[`${prefix}width-unit-${breakpoint}`]: val,
					});
				}}
				min={10}
				max={500}
				step={1}
				onReset={() =>
					onChange({
						[`${prefix}width-${breakpoint}`]: defaultWidth,
						[`${prefix}width-unit-${breakpoint}`]: defaultWidthUnit,
					})
				}
				initialPosition={defaultWidth}
			/>
		</>
	);
};

export default SvgWidthControl;
