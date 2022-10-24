/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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
		resizableObject = false,
		customLabel = 'Width',
	} = props;

	const widthAttrLabel = `${prefix}width-${breakpoint}${
		isHover ? '-hover' : ''
	}`;
	const width = props[widthAttrLabel];
	const defaultWidth = getDefaultAttribute(widthAttrLabel);
	const placeholderWidth = getLastBreakpointAttribute({
		target: `${prefix}width`,
		breakpoint,
		attributes: props,
	});
	const widthUnit = getLastBreakpointAttribute({
		target: `${prefix}width-unit`,
		breakpoint,
		attributes: props,
	});
	const defaultWidthUnit = getDefaultAttribute(
		`${prefix}width-unit-${breakpoint}`
	);

	return (
		<AdvancedNumberControl
			label={__(customLabel, 'maxi-blocks')}
			value={width}
			placeholder={placeholderWidth}
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
			initialPosition={placeholderWidth}
			isHover={isHover}
			optionType='string'
		/>
	);
};

export default SvgWidthControl;
