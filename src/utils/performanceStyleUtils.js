/**
 * Performance-optimized style utilities
 * Replace expensive inline style operations with CSS classes + CSS variables
 */

/**
 * Set CSS custom property instead of inline style
 * Much faster than direct DOM manipulation
 */
export const setPerformanceStyles = ({ 
	obj, 
	uniqueID, 
	target = '', 
	styleType = 'general'
}) => {
	if (!obj || !uniqueID) return;

	const blockElement = document.querySelector(`[id="${uniqueID}"]`);
	if (!blockElement) return;

	// Set CSS custom properties (much faster than style attribute)
	Object.entries(obj).forEach(([property, value]) => {
		const cssVar = `--maxi-${styleType}-${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
		blockElement.style.setProperty(cssVar, value);
	});

	// Add performance utility class
	const utilityClass = `maxi-block--has-custom-${styleType}`;
	if (!blockElement.classList.contains(utilityClass)) {
		blockElement.classList.add(utilityClass);
	}
};

/**
 * Clean performance styles
 * Remove CSS custom properties and utility classes
 */
export const cleanPerformanceStyles = ({ 
	uniqueID, 
	target = '', 
	styleType = 'general' 
}) => {
	if (!uniqueID) return;

	const blockElement = document.querySelector(`[id="${uniqueID}"]`);
	if (!blockElement) return;

	// Remove utility class
	const utilityClass = `maxi-block--has-custom-${styleType}`;
	blockElement.classList.remove(utilityClass);

	// Remove CSS custom properties with prefix
	const styles = blockElement.style;
	const prefix = `--maxi-${styleType}-`;
	
	// Get all CSS custom properties to remove
	const propsToRemove = [];
	for (let i = 0; i < styles.length; i++) {
		const propName = styles[i];
		if (propName.startsWith(prefix)) {
			propsToRemove.push(propName);
		}
	}

	// Remove the properties
	propsToRemove.forEach(prop => {
		styles.removeProperty(prop);
	});
};

/**
 * Optimized background style setter
 */
export const setBackgroundStyles = ({ obj, uniqueID }) => {
	setPerformanceStyles({ 
		obj, 
		uniqueID, 
		styleType: 'background' 
	});
};

/**
 * Optimized text color style setter
 */
export const setTextColorStyles = ({ obj, uniqueID }) => {
	setPerformanceStyles({ 
		obj, 
		uniqueID, 
		styleType: 'text' 
	});
};

/**
 * Optimized border style setter
 */
export const setBorderStyles = ({ obj, uniqueID }) => {
	setPerformanceStyles({ 
		obj, 
		uniqueID, 
		styleType: 'border' 
	});
};

/**
 * Optimized box shadow style setter
 */
export const setBoxShadowStyles = ({ obj, uniqueID }) => {
	setPerformanceStyles({ 
		obj, 
		uniqueID, 
		styleType: 'shadow' 
	});
};

/**
 * High-performance style update with batching
 * Reduces reflows by batching style changes
 */
export const batchStyleUpdates = (updates, callback) => {
	// Use requestAnimationFrame for optimal timing
	requestAnimationFrame(() => {
		updates.forEach(update => update());
		if (callback) callback();
	});
};

/**
 * Check if performance utilities are supported
 */
export const supportsPerformanceUtils = () => {
	return typeof CSS !== 'undefined' && CSS.supports && CSS.supports('--test', '1');
};