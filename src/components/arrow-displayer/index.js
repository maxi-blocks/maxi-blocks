/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl, RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isNil } from 'lodash';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const ArrowDisplayer = props => {
	const { arrow, className } = props;

	const arrowValue = !isObject(arrow) ? JSON.parse(arrow) : arrow;

	const arrowClasses = classnames(
		'maxi-container-arrow',
		`maxi-container-arrow__${arrowValue.general.side}`,
		className
	);

	return !!arrowValue.active && <div className={arrowClasses} />;
};

export default ArrowDisplayer;
