/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const ArrowDisplayer = props => {
	const { className, breakpoint = 'general' } = props;

	const arrowClasses = classnames(
		'maxi-container-arrow',
		`maxi-container-arrow__${getLastBreakpointAttribute(
			'arrow-side',
			breakpoint,
			props
		)}`,
		className
	);

	return !!props['arrow-status'] && <div className={arrowClasses} />;
};

export default ArrowDisplayer;
