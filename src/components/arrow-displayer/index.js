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
		`maxi-container-arrow__${props[`arrow-side-${breakpoint}`]}`,
		className
	);

	return !!props['arrow-status'] && <div className={arrowClasses} />;
};

export default ArrowDisplayer;
