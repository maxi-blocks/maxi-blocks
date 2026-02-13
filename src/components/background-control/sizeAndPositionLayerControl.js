/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import PositionControl from '@components/position-control';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import {
	getDefaultLayerAttr,
	getDefaultLayerAttrs,
	getDefaultLayerWithBreakpoint,
} from './utils';

/**
 * Component
 */
const Size = ({
	options,
	onChange,
	breakpoint,
	isHover,
	isLayer = false,
	prefix,
	onlyWidth = false,
}) => {
	const minMaxSettings = {
		px: { min: 0, max: 1999, minRange: 0, maxRange: 1999 },
		em: { min: 0, max: 1999, minRange: 0, maxRange: 1999 },
		vw: { min: 0, max: 1999, minRange: 0, maxRange: 1999 },
		vh: { min: 0, max: 1999, minRange: 0, maxRange: 1999 },
		'%': { min: 0, max: 300, minRange: 0, maxRange: 300 },
	};

	const getDefaultAttr = target => {
		if (isLayer) {
			const { type } = options;
			return breakpoint === 'general'
				? getDefaultLayerAttr(
						`${type === 'shape' ? 'SVG' : type}Options`,
						`${prefix}${target}`
				  )
				: undefined;
		}

		return getDefaultAttribute(
			getAttributeKey(target, isHover, prefix, breakpoint)
		);
	};

	const updateDimension = (dimension, value, unit, extras = {}) => {
		const result = { ...extras };
		if (value !== undefined)
			result[getAttributeKey(dimension, isHover, prefix, breakpoint)] =
				value;
		if (unit !== undefined)
			result[
				getAttributeKey(
					`${dimension}-unit`,
					isHover,
					prefix,
					breakpoint
				)
			] = unit;
		onChange(result);
	};

	const onReset = target => {
		const defVal = isHover
			? getLastBreakpointAttribute({
					target: `${prefix}${target}`,
					breakpoint,
					attributes: options,
					isHover: false,
			  })
			: getDefaultAttr(target);

		const defUnit = isHover
			? getLastBreakpointAttribute({
					target: `${prefix}${target}-unit`,
					breakpoint,
					attributes: options,
					isHover: false,
			  })
			: getDefaultAttr(`${target}-unit`);

		updateDimension(target, defVal, defUnit, { isReset: true });
	};

	return (
		<div className='maxi-background-control__size'>
			<AdvancedNumberControl
				label={
					onlyWidth
						? __('Height and Width', 'maxi-blocks')
						: __('Width', 'maxi-blocks')
				}
				value={getLastBreakpointAttribute({
					target: `${prefix}width`,
					breakpoint,
					attributes: options,
					isHover,
				})}
				allowedUnits={['px', 'em', 'vw', '%']}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: `${prefix}width-unit`,
					breakpoint,
					attributes: options,
					isHover,
				})}
				onChangeValue={val => updateDimension('width', val, undefined)}
				onChangeUnit={val => updateDimension('width', undefined, val)}
				onReset={() => onReset('width')}
				minMaxSettings={minMaxSettings}
			/>
			{!onlyWidth && (
				<AdvancedNumberControl
					label={__('Height', 'maxi-blocks')}
					value={getLastBreakpointAttribute({
						target: `${prefix}height`,
						breakpoint,
						attributes: options,
						isHover,
					})}
					allowedUnits={['px', 'em', 'vw', '%']}
					enableUnit
					unit={getLastBreakpointAttribute({
						target: `${prefix}height-unit`,
						breakpoint,
						attributes: options,
						isHover,
					})}
					onChangeValue={val => updateDimension('height', val, undefined)}
					onChangeUnit={val => updateDimension('height', undefined, val)}
					onReset={() => onReset('height')}
					minMaxSettings={minMaxSettings}
				/>
			)}
		</div>
	);
};

const SizeAndPositionLayerControl = ({
	options,
	onChange,
	prefix: rawPrefix = '',
	isHover = false,
	isLayer = false,
	breakpoint,
	onlyWidth = false,
}) => {
	const { type } = options;
	const prefix = `${rawPrefix}background-${
		type === 'shape' ? 'svg' : `${type}-wrapper`
	}-`;

	// Add new attributes if they don't exist
	useEffect(() => {
		if (
			isLayer &&
			type !== 'shape' &&
			Object.keys(options).every(key => !key.includes(prefix))
		) {
			const defaultOptions = Object.entries(
				getDefaultLayerAttrs(`${type}Options`)
			).reduce(
				(acc, [key, value]) => ({
					...acc,
					...(key.includes(prefix) && { [`${key}-general`]: value }),
				}),
				{}
			);

			onChange(defaultOptions);
		}
	}, []);

	if (!isLayer) return null;

	const equivalentProps = {
		onChange,
		prefix,
		breakpoint,
		isHover,
	};

	return (
		<>
			<Size
				{...equivalentProps}
				options={options}
				isLayer={isLayer}
				onlyWidth={onlyWidth}
			/>
			<PositionControl
				{...options}
				{...equivalentProps}
				className='maxi-background-control__position'
				disablePosition
				defaultAttributes={getDefaultLayerWithBreakpoint(
					`${type === 'shape' ? 'SVG' : type}Options`,
					'general',
					isHover
				)}
				disableRTC
			/>
		</>
	);
};

export default SizeAndPositionLayerControl;
