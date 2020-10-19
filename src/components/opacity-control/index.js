/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl } = wp.components;

/**
 * External dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import classnames from 'classnames';
import { isObject, isNil, isNumber, round, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const OpacityControl = props => {
	const {
		label,
		fullWidthMode = false,
		opacity,
		defaultOpacity,
		className,
		onChange,
		breakpoint = 'general',
	} = props;

	const value = !isObject(opacity) ? JSON.parse(opacity) : opacity;

	const defaultValue = !isObject(defaultOpacity)
		? JSON.parse(defaultOpacity)
		: defaultOpacity;

	const classes = classnames(
		'maxi-opacity-control',
		fullWidthMode && 'maxi-opacity-control__full-width',
		className
	);

	const getValue = () => {
		const response = getLastBreakpointValue(value, 'opacity', breakpoint);

		if (!isNumber(response)) return response;

		return round(response * 100);
	};

	return (
		<RangeControl
			label={isEmpty(label) ? __('Opacity', 'maxi-blocks') : label}
			className={classes}
			value={getValue()}
			onChange={val => {
				isNil(val)
					? (value[breakpoint].opacity =
							defaultValue[breakpoint].opacity)
					: (value[breakpoint].opacity = Number(val / 100));
				onChange(JSON.stringify(value));
			}}
			min={0}
			max={100}
			allowReset
			initialPosition={defaultValue[breakpoint].opacity}
		/>
	);
};

export default OpacityControl;
