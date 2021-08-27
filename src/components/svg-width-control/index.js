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
	const { onChange, breakpoint } = props;

	const width = props[`svg-width-${breakpoint}`];
	const defaultWidth = getDefaultAttribute(`svg-width-${breakpoint}`);
	const widthUnit = getLastBreakpointAttribute(
		'svg-width-unit',
		breakpoint,
		props
	);
	const defaultWidthUnit = getDefaultAttribute(
		`svg-width-unit-${breakpoint}`
	);

	return (
		<>
			<AdvancedNumberControl
				label={__('Width', 'maxi-blocks')}
				value={width}
				placeholder={
					breakpoint !== 'general'
						? getLastBreakpointAttribute(
								'svg-width',
								breakpoint,
								props
						  )
						: null
				}
				onChangeValue={val => {
					onChange({
						[`svg-width-${breakpoint}`]:
							val !== undefined && val !== '' ? val : '',
					});
				}}
				enableUnit
				unit={widthUnit}
				allowedUnits={['px', 'em', 'vw', '%']}
				onChangeUnit={val => {
					onChange({
						[`svg-width-unit-${breakpoint}`]: val,
					});
				}}
				min={10}
				max={500}
				step={1}
				onReset={() =>
					onChange({
						[`svg-width-${breakpoint}`]: defaultWidth,
						[`svg-width-unit-${breakpoint}`]: defaultWidthUnit,
					})
				}
				initialPosition={defaultWidth}
			/>
		</>
	);
};

export default SvgWidthControl;
