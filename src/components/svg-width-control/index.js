/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import {
	getAttributeKey,
	getAttributeValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	shouldSetPreserveAspectRatio,
	togglePreserveAspectRatio,
} from '@extensions/svg';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ToggleSwitch from '@components/toggle-switch';

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
		isIB,
	} = props;

	const classes = classnames('maxi-svg-width-control', className);

	const useBreakpoint =
		breakpoint === 'general'
			? select('maxiBlocks').receiveBaseBreakpoint()
			: breakpoint;

	const widthAttrLabel = `${prefix}width-${useBreakpoint}${
		isHover ? '-hover' : ''
	}`;
	const defaultWidthAttrLabel = `${prefix}width-general${
		isHover ? '-hover' : ''
	}`;
	const width = props[widthAttrLabel] || props[defaultWidthAttrLabel];
	const defaultWidth = getDefaultAttribute(defaultWidthAttrLabel);
	const placeholderWidth =
		getLastBreakpointAttribute({
			target: `${prefix}width`,
			useBreakpoint,
			isHover,
			attributes: props,
		}) ||
		getLastBreakpointAttribute({
			target: `${prefix}width`,
			breakpoint: 'general',
			isHover,
			attributes: props,
		});
	const widthUnit =
		getLastBreakpointAttribute({
			target: `${prefix}width-unit`,
			useBreakpoint,
			isHover,
			attributes: props,
		}) ||
		getLastBreakpointAttribute({
			target: `${prefix}width-unit`,
			breakpoint: 'general',
			isHover,
			attributes: props,
		});
	const defaultWidthUnit = getDefaultAttribute(
		`${prefix}width-unit-general${isHover ? '-hover' : ''}`
	);

	const heightFitContent =
		getLastBreakpointAttribute({
			target: `${prefix}width-fit-content`,
			useBreakpoint,
			isHover,
			attributes: props,
		}) ||
		getLastBreakpointAttribute({
			target: `${prefix}width-fit-content`,
			breakpoint: 'general',
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
						[getAttributeKey(
							'width',
							isHover,
							prefix,
							useBreakpoint
						)]: newVal,
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
							useBreakpoint
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
						[getAttributeKey(
							'width',
							isHover,
							prefix,
							useBreakpoint
						)]: defaultWidth,
						[getAttributeKey(
							'width-unit',
							isHover,
							prefix,
							useBreakpoint
						)]: defaultWidthUnit,
						isReset: true,
					})
				}
				defaultValue={defaultWidth}
				initialPosition={placeholderWidth}
				isHover={isHover}
				optionType='string'
			/>
			{!disableHeightFitContent && !isIB && (
				<ToggleSwitch
					label={__('Set height to fit content', 'maxi-blocks')}
					selected={heightFitContent}
					onChange={val => {
						const contentPrefix = prefix === 'svg-' ? '' : prefix;

						const icon = getAttributeValue({
							target: 'content',
							isHover,
							prefix: contentPrefix,
							props,
						});

						onChange({
							[getAttributeKey(
								'width-fit-content',
								isHover,
								prefix,
								useBreakpoint
							)]: val,
							...((val ||
								!shouldSetPreserveAspectRatio(
									props,
									prefix
								)) && {
								[getAttributeKey(
									'content',
									isHover,
									contentPrefix
								)]: togglePreserveAspectRatio(icon, val),
							}),
						});
					}}
				/>
			)}
		</div>
	);
};

export default SvgWidthControl;
