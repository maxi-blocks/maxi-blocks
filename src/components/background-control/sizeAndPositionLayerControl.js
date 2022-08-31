/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
import { cloneDeep, upperCase } from 'lodash';

/**
 * Component
 */
const Size = props => {
	const {
		type,
		breakpoint,
		isHover,
		isLayer = false,
		onChange,
		prefix = '',
		options,
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
		if (isLayer)
			return getDefaultLayerAttr(
				`${type === 'svg' ? upperCase(type) : type}Options`,
				`${prefix}${target}-${breakpoint}`
			);

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
		type,
		prefix: rawPrefix = '',
		onChange,
		isHover = false,
		breakpoint,
		options: rawOptions,
	} = props;
	const prefix = `${rawPrefix}background-${type}-wrapper-`;

	const options = cloneDeep(rawOptions);

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
