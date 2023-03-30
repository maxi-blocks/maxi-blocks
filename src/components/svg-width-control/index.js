/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import { togglePreserveAspectRatio } from '../../extensions/svg';

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

	const widthAttrLabel = getAttributeKey('_w', isHover, prefix, breakpoint);
	const width = getAttributesValue({
		target: '_w',
		props,
		breakpoint,
		isHover,
		prefix,
	});
	const defaultWidth = getDefaultAttribute(widthAttrLabel);
	const placeholderWidth = getLastBreakpointAttribute({
		target: `${prefix}_w`,
		breakpoint,
		isHover,
		attributes: props,
	});
	const widthUnit = getLastBreakpointAttribute({
		target: `${prefix}_w.u`,
		breakpoint,
		isHover,
		attributes: props,
	});
	const defaultWidthUnit = getDefaultAttribute(
		getAttributeKey('_w-unit', isHover, prefix, breakpoint)
	);

	const heightFitContent = getLastBreakpointAttribute({
		target: `${prefix}_wfc`,
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
						[getAttributeKey('_w', isHover, prefix, breakpoint)]:
							newVal,
					});
				}}
				enableUnit
				unit={widthUnit}
				allowedUnits={['px', 'vw', '%']}
				onChangeUnit={val => {
					onChange({
						[getAttributeKey(
							'_w-unit',
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
						[getAttributeKey('_w', isHover, prefix, breakpoint)]:
							defaultWidth,
						[getAttributeKey(
							'_w-unit',
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
					selected={heightFitContent}
					onChange={val => {
						const contentPrefix = prefix === 'svg-' ? '' : prefix;

						const icon = getAttributesValue({
							target: 'content',
							isHover,
							prefix: contentPrefix,
							props,
						});

						onChange({
							[getAttributeKey(
								'_wfc',
								isHover,
								prefix,
								breakpoint
							)]: val,
							[getAttributeKey(
								'content',
								isHover,
								contentPrefix
							)]: togglePreserveAspectRatio(icon, val),
						});
					}}
				/>
			)}
		</div>
	);
};

export default SvgWidthControl;
