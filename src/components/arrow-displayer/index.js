/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

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
