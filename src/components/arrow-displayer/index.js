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
	const { className } = props;

	const arrow = { ...props.arrow };

	const arrowClasses = classnames(
		'maxi-container-arrow',
		`maxi-container-arrow__${arrow.general.side}`,
		className
	);

	return !!arrow.active && <div className={arrowClasses} />;
};

export default ArrowDisplayer;
