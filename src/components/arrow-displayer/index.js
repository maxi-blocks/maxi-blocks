/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';

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
	const { className, breakpoint = 'g' } = props;
	const backgroundLayers = getAttributesValue({
		target: 'b_ly',
		props,
	});

	const arrowClasses = classnames(
		'maxi-container-arrow',
		`maxi-container-arrow__${getLastBreakpointAttribute({
			target: 'ar_sid',
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
			target: 'ar.s',
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
