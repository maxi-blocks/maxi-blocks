/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import { isArray } from 'lodash';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import PositionControl from '../position-control';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getDefaultLayerAttr, getDefaultLayerAttrs } from './utils';

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
			minRange: -1999,
			maxRange: 1999,
		},
		em: {
			min: 0,
			max: 1999,
			minRange: -1999,
			maxRange: 1999,
		},
		vw: {
			min: 0,
			max: 1999,
			minRange: -1999,
			maxRange: 1999,
		},
		vh: {
			min: 0,
			max: 1999,
			minRange: -1999,
			maxRange: 1999,
		},
		'%': {
			min: 0,
			max: 1999,
			minRange: -1999,
			maxRange: 1999,
		},
	};

	const getDefaultAttr = target => {
		if (isLayer) {
			const { type } = options;

			// getDefaultLayerAttr does not support breakpoints,
			// so I wrote a little hack to reset it correctly
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

	return (
		<div className='maxi-background-control__size'>
			<AdvancedNumberControl
				label={__('Size', 'maxi-blocks')}
				value={getLastBreakpointAttribute({
					target: `${prefix}size`,
					breakpoint,
					attributes: options,
					isHover,
				})}
				allowedUnits={['px', 'em', 'vw', '%']}
				enableUnit
				unit={getLastBreakpointAttribute({
					target: `${prefix}size-unit`,
					breakpoint,
					attributes: options,
					isHover,
				})}
				onChangeValue={val => {
					onChange({
						[getAttributeKey('size', isHover, prefix, breakpoint)]:
							val,
					});
				}}
				onChangeUnit={val =>
					onChange({
						[getAttributeKey(
							'size-unit',
							isHover,
							prefix,
							breakpoint
						)]: val,
					})
				}
				onReset={() =>
					onChange({
						[getAttributeKey('size', isHover, prefix, breakpoint)]:
							getDefaultAttr('size'),
						[getAttributeKey(
							'size-unit',
							isHover,
							prefix,
							breakpoint
						)]: getDefaultAttr('size-unit'),
					})
				}
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
			<Size {...equivalentProps} options={options} isLayer={isLayer} />
			<PositionControl
				{...options}
				{...equivalentProps}
				className='maxi-background-control__position'
				disablePosition
				onResetCustom={(
					customBreakpoint,
					reset,
					inputsArray,
					getKey,
					onChange
				) => {
					const response = {};

					const attributesKeysFilter = rawKeys => {
						const keys = isArray(rawKeys) ? rawKeys : [rawKeys];

						const filteredResult = inputsArray.filter(input =>
							keys.some(
								key =>
									input === key ||
									(input.includes(key) &&
										input.includes('-unit'))
							)
						);

						return filteredResult;
					};

					const top = inputsArray[0];
					const right = inputsArray[1];
					const bottom = inputsArray[2];
					const left = inputsArray[3];

					const cases = {
						all: [top, bottom, left, right],
						vertical: [top, bottom],
						horizontal: [left, right],
						top,
						right,
						bottom,
						left,
						unit: ['unit'],
					};

					const attributesKeys = cases[reset]
						? attributesKeysFilter(cases[reset])
						: [...inputsArray];

					attributesKeys.forEach(key => {
						response[
							getAttributeKey(
								getKey(key),
								isHover,
								false,
								customBreakpoint ?? breakpoint
							)
						] = getDefaultLayerAttr(`${type}Options`, getKey(key));
					});
					onChange(response);
				}}
			/>
		</>
	);
};

export default SizeAndPositionLayerControl;
