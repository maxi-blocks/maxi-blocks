/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import NumberControl from '../number-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';

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

	return (
		<NumberControl
			label={__('Z-index', 'maxi-blocks')}
			className={classes}
			value={getLastBreakpointAttribute('z-index', breakpoint, props)}
			defaultZIndex={getDefaultAttribute(`z-index-${breakpoint}`)}
			onChange={val => onChange({ [`z-index-${breakpoint}`]: val })}
		/>
	);
};

export default ZIndexControl;
