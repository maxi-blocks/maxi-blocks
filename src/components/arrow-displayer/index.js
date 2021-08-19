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

	const simpleBackgroundColorStatus =
		!props['background-layers-status'] &&
		props['background-active-media'] === 'color';

	const layerBackgroundColorStatus =
		props['background-layers-status'] &&
		(props['background-layers'] === undefined ||
			props['background-layers'].length < 1 ||
			props['background-layers'][props['background-layers'].length - 1]
				.type !== 'color');

	return (
		!!props['arrow-status'] &&
		(simpleBackgroundColorStatus || layerBackgroundColorStatus) && (
			<div className={arrowClasses}>
				<div className='maxi-container-arrow--content' />
			</div>
		)
	);
};

export default ArrowDisplayer;
