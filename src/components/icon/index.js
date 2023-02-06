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
import { Dashicon } from '@wordpress/components';

function Icon({ icon = null, size, avoidSize = false, ...additionalProps }) {
	if (typeof icon === 'string') {
		return <Dashicon icon={icon} size={size} {...additionalProps} />;
	}

	if (isValidElement(icon) && Dashicon === icon.type) {
		return cloneElement(icon, {
			...additionalProps,
		});
	}

	// Icons should be 24x24 by default.
	const iconSize = size || 24;
	if (typeof icon === 'function') {
		if (icon.prototype instanceof Component) {
			return createElement(icon, {
				...(!avoidSize && { size: iconSize }),
				...additionalProps,
			});
		}

		return icon({
			...(!avoidSize && { size: iconSize }),
			...additionalProps,
		});
	}

	if (icon && (icon.type === 'svg' || icon.type === SVG)) {
		const appliedProps = {
			...(!avoidSize && { width: iconSize, height: iconSize }),
			...icon.props,
			...additionalProps,
		};

		return <SVG {...appliedProps} />;
	}

	if (isValidElement(icon)) {
		return cloneElement(icon, {
			...(!avoidSize && { size: iconSize }),
			...additionalProps,
		});
	}

	return icon;
}

export default Icon;
