/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import './style.scss';
import {
	wavesTop,
	wavesBottom,
	wavesTopOpacity,
	wavesBottomOpacity,
	waveTop,
	waveBottom,
	waveTopOpacity,
	waveBottomOpacity,
	triangleTop,
	triangleBottom,
	swishTop,
	swishBottom,
	swishTopOpacity,
	swishBottomOpacity,
	slantTop,
	slantBottom,
	slantTopOpacity,
	slantBottomOpacity,
	peakTop,
	peakBottom,
	mountainsTop,
	mountainsBottom,
	mountainsTopOpacity,
	mountainsBottomOpacity,
	curveTop,
	curveBottom,
	curveTopOpacity,
	curveBottomOpacity,
	arrowTop,
	arrowBottom,
	arrowTopOpacity,
	arrowBottomOpacity,
	asymmetricTop,
	asymmetricBottom,
	asymmetricTopOpacity,
	asymmetricBottomOpacity,
	cloudTop,
	cloudBottom,
	cloudTopOpacity,
	cloudBottomOpacity,
} from '@maxi-icons';

/**
 * Component
 */
const ShapeDivider = ({ location, ...props }) => {
	const showShapes = () => {
		switch (props[`shape-divider-${location}-shape-style`]) {
			case 'waves-top':
				return wavesTop;
			case 'waves-bottom':
				return wavesBottom;
			case 'waves-top-opacity':
				return wavesTopOpacity;
			case 'waves-bottom-opacity':
				return wavesBottomOpacity;
			case 'wave-top':
				return waveTop;
			case 'wave-bottom':
				return waveBottom;
			case 'wave-top-opacity':
				return waveTopOpacity;
			case 'wave-bottom-opacity':
				return waveBottomOpacity;
			case 'triangle-top':
				return triangleTop;
			case 'triangle-bottom':
				return triangleBottom;
			case 'swish-top':
				return swishTop;
			case 'swish-bottom':
				return swishBottom;
			case 'swish-top-opacity':
				return swishTopOpacity;
			case 'swish-bottom-opacity':
				return swishBottomOpacity;
			case 'slant-top':
				return slantTop;
			case 'slant-bottom':
				return slantBottom;
			case 'slant-top-opacity':
				return slantTopOpacity;
			case 'slant-bottom-opacity':
				return slantBottomOpacity;
			case 'peak-top':
				return peakTop;
			case 'peak-bottom':
				return peakBottom;
			case 'mountains-top':
				return mountainsTop;
			case 'mountains-bottom':
				return mountainsBottom;
			case 'mountains-top-opacity':
				return mountainsTopOpacity;
			case 'mountains-bottom-opacity':
				return mountainsBottomOpacity;
			case 'curve-top':
				return curveTop;
			case 'curve-bottom':
				return curveBottom;
			case 'curve-top-opacity':
				return curveTopOpacity;
			case 'curve-bottom-opacity':
				return curveBottomOpacity;
			case 'arrow-top':
				return arrowTop;
			case 'arrow-bottom':
				return arrowBottom;
			case 'arrow-top-opacity':
				return arrowTopOpacity;
			case 'arrow-bottom-opacity':
				return arrowBottomOpacity;
			case 'asymmetric-top':
				return asymmetricTop;
			case 'asymmetric-bottom':
				return asymmetricBottom;
			case 'asymmetric-top-opacity':
				return asymmetricTopOpacity;
			case 'asymmetric-bottom-opacity':
				return asymmetricBottomOpacity;
			case 'cloud-top':
				return cloudTop;
			case 'cloud-bottom':
				return cloudBottom;
			case 'cloud-top-opacity':
				return cloudTopOpacity;
			case 'cloud-bottom-opacity':
				return cloudBottomOpacity;
			default:
				return '';
		}
	};

	const classes = classnames(
		'maxi-shape-divider',
		`maxi-shape-divider__${location}`
	);

	return (
		!isEmpty(showShapes()) && (
			<div className={classes} aria-label={props['aria-label']}>
				{showShapes()}
			</div>
		)
	);
};

export default ShapeDivider;
