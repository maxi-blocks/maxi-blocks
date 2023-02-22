/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	getAttributeKey,
	getAttributeValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
		className,
		disableHeightFitContent = false,
	} = props;

	const classes = classnames('maxi-svg-width-control', className);

	const widthAttrLabel = `${prefix}width-${breakpoint}${
		isHover ? '-hover' : ''
	}`;
	const width = props[widthAttrLabel];
	const defaultWidth = getDefaultAttribute(widthAttrLabel);
	const placeholderWidth = getLastBreakpointAttribute({
		target: `${prefix}width`,
		breakpoint,
		isHover,
		attributes: props,
	});
	const widthUnit = getLastBreakpointAttribute({
		target: `${prefix}width-unit`,
		breakpoint,
		isHover,
		attributes: props,
	});
	const defaultWidthUnit = getDefaultAttribute(
		`${prefix}width-unit-${breakpoint}${isHover ? '-hover' : ''}`
	);

	const widthFitContent = getLastBreakpointAttribute({
		target: `${prefix}width-fit-content`,
		breakpoint,
		isHover,
		attributes: props,
	});

	return (
		<div className={classes}>
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
						isReset: true,
					})
				}
				defaultValue={defaultWidth}
				initialPosition={placeholderWidth}
				isHover={isHover}
				optionType='string'
			/>
			{!disableHeightFitContent && (
				<ToggleSwitch
					label={__('Set height to fit content', 'maxi-blocks')}
					selected={widthFitContent}
					onChange={val => {
						const contentPrefix = prefix === 'svg-' ? '' : prefix;

						let icon = getAttributeValue({
							target: 'content',
							isHover,
							prefix: contentPrefix,
							props,
						});

						if (
							!icon.includes(
								'preserveAspectRatio="xMidYMid slice"'
							)
						)
							icon = icon.replace(
								'>',
								' preserveAspectRatio="xMidYMid slice">'
							);

						onChange({
							[getAttributeKey(
								'width-fit-content',
								isHover,
								prefix,
								breakpoint
							)]: val,
							[getAttributeKey(
								'content',
								isHover,
								contentPrefix
							)]: icon,
						});
					}}
				/>
			)}
		</div>
	);
};

export default SvgWidthControl;
