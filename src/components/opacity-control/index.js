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
import { isNil, isNumber, round, isEmpty } from 'lodash';

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
		className,
		onChange,
		breakpoint = 'general',
	} = props;

	const opacity = { ...props.opacity };
	const defaultOpacity = { ...props.defaultOpacity };

	const classes = classnames(
		'maxi-opacity-control',
		fullWidthMode && 'maxi-opacity-control--full-width',
		className
	);

	const getValue = () => {
		const response = getLastBreakpointValue(opacity, 'opacity', breakpoint);

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
					? (opacity[breakpoint].opacity =
							defaultOpacity[breakpoint].opacity)
					: (opacity[breakpoint].opacity = Number(val / 100));
				onChange(opacity);
			}}
			min={0}
			max={100}
			allowReset
			initialPosition={defaultOpacity[breakpoint].opacity}
		/>
	);
};

export default OpacityControl;
