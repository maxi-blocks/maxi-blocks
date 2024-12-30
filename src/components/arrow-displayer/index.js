/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const ArrowDisplayer = props => {
	const {
		className,
		breakpoint = 'general',
		'background-layers': backgroundLayers,
	} = props;

	const arrowClasses = classnames(
		'maxi-container-arrow',
		`maxi-container-arrow__${getLastBreakpointAttribute({
			target: 'arrow-side',
			breakpoint,
			attributes: props,
		})}`,
		className
	);

	const backgroundLayer = !isEmpty(backgroundLayers)
		? backgroundLayers.some(layer => layer.type === 'color')
		: false;

	const shouldDisplayBorder =
		!!getLastBreakpointAttribute({
			target: 'arrow-status',
			breakpoint,
			attributes: props,
		}) && backgroundLayer;

	return (
		shouldDisplayBorder && (
			<div className={arrowClasses}>
				<div className='maxi-container-arrow--content' />
			</div>
		)
	);
};

export default ArrowDisplayer;
