/**
 * Some ESLint deactivated rules. This file needs to be refactored
 */
/* eslint-disable no-sequences */
/* eslint-disable prefer-const */
/* eslint-disable no-continue */
/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from './utils';

/**
 * External dependencies
 */
import { isNil, isNumber, isEmpty } from 'lodash';

/**
 * Responsive Frontend Styles resolver
 * Creates a new object ready to deliver responsive styles on frontend
 *
 * @todo    Comment and extend documentation
 */
export class ResponsiveStylesResolver {
	constructor(object, meta, breakpoints) {
		this.object = object;
		this.meta = meta;
		this.breakpoints = breakpoints;

		this.init();

		return this.meta;
	}

	init() {
		for (const [target, props] of Object.entries(this.object)) {
			const newEntry = {
				[target]: this.objectManipulator(props),
			};
			this.meta = Object.assign(this.meta, newEntry);

			// Alternative
			// this.meta[target] = this.objectManipulator(props);
		}
	}

	objectManipulator(props) {
		const response = {
			breakpoints: this.breakpoints,
			content: {},
		};

		for (const [key, value] of Object.entries(props)) {
			let newObject = {};

			newObject = this.propsObjectManipulator(
				value,
				newObject,
				'general'
			);
			newObject = this.propsObjectManipulator(value, newObject, 'xxl');
			newObject = this.propsObjectManipulator(value, newObject, 'xl');
			newObject = this.propsObjectManipulator(value, newObject, 'l');
			newObject = this.propsObjectManipulator(value, newObject, 'm');
			newObject = this.propsObjectManipulator(value, newObject, 's');
			newObject = this.propsObjectManipulator(value, newObject, 'xs');

			if (!isNil(newObject))
				Object.assign(response.content, {
					[props[key].label]: newObject,
				});
		}

		return response;
	}

	propsObjectManipulator(value, newObject, breakpoint) {
		if (isNil(value[breakpoint])) return newObject;

		const object = value[breakpoint];
		newObject[breakpoint] = {};
		let unitChecker = '';
		let unit = getLastBreakpointValue(value, 'unit', breakpoint) || '';

		const nonAllowedProps = ['font-options', 'unit'];

		for (const [target, prop] of Object.entries(object)) {
			if (isNil(prop)) {
				console.error(`Undefined property. Property: ${target}`);
				continue;
			}
			if (nonAllowedProps.includes(target)) continue;
			// values with dimensions
			if (
				isNumber(prop) ||
				(unitChecker.indexOf(target) === 0 && !isEmpty(prop))
			)
				newObject[breakpoint][target] = prop + unit;
			// avoid numbers with no related metric
			if (unitChecker.indexOf(target) === 0) unit = '';
			// values with metrics
			if (prop.length <= 2 && !isEmpty(prop))
				(unitChecker = target), (unit = prop);
			// values with strings && font-options object
			if (prop.length > 2 || target === 'font-options')
				newObject[breakpoint][target] = prop;
		}

		return newObject;
	}

	breakpointsObjectManipulator(props, newObject, key, type) {
		if (isNil(props[key][type])) return newObject;

		newObject.breakpoints = { ...props[key][type] };

		return newObject;
	}
}

/**
 * Responsive Backend Styles resolver
 */
export class BackEndResponsiveStyles {
	constructor(meta) {
		this.meta = meta;
		// Uses serverside loaded inline css
		this.target = document.getElementById('maxi-blocks-inline-css');
		!isNil(this.meta) ? this.initEvents() : null;
	}

	initEvents() {
		this.target == null ? this.createElement() : this.addValues();
	}

	/**
	 * Creates inline style element on DOM if server-side didn't created before
	 */
	createElement() {
		const style = document.createElement('style');
		style.id = 'maxi-blocks-inline-css';
		document.body.appendChild(style);
		this.target = style;
		this.addValues();
	}

	/**
	 * Adds values on the inline style element on DOM
	 */
	addValues() {
		const content = this.createContent();
		this.target.innerHTML = content;
	}

	/**
	 * Creates the content to append on the inline style element on DOM
	 */
	createContent() {
		let response = '';
		for (let [target, prop] of Object.entries(this.meta)) {
			if (isNil(prop.content)) continue;

			target = this.getTarget(target);

			for (const value of Object.values(prop.content)) {
				for (const [breakpoint, content] of Object.entries(value)) {
					if (isEmpty(content)) continue;

					if (breakpoint === 'general') {
						response += `body.maxi-blocks--active .maxi-block--backend.${target}{`;
						response += this.getResponsiveStyles(content);
						response += '}';
					}
					if (breakpoint === 'xxl') {
						response += `
							body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xxl"] .maxi-block--backend.${target}{`;
						response += this.getResponsiveStyles(content);
						response += '}';
					}
					if (breakpoint === 'xl') {
						response += `
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xl"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="l"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="m"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="s"] .maxi-block--backend.${target},
							body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block--backend.${target}{`;
						response += this.getResponsiveStyles(content);
						response += '}';
					}
					if (breakpoint === 'l') {
						response += `
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="l"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="m"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="s"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block--backend.${target}{`;
						response += this.getResponsiveStyles(content);
						response += '}';
					}
					if (breakpoint === 'm') {
						response += `
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="m"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="s"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block--backend.${target}{`;
						response += this.getResponsiveStyles(content);
						response += '}';
					}
					if (breakpoint === 's') {
						response += `
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="s"] .maxi-block--backend.${target},
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block--backend.${target}{`;
						response += this.getResponsiveStyles(content);
						response += '}';
					}
					if (breakpoint === 'xs') {
						response += `
                            body.maxi-blocks--active .edit-post-visual-editor.editor-styles-wrapper[maxi-blocks-responsive="xs"] .maxi-block--backend.${target}{`;
						response += this.getResponsiveStyles(content);
						response += '}';
					}
				}
			}
		}

		return response;
	}

	/**
	 * Retrieve cleaned target
	 *
	 * @param {string} target style target for scoping
	 */
	getTarget(target) {
		if (target.indexOf('__$:') !== -1) return target.replace('__$', '');
		if (target.indexOf('__$>') !== -1) return target.replace('__$', '');
		if (target.indexOf('__$#') !== -1) return target.replace('__$', '');
		return target.replace('__$', ' .');
	}

	/**
	 * Retrieve each one of the styles CSS props
	 *
	 * @param {obj} styles responsive styles device
	 */
	getResponsiveStyles(styles) {
		let responsiveStyles = '';
		for (const [key, value] of Object.entries(styles)) {
			responsiveStyles += ` ${key}: ${value};`;
		}
		return responsiveStyles;
	}
}
