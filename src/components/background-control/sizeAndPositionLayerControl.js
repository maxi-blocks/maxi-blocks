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
} from '../../extensions/styles';
import { getDefaultLayerAttr } from './utils';

/**
 * External dependencies
 */
import { upperCase } from 'lodash';

/**
 * Component
 */
const Size = props => {
	const {
		options,
		breakpoint,
		isHover,
		isLayer = false,
		onChange,
		prefix = '',
	} = props;

	const minMaxSettings = {
		px: {
			min: 0,
			max: 3999,
		},
		em: {
			min: 0,
			max: 999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 999,
		},
	};

	const getDefaultAttr = target => {
		if (isLayer) {
			const { type } = options;

			// getDefaultLayerAttr does not support breakpoints,
			// so I wrote a little hack to reset it correctly
			return breakpoint === 'general'
				? getDefaultLayerAttr(
						`${type === 'svg' ? upperCase(type) : type}Options`,
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

const SizeAndPositionLayerControl = props => {
	const {
		options,
		prefix: rawPrefix = '',
		onChange,
		isHover = false,
		breakpoint,
	} = props;
	const { type } = options;
	const prefix = `${rawPrefix}background-${type}-${
		type === 'svg' ? '' : 'wrapper-'
	}`;

	// Add new attributes if they are not exist
	useEffect(() => {
		if (
			type !== 'svg' &&
			Object.keys(options).every(key => !key.includes(prefix))
		) {
			const defaultOptions = Object.entries(
				getDefaultLayerAttr(`${type}Options`)
			).reduce(
				(acc, [key, value]) => ({
					...acc,
					...(key.includes(prefix) && { [`${key}-general`]: value }),
				}),
				{}
			);

			onChange({ ...options, ...defaultOptions });
		}
	}, []);

	return (
		<>
			<Size {...props} prefix={prefix} />
			<PositionControl
				{...options}
				className='maxi-background-control__position'
				prefix={prefix}
				onChange={onChange}
				breakpoint={breakpoint}
				isHover={isHover}
				disablePosition
			/>
		</>
	);
};

export default SizeAndPositionLayerControl;
