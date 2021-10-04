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
const getIsBackgroundColor = props => {
	const bgLayersStatus = Object.entries(props).some(([key, val]) => {
		if (key.includes('background-layers-status')) return !!val;

		return false;
	});

	if (bgLayersStatus) return false;

	// eslint-disable-next-line consistent-return
	const activeMedias = Object.entries(props).filter(([key, val]) => {
		if (key.includes('background-active-media')) return val === 'color';

		return false;
	});
	const isBackgroundColor =
		activeMedias.length > 0 &&
		activeMedias.every(activeMedia => activeMedia[1] === 'color');

	return isBackgroundColor;
};

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

	const isBackgroundColor = getIsBackgroundColor(props);

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
