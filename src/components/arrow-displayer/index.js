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

	const isBackgroundColor =
		!props['background-layers-status'] &&
		props['background-active-media'] === 'color';

	const shouldDisplayBorder = !!props['arrow-status'] && isBackgroundColor;

	return (
		shouldDisplayBorder && (
			<div className={arrowClasses}>
				<div className='maxi-container-arrow--content' />
			</div>
		)
	);
};

export default ArrowDisplayer;
