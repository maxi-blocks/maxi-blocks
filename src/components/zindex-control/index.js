/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import NumberControl from '../number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ZIndexControl = props => {
	const { onChange, className, breakpoint } = props;

	const classes = classnames('maxi-zIndex-control', className);

	const zIndex = { ...props.zIndex };
	const defaultZIndex = { ...props.defaultZIndex };

	return (
		<NumberControl
			label={__('Z-index', 'maxi-blocks')}
			className={classes}
			value={getLastBreakpointValue(zIndex, 'z-index', breakpoint)}
			defaultZIndex={defaultZIndex[breakpoint]['z-index']}
			onChange={val => {
				zIndex[breakpoint]['z-index'] = val;
				onChange(zIndex);
			}}
		/>
	);
};

export default ZIndexControl;
