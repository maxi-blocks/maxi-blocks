/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RangeControl } = wp.components;

/**
 * External dependencies
 */
// import { getLastBreakpointValue } from '../../utils';
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';
// import getLastBreakpointValue from '../../extensions/styles/getLastBreakpointValue';

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
		opacity,
		defaultOpacity = 0,
		fullWidthMode = false,
		className,
		onChange,
	} = props;

	const classes = classnames(
		'maxi-opacity-control',
		fullWidthMode && 'maxi-opacity-control--full-width',
		className
	);

	return (
		<RangeControl
			label={isEmpty(label) ? __('Opacity', 'maxi-blocks') : label}
			className={classes}
			value={opacity}
			onChange={val => {
				isNil(val) ? onChange(defaultOpacity) : onChange(val);
			}}
			min={0}
			max={100}
			allowReset
			initialPosition={defaultOpacity}
		/>
	);
};

export default OpacityControl;
