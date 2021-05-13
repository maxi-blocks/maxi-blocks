/**
 * WordPress dependencies
 */
import { SVG } from '@wordpress/primitives';
import {
	cloneElement,
	createElement,
	Component,
	isValidElement,
} from '@wordpress/element';

function Icon({ icon = null, size, ...additionalProps }) {
	// Icons should be 24x24 by default.
	const iconSize = size || 24;
	if (typeof icon === 'function') {
		if (icon.prototype instanceof Component) {
			return createElement(icon, {
				size: iconSize,
				...additionalProps,
			});
		}

		return icon({ size: iconSize, ...additionalProps });
	}

	if (icon && (icon.type === 'svg' || icon.type === SVG)) {
		const appliedProps = {
			width: iconSize,
			height: iconSize,
			...icon.props,
			...additionalProps,
		};

		return <SVG {...appliedProps} />;
	}

	if (isValidElement(icon)) {
		return cloneElement(icon, {
			size: iconSize,
			...additionalProps,
		});
	}

	return icon;
}

export default Icon;
