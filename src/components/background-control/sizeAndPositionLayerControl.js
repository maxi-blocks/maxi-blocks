/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import PositionControl from '../position-control';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
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
}) => {
	const minMaxSettings = {
		px: {
			min: 0,
			max: 1999,
			minRange: 0,
			maxRange: 1999,
		},
		em: {
			min: 0,
			max: 1999,
			minRange: 0,
			maxRange: 1999,
		},
		vw: {
			min: 0,
			max: 1999,
			minRange: 0,
			maxRange: 1999,
		},
		vh: {
			min: 0,
			max: 1999,
			minRange: 0,
			maxRange: 1999,
		},
		'%': {
			min: 0,
			max: 300,
			minRange: 0,
			maxRange: 300,
		},
	};

	const getDefaultAttr = target => {
		if (isLayer) {
			const { type } = options;

			// getDefaultLayerAttr does not support breakpoints,
			// so I wrote a little hack to reset it correctly
			return breakpoint === 'g'
				? getDefaultLayerAttr(
						`${type === 'shape' ? 'SVG' : type}Options`,
						`${prefix}${target}`
				  )
				: undefined;
		}

		return getDefaultAttribute(
			getAttributeKey({ key: target, isHover, prefix, breakpoint })
		);
	};

	const onReset = target => {
		onChange({
			[getAttributeKey({ key: target, isHover, prefix, breakpoint })]:
				isHover
					? getLastBreakpointAttribute({
							target,
							prefix,
							breakpoint,
							attributes: options,
							isHover: false,
					  })
					: getDefaultAttr(target),
			[getAttributeKey({
				key: `${target}.u`,
				isHover,
				prefix,
				breakpoint,
			})]: isHover
				? getLastBreakpointAttribute({
						target,
						prefix,
						breakpoint,
						attributes: options,
						isHover: false,
				  })
				: getDefaultAttr(`${target}.u`),
			isReset: true,
		});
	};

	return (
		<div className='maxi-background-control__size'>
			<AdvancedNumberControl
				label={__('Width', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: '_w',
					prefix,
					breakpoint,
					attributes: options,
					isHover,
				})}
				allowedUnits={['px', 'em', 'vw', '%']}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: '_w.u',
					prefix,
					breakpoint,
					attributes: options,
					isHover,
				})}
				onChangeValue={val => {
					onChange({
						[getAttributeKey({
							key: '_w',
							isHover,
							prefix,
							breakpoint,
						})]: val,
					});
				}}
				onChangeUnit={val =>
					onChange({
						[getAttributeKey({
							key: '_w.u',
							isHover,
							prefix,
							breakpoint,
						})]: val,
					})
				}
				onReset={() => onReset('_w')}
				minMaxSettings={minMaxSettings}
			/>
			<AdvancedNumberControl
				label={__('Height', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: '_h',
					prefix,
					breakpoint,
					attributes: options,
					isHover,
				})}
				allowedUnits={['px', 'em', 'vw', '%']}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: '_h.u',
					prefix,
					breakpoint,
					attributes: options,
					isHover,
				})}
				onChangeValue={val => {
					onChange({
						[getAttributeKey({
							key: '_h',
							isHover,
							prefix,
							breakpoint,
						})]: val,
					});
				}}
				onChangeUnit={val =>
					onChange({
						[getAttributeKey({
							key: '_h.u',
							isHover,
							prefix,
							breakpoint,
						})]: val,
					})
				}
				onReset={() => onReset('_h')}
				minMaxSettings={minMaxSettings}
			/>
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
}) => {
	const { type } = options;
	const prefix = `${rawPrefix}b${type === 'shape' ? 'sv' : `${type[0]}w`}-`;

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
					...(key.includes(prefix) && { [`${key}-g`]: value }),
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
			<Size {...equivalentProps} options={options} isLayer={isLayer} />
			<PositionControl
				{...options}
				{...equivalentProps}
				className='maxi-background-control__position'
				disablePosition
				defaultAttributes={getDefaultLayerWithBreakpoint(
					`${type === 'shape' ? 'SVG' : type}Options`,
					'g',
					isHover
				)}
				disableRTC
			/>
		</>
	);
};

export default SizeAndPositionLayerControl;
