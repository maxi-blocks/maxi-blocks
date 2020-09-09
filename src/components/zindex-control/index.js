/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import __experimentalNumberControl from '../number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Component
 */
const ZIndexControl = props => {
	const { zIndex, defaultZIndex, onChange, className, breakpoint } = props;

	const classes = classnames('maxi-zIndex-control', className);

	const value = !isObject(zIndex) ? JSON.parse(zIndex) : zIndex;

	const defaultValue = !isObject(defaultZIndex)
		? JSON.parse(defaultZIndex)
		: defaultZIndex;

	return (
		<__experimentalNumberControl
			label={__('Z-index', 'maxi-blocks')}
			className={classes}
			value={getLastBreakpointValue(value, 'z-index', breakpoint)}
			defaultValue={defaultValue[breakpoint]['z-index']}
			onChange={val => {
				value[breakpoint]['z-index'] = val;
				onChange(JSON.stringify(value));
			}}
		/>
	);
};

export default ZIndexControl;
