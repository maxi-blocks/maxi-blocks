/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ToggleSwitch } from '..';
import {
	getAttributeKey,
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
	const {
		onChange,
		breakpoint,
		prefix,
		isHover,
		enableResponsive = false,
		resizableObject = false,
	} = props;

	const width =
		props[`${prefix}width-${breakpoint}${isHover ? '-hover' : ''}`];
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
				value={width || defaultWidth}
				placeholder={
					breakpoint !== 'general'
						? getLastBreakpointAttribute(
								`${prefix}width`,
								breakpoint,
								false,
								props
						  )
						: null
				}
				onChangeValue={val => {
					const newVal = val !== undefined && val !== '' ? val : '';

					onChange({
						[getAttributeKey('width', isHover, prefix, breakpoint)]:
							newVal,
					});
				}}
				enableUnit
				unit={widthUnit}
				allowedUnits={['px', 'vw', '%']}
				onChangeUnit={val => {
					onChange({
						[getAttributeKey(
							'width-unit',
							isHover,
							prefix,
							breakpoint
						)]: val,
					});

					if (resizableObject)
						resizableObject.current?.updateSize({
							width: `${width}${val}`,
						});
				}}
				min={10}
				max={500}
				step={1}
				onReset={() =>
					onChange({
						[getAttributeKey('width', isHover, prefix, breakpoint)]:
							defaultWidth,
						[getAttributeKey(
							'width-unit',
							isHover,
							prefix,
							breakpoint
						)]: defaultWidthUnit,
					})
				}
				defaultValue={defaultWidth}
				initialPosition={defaultWidth}
				isHover={isHover}
			/>
			{enableResponsive && (
				<ToggleSwitch
					label={__('Force responsive', 'maxi-blocks')}
					selected={getLastBreakpointAttribute(
						`${prefix}responsive`,
						breakpoint,
						false,
						props
					)}
					onChange={val =>
						onChange({
							[getAttributeKey(
								'responsive',
								false,
								prefix,
								breakpoint
							)]: val,
						})
					}
				/>
			)}
		</>
	);
};

export default SvgWidthControl;
