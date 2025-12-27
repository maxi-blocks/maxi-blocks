/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

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
 * Shape divider icon loader - dynamically imports only the icon needed
 */
const shapeDividerIcons = {
	'waves-top': () => import('@maxi-icons').then(m => m.wavesTop),
	'waves-bottom': () => import('@maxi-icons').then(m => m.wavesBottom),
	'waves-top-opacity': () => import('@maxi-icons').then(m => m.wavesTopOpacity),
	'waves-bottom-opacity': () => import('@maxi-icons').then(m => m.wavesBottomOpacity),
	'wave-top': () => import('@maxi-icons').then(m => m.waveTop),
	'wave-bottom': () => import('@maxi-icons').then(m => m.waveBottom),
	'wave-top-opacity': () => import('@maxi-icons').then(m => m.waveTopOpacity),
	'wave-bottom-opacity': () => import('@maxi-icons').then(m => m.waveBottomOpacity),
	'triangle-top': () => import('@maxi-icons').then(m => m.triangleTop),
	'triangle-bottom': () => import('@maxi-icons').then(m => m.triangleBottom),
	'swish-top': () => import('@maxi-icons').then(m => m.swishTop),
	'swish-bottom': () => import('@maxi-icons').then(m => m.swishBottom),
	'swish-top-opacity': () => import('@maxi-icons').then(m => m.swishTopOpacity),
	'swish-bottom-opacity': () => import('@maxi-icons').then(m => m.swishBottomOpacity),
	'slant-top': () => import('@maxi-icons').then(m => m.slantTop),
	'slant-bottom': () => import('@maxi-icons').then(m => m.slantBottom),
	'slant-top-opacity': () => import('@maxi-icons').then(m => m.slantTopOpacity),
	'slant-bottom-opacity': () => import('@maxi-icons').then(m => m.slantBottomOpacity),
	'peak-top': () => import('@maxi-icons').then(m => m.peakTop),
	'peak-bottom': () => import('@maxi-icons').then(m => m.peakBottom),
	'mountains-top': () => import('@maxi-icons').then(m => m.mountainsTop),
	'mountains-bottom': () => import('@maxi-icons').then(m => m.mountainsBottom),
	'mountains-top-opacity': () => import('@maxi-icons').then(m => m.mountainsTopOpacity),
	'mountains-bottom-opacity': () => import('@maxi-icons').then(m => m.mountainsBottomOpacity),
	'curve-top': () => import('@maxi-icons').then(m => m.curveTop),
	'curve-bottom': () => import('@maxi-icons').then(m => m.curveBottom),
	'curve-top-opacity': () => import('@maxi-icons').then(m => m.curveTopOpacity),
	'curve-bottom-opacity': () => import('@maxi-icons').then(m => m.curveBottomOpacity),
	'arrow-top': () => import('@maxi-icons').then(m => m.arrowTop),
	'arrow-bottom': () => import('@maxi-icons').then(m => m.arrowBottom),
	'arrow-top-opacity': () => import('@maxi-icons').then(m => m.arrowTopOpacity),
	'arrow-bottom-opacity': () => import('@maxi-icons').then(m => m.arrowBottomOpacity),
	'asymmetric-top': () => import('@maxi-icons').then(m => m.asymmetricTop),
	'asymmetric-bottom': () => import('@maxi-icons').then(m => m.asymmetricBottom),
	'asymmetric-top-opacity': () => import('@maxi-icons').then(m => m.asymmetricTopOpacity),
	'asymmetric-bottom-opacity': () => import('@maxi-icons').then(m => m.asymmetricBottomOpacity),
	'cloud-top': () => import('@maxi-icons').then(m => m.cloudTop),
	'cloud-bottom': () => import('@maxi-icons').then(m => m.cloudBottom),
	'cloud-top-opacity': () => import('@maxi-icons').then(m => m.cloudTopOpacity),
	'cloud-bottom-opacity': () => import('@maxi-icons').then(m => m.cloudBottomOpacity),
};

/**
 * Component
 */
const ShapeDivider = ({ location, ...props }) => {
	const [icon, setIcon] = useState(null);
	const shapeStyle = props[`shape-divider-${location}-shape-style`];

	useEffect(() => {
		// Reset icon when style changes
		setIcon(null);

		if (shapeStyle && shapeDividerIcons[shapeStyle]) {
			shapeDividerIcons[shapeStyle]().then(loadedIcon => {
				setIcon(loadedIcon);
			});
		}
	}, [shapeStyle]);

	const classes = classnames(
		'maxi-shape-divider',
		`maxi-shape-divider__${location}`
	);

	return (
		!isEmpty(icon) && (
			<div className={classes} aria-label={props['aria-label']}>
				{icon}
			</div>
		)
	);
};

export default ShapeDivider;
