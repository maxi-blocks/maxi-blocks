/**
 * Internal dependencies
 */
import getBlockNameFromUniqueID from '@extensions/attributes/getBlockNameFromUniqueID';
import { getIsSiteEditor, getSiteEditorIframe } from '@extensions/fse';
import {
	debugPreview as debugRelationPreview,
	isPreviewDebugEnabled as getIsPreviewDebugEnabled,
	isPreviewDeepDebugEnabled as getIsPreviewDeepDebugEnabled,
} from './debugPreview';

const PREVIEW_HOVER_LEAVE_DEBOUNCE = 120;
const PREVIEW_HOVER_BOUNDS_TOLERANCE = 2;

// Relations (IB)
class Relation {
	constructor(item, relationAction = null, relationIndex = null) {
		this.id = item?.id;
		this.uniqueID = item?.uniqueID;
		this.css = item?.css;
		this.isPreview = false;

		if (!this.uniqueID || this.css.length === 0) return;

		this.mainDocument = document;
		this.mainWindow = window;

		this.isSiteEditor = getIsSiteEditor();

		// In WP7+, both the site editor and the post/page editor use an iframe
		// canvas (iframe[name="editor-canvas"]). getSiteEditorIframe() already
		// handles both FSE and non-FSE iframe selectors, so always try it first.
		const editorIframeDoc = getSiteEditorIframe();
		// Track whether we're rendering inside an iframe canvas (FSE or WP7+ post editor).
		// This affects the CSS selector format: when blocks are in an iframe, the body
		// element IS the editor-styles-wrapper, so selectors use body.maxi-blocks--active.editor-styles-wrapper
		// (no space). In legacy non-iframe post editor, it's body.maxi-blocks--active .edit-post-visual-editor.
		this.isEditorIframe = !!editorIframeDoc;
		if (editorIframeDoc) {
			this.mainDocument = editorIframeDoc;
			const iframe = document.querySelector(
				'iframe[name="editor-canvas"]'
			);
			if (iframe) this.mainWindow = iframe.contentWindow;
		} else if (this.isSiteEditor) {
			// Fallback: explicit FSE iframe selectors (older WP versions)
			const fseIframe =
				document.querySelector(
					'.edit-site-visual-editor .components-resizable-box__container iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
				) ??
				document.querySelector(
					'.editor-visual-editor .components-resizable-box__container iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
				);
			if (fseIframe) this.mainWindow = fseIframe.contentWindow;
		}

		this.trigger = item.trigger;
		this.triggerEl = this.mainDocument.querySelector(`.${this.trigger}`);

		this.blockTarget = `.${this.uniqueID}`;
		this.blockTargetEl = this.mainDocument.querySelector(this.blockTarget);
		this.target = item.target ?? '';

		// When blocks are rendered inside an iframe (FSE or WP7+ post editor),
		// the canvas uses .editor-styles-wrapper. Legacy non-iframe post editors
		// use .edit-post-visual-editor on the outer document.
		this.targetPrefix =
			editorIframeDoc || this.isSiteEditor
				? '.editor-styles-wrapper[maxi-blocks-responsive] .maxi-block.maxi-block--backend'
				: '.edit-post-visual-editor[maxi-blocks-responsive] .maxi-block.maxi-block--backend';

		this.fullTarget = `${this.targetPrefix}${this.blockTarget} ${this.target}`;
		this.targetEl = this.mainDocument.querySelector(this.fullTarget);
		this.dataTarget = `${this.targetPrefix}${
			this.blockTarget
		}[data-maxi-relations="true"]${`[data-type="maxi-blocks/${getBlockNameFromUniqueID(
			this.uniqueID
		)}"]`}`;

		if (!this.triggerEl || !this.targetEl) {
			this.debugPreview('constructor:missing-elements', {
				triggerFound: !!this.triggerEl,
				targetFound: !!this.targetEl,
				triggerSelector: `.${this.trigger}`,
				targetSelector: this.fullTarget,
			});
			return;
		}

		this.defaultTransition = this.mainWindow
			.getComputedStyle(this.targetEl)
			.getPropertyValue('transition');

		this.breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		this.hasMultipleTargetsArray = Array.isArray(this.css)
			? this.css.map(item =>
					Object.keys(item).some(
						key => !this.breakpoints.includes(key)
					)
			  )
			: [];

		this.action = item.action;
		this.sids = item.sid || item.settings || [];
		this.effects = item.effects;
		this.attributes = item.attributes;

		({ stylesObjs: this.stylesObjs, effectsObjs: this.effectsObjs } =
			this.generateCssResponsiveObj());

		this.breakpointsObj = this.generateBreakpointsObj();

		this.hoverStatus = this.effects.some(item => item.hoverStatus);
		this.isContained = this.triggerEl.contains(this.targetEl);
		this.isHoveredContained = this.hoverStatus && this.isContained;

		// transitionTrigger is an alternative trigger to target; not always used
		// Check its eventListeners to understand better about its responsibility
		this.transitionTriggers = Array.from(
			new Set(
				this.effects.map(
					item => !item.disableTransition && item.transitionTrigger
				)
			)
		).filter(Boolean);
		this.transitionTriggerEls =
			this.transitionTriggers.length > 0
				? this.transitionTriggers.map(transitionTrigger =>
						transitionTrigger
							? this.blockTargetEl.querySelector(
									transitionTrigger
							  )
							: this.targetEl
				  )
				: [this.targetEl];

		this.transitionTargetsArray = this.effects.map(item => {
			if (item.disableTransition) return [''];

			switch (typeof item.transitionTarget) {
				case 'string':
					return [item.transitionTarget];
				case 'object':
					if (item.transitionTarget?.length > 0)
						return item.transitionTarget;
					return [''];
				default:
					return [''];
			}
		});

		this.isBorderArray = this.attributes.map(attributes =>
			Object.keys(attributes).some(attr => attr.startsWith('border'))
		);
		this.isIconArray = this.sids.map(
			sid =>
				sid === 'ic' ||
				sid === 'bi' ||
				// support for old versions
				sid === 'Icon colour' ||
				sid === 'Button icon'
		);
		this.isSVG = this.fullTarget.includes('svg-icon-maxi');
		this.avoidHoverArray = [];
		this.getAvoidHover();

		this.inTransitionString = '';
		this.outTransitionString = '';
		this.generateTransitions();

		this.stylesString = '';
		this.generateStyles();

		this.stylesEl = null;
		this.inTransitionEl = null;
		this.outTransitionEl = null;
		this.previewStylesEl = null;
		this.previewInTransitionEl = null;
		this.previewOutTransitionEl = null;
		this.previewTransitionType = null;
		this.previewAnimations = [];
		this.previewAnimationBaseStyles = new Map();
		this.generateStylesEls();

		// Prevents removing the IB transitions before they end when mouse leave the IB trigger
		this.transitionTimeout = null;
		// Prevents IB transitions overwrite native hover ones (when is contained) when mouse
		// leave the hover transition trigger
		this.contentTimeout = null;
		this.previewDemoRequestId = null;
		this.previewDemoRequestType = null;
		this.previewHoverLeaveTimeout = null;
		this.previewHoverBounds = null;
		this.previewPointerPosition = null;
		this.debugPreview('constructor:ready', {
			defaultTransition: this.defaultTransition,
			inTransition: this.getStyleDebug(this.inTransitionEl),
			outTransition: this.getStyleDebug(this.outTransitionEl),
			style: this.getStyleDebug(this.stylesEl),
			targets: this.getPreviewTargetDetails(),
		});
		this.debugPreviewDeep('constructor:ready:deep', () =>
			this.getDeepPreviewDebugDetails('constructor:ready')
		);
	}

	// Create two different <style> elements, one for the styles and one for the transitions.
	generateStylesEls() {
		this.stylesEl = this.mainDocument.createElement('style');
		this.stylesEl.id = `relations--${this.uniqueID}-${this.id}-styles`;
		this.stylesEl.setAttribute('data-type', this.action);
		this.stylesEl.setAttribute('data-sids', this.sids);
		this.stylesEl.innerText = this.stylesString;

		if (this.inTransitionString.length > 0) {
			this.inTransitionEl = this.mainDocument.createElement('style');
			this.inTransitionEl.id = `relations--${this.uniqueID}-${this.id}-in-transitions`;
			this.inTransitionEl.setAttribute('data-type', this.action);
			this.inTransitionEl.setAttribute('data-sids', this.sids);
			this.inTransitionEl.innerText = this.inTransitionString;
		}
		if (this.outTransitionString.length > 0) {
			this.outTransitionEl = this.mainDocument.createElement('style');
			this.outTransitionEl.id = `relations--${this.uniqueID}-${this.id}-out-transitions`;
			this.outTransitionEl.setAttribute('data-type', this.action);
			this.outTransitionEl.setAttribute('data-sids', this.sids);
			this.outTransitionEl.innerText = this.outTransitionString;
		}
	}

	// Insert transitions or styles element just after Maxi inline css element
	addStyleEl(styleEl) {
		if (!styleEl) return;

		if (!this.inlineStylesEl)
			this.inlineStylesEl = this.mainDocument.querySelector(
				'style[id*=maxi-blocks]'
			);

		const currentEl = this.mainDocument.querySelector(`#${styleEl.id}`);

		if (currentEl) currentEl.remove();

		this.inlineStylesEl.parentNode.insertBefore(
			styleEl,
			this.inlineStylesEl.nextSibling
		);
	}

	getPreviewStyleContent(styleEl) {
		return styleEl?.innerText || styleEl?.textContent || '';
	}

	getRelationDataAttributeRegExp() {
		return /\[data-maxi-relations=(?:"true"|'true'|true)\]/g;
	}

	getPreviewContentWithoutDataAttribute(content) {
		return (content || '').replace(
			this.getRelationDataAttributeRegExp(),
			''
		);
	}

	getPreviewBodyTargetSelector(target) {
		const targetSelector = target.trim();

		return this.isSiteEditor || this.isEditorIframe
			? `body.maxi-blocks--active${targetSelector}`.replace(
					/\s{2,}/g,
					' '
			  )
			: `body.maxi-blocks--active ${targetSelector}`.replace(
					/\s{2,}/g,
					' '
			  );
	}

	getPreviewHoverRootSelector() {
		return `body.maxi-blocks--active:has(.${this.trigger}:hover)`;
	}

	getPreviewHoverContent(styleEl) {
		return this.getPreviewContentWithoutDataAttribute(
			this.getPreviewStyleContent(styleEl)
		).replace(
			/body\.maxi-blocks--active/g,
			this.getPreviewHoverRootSelector()
		);
	}

	getPreviewBaseTargetContent(styleEl) {
		return this.getPreviewContentWithoutDataAttribute(
			this.getPreviewStyleContent(styleEl)
		);
	}

	getPreviewTransitionContent(styleEl) {
		return this.getPreviewStyleContent(styleEl).replace(
			this.getRelationDataAttributeRegExp(),
			':not([data-maxi-relations="__maxi-preview-disabled__"])'
		);
	}

	supportsCssHoverPreview() {
		if (this.action !== 'hover') return false;
		if (this.supportsWebAnimationPreview()) return false;

		const supports = this.mainWindow?.CSS?.supports;

		if (typeof supports !== 'function') return true;

		try {
			return supports.call(this.mainWindow.CSS, 'selector(:has(*))');
		} catch (error) {
			return true;
		}
	}

	getAnimationPropertyName(property) {
		return property.replace(/-([a-z])/g, (_match, letter) =>
			letter.toUpperCase()
		);
	}

	getAnimationCssPropertyName(property) {
		return property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
	}

	cleanAnimationStyleValue(value) {
		if (value === null || typeof value === 'undefined') return null;

		return String(value)
			.replace(/\s*!important\s*$/i, '')
			.trim();
	}

	isZeroTransformMatrix(value) {
		const normalizedValue = this.cleanAnimationStyleValue(value)
			?.replace(/\s+/g, '')
			.toLowerCase();

		return normalizedValue === 'matrix(0,0,0,0,0,0)';
	}

	isTransformMatrixValue(value) {
		const cleanValue = this.cleanAnimationStyleValue(value);

		return /^matrix(?:3d)?\(/i.test(cleanValue || '');
	}

	isNoneTransformValue(value) {
		return this.cleanAnimationStyleValue(value)?.toLowerCase() === 'none';
	}

	parseTransformMatrix(value) {
		const cleanValue = this.cleanAnimationStyleValue(value);
		const match = cleanValue?.match(/^matrix\(([^)]+)\)$/i);
		if (!match) return null;

		const parts = match[1]
			.split(',')
			.map(part => Number.parseFloat(part.trim()));

		if (parts.length !== 6 || parts.some(part => !Number.isFinite(part)))
			return null;

		const [a, b, c, d, e, f] = parts;

		return { a, b, c, d, e, f };
	}

	isIdentityTransformMatrix3d(value) {
		const cleanValue = this.cleanAnimationStyleValue(value);
		const match = cleanValue?.match(/^matrix3d\(([^)]+)\)$/i);
		if (!match) return false;

		const parts = match[1]
			.split(',')
			.map(part => Number.parseFloat(part.trim()));
		const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

		return (
			parts.length === identity.length &&
			parts.every(
				(part, index) =>
					Number.isFinite(part) &&
					Math.abs(part - identity[index]) < 0.000001
			)
		);
	}

	hasScaleTransformValue(value) {
		const cleanValue = this.cleanAnimationStyleValue(value);

		return /\bscale(?:3d|x|y)?\s*\(/i.test(cleanValue || '');
	}

	formatTransformNumber(value) {
		if (!Number.isFinite(value)) return '0';

		const normalizedValue = Math.abs(value) < 0.000001 ? 0 : value;

		return `${Number.parseFloat(normalizedValue.toFixed(6))}`;
	}

	getTransformArgumentUnit(argument, fallback = '') {
		const cleanArgument = this.cleanAnimationStyleValue(argument);
		const match = cleanArgument?.match(/[a-z%]+$/i);

		return match?.[0] ?? fallback;
	}

	getCompatibleTranslateValue(value, targetArgument) {
		const unit = this.getTransformArgumentUnit(targetArgument, 'px');
		const formattedValue = this.formatTransformNumber(value);

		if (formattedValue === '0') return `0${unit}`;
		if (unit === 'px') return `${formattedValue}px`;

		return (
			this.cleanAnimationStyleValue(targetArgument) ||
			`${formattedValue}px`
		);
	}

	getCompatibleAngleValue(value, targetArgument) {
		const unit = this.getTransformArgumentUnit(targetArgument, 'deg');
		const formattedValue = this.formatTransformNumber(value);

		if (formattedValue === '0' || unit === 'deg')
			return `${formattedValue}${unit}`;

		return (
			this.cleanAnimationStyleValue(targetArgument) ||
			`${formattedValue}deg`
		);
	}

	splitTransformArguments(value) {
		return String(value)
			.split(',')
			.map(part => part.trim())
			.filter(Boolean);
	}

	getMatrixTransformParts(matrix) {
		if (!matrix) return null;

		const { a, b, c, d, e, f } = matrix;
		const scaleX = Math.sqrt(a * a + b * b);
		const determinant = a * d - b * c;
		const scaleY =
			scaleX < 0.000001 ? Math.sqrt(c * c + d * d) : determinant / scaleX;
		const rotateZ =
			scaleX < 0.000001 ? 0 : (Math.atan2(b, a) * 180) / Math.PI;

		return {
			scaleX,
			scaleY,
			translateX: e,
			translateY: f,
			rotateZ,
		};
	}

	getCompatibleTransformValue(targetValue, value) {
		const cleanTargetValue = this.cleanAnimationStyleValue(targetValue);
		if (!cleanTargetValue)
			return this.cleanAnimationStyleValue(value) || 'none';

		const matrix = this.parseTransformMatrix(value);
		const matrixParts =
			matrix && !this.isZeroTransformMatrix(value)
				? this.getMatrixTransformParts(matrix)
				: null;
		const zeroScale =
			this.isZeroTransformMatrix(value) &&
			this.hasScaleTransformValue(cleanTargetValue);
		const scaleX = zeroScale ? 0 : matrixParts?.scaleX ?? 1;
		const scaleY = zeroScale ? 0 : matrixParts?.scaleY ?? 1;
		const translateX = matrixParts?.translateX ?? 0;
		const translateY = matrixParts?.translateY ?? 0;
		const rotateZ = matrixParts?.rotateZ ?? 0;
		let hasCompatibleFunction = false;

		const markCompatible = () => {
			hasCompatibleFunction = true;
		};

		const compatibleValue = cleanTargetValue
			.replace(/\bscale3d\(([^)]*)\)/gi, () => {
				markCompatible();
				return `scale3d(${this.formatTransformNumber(
					scaleX
				)}, ${this.formatTransformNumber(scaleY)}, 1)`;
			})
			.replace(/\bscaleX\([^)]*\)/gi, () => {
				markCompatible();
				return `scaleX(${this.formatTransformNumber(scaleX)})`;
			})
			.replace(/\bscaleY\([^)]*\)/gi, () => {
				markCompatible();
				return `scaleY(${this.formatTransformNumber(scaleY)})`;
			})
			.replace(/\bscale\(([^)]*)\)/gi, (_match, args) => {
				markCompatible();
				const parts = this.splitTransformArguments(args);

				if (parts.length > 1)
					return `scale(${this.formatTransformNumber(
						scaleX
					)}, ${this.formatTransformNumber(scaleY)})`;

				return `scale(${this.formatTransformNumber(scaleX)})`;
			})
			.replace(/\btranslate3d\(([^)]*)\)/gi, (_match, args) => {
				markCompatible();
				const parts = this.splitTransformArguments(args);

				return `translate3d(${this.getCompatibleTranslateValue(
					translateX,
					parts[0]
				)}, ${this.getCompatibleTranslateValue(
					translateY,
					parts[1]
				)}, ${parts[2] || '0px'})`;
			})
			.replace(/\btranslateX\(([^)]*)\)/gi, (_match, argument) => {
				markCompatible();
				return `translateX(${this.getCompatibleTranslateValue(
					translateX,
					argument
				)})`;
			})
			.replace(/\btranslateY\(([^)]*)\)/gi, (_match, argument) => {
				markCompatible();
				return `translateY(${this.getCompatibleTranslateValue(
					translateY,
					argument
				)})`;
			})
			.replace(/\btranslate\(([^)]*)\)/gi, (_match, args) => {
				markCompatible();
				const parts = this.splitTransformArguments(args);

				return `translate(${this.getCompatibleTranslateValue(
					translateX,
					parts[0]
				)}, ${this.getCompatibleTranslateValue(translateY, parts[1])})`;
			})
			.replace(/\brotate3d\(([^)]*)\)/gi, (_match, args) => {
				markCompatible();
				const parts = this.splitTransformArguments(args);

				return `rotate3d(${parts[0] || 0}, ${parts[1] || 0}, ${
					parts[2] || 1
				}, ${this.getCompatibleAngleValue(rotateZ, parts[3])})`;
			})
			.replace(/\brotateX\(([^)]*)\)/gi, (_match, argument) => {
				markCompatible();
				return `rotateX(${this.getCompatibleAngleValue(0, argument)})`;
			})
			.replace(/\brotateY\(([^)]*)\)/gi, (_match, argument) => {
				markCompatible();
				return `rotateY(${this.getCompatibleAngleValue(0, argument)})`;
			})
			.replace(/\brotateZ\(([^)]*)\)/gi, (_match, argument) => {
				markCompatible();
				return `rotateZ(${this.getCompatibleAngleValue(
					rotateZ,
					argument
				)})`;
			})
			.replace(/\brotate\(([^)]*)\)/gi, (_match, argument) => {
				markCompatible();
				return `rotate(${this.getCompatibleAngleValue(
					rotateZ,
					argument
				)})`;
			});

		return hasCompatibleFunction
			? compatibleValue
			: this.cleanAnimationStyleValue(value) || 'none';
	}

	getZeroScaleTransformValue(targetValue) {
		const cleanTargetValue = this.cleanAnimationStyleValue(targetValue);

		if (!cleanTargetValue || !this.hasScaleTransformValue(cleanTargetValue))
			return 'none';

		return this.getCompatibleTransformValue(
			cleanTargetValue,
			'matrix(0, 0, 0, 0, 0, 0)'
		);
	}

	normalizePreviewAnimationStyleValue(
		cssProperty,
		value,
		targetValue,
		context = 'current'
	) {
		if (cssProperty === 'transform' && this.isTransformMatrixValue(value)) {
			const cleanValue = this.cleanAnimationStyleValue(value);
			const isMatrix3d = /^matrix3d\(/i.test(cleanValue || '');

			if (
				context === 'out-current' &&
				isMatrix3d &&
				!this.isIdentityTransformMatrix3d(cleanValue)
			)
				return this.cleanAnimationStyleValue(targetValue) || value;

			if (isMatrix3d && !this.isIdentityTransformMatrix3d(cleanValue))
				return value;

			return this.getCompatibleTransformValue(targetValue, value);
		}

		if (cssProperty === 'transform' && this.isNoneTransformValue(value)) {
			return this.getCompatibleTransformValue(
				targetValue,
				'matrix(1, 0, 0, 1, 0, 0)'
			);
		}

		return value;
	}

	getCurrentResponsiveStyles(stylesObj) {
		if (!stylesObj) return null;

		const currentBreakpoint = this.getCurrentBreakpoint();
		const currentBreakpointIndex =
			this.breakpoints.indexOf(currentBreakpoint);
		const usableBreakpoints =
			currentBreakpointIndex >= 0
				? this.breakpoints.slice(0, currentBreakpointIndex + 1)
				: this.breakpoints;
		const styles = {};

		usableBreakpoints.forEach(breakpoint => {
			if (stylesObj?.[breakpoint])
				Object.assign(styles, stylesObj[breakpoint]);
		});

		return Object.keys(styles).length ? styles : null;
	}

	getCurrentEffectsObj(index, direction = 'in') {
		const effectsObj = this.effectsObjs?.[index];

		if (!effectsObj) return {};

		const currentBreakpoint = this.getCurrentBreakpoint();
		const breakpoint =
			this.getLastUsableBreakpoint(
				currentBreakpoint,
				breakpoint => !!effectsObj[breakpoint]
			) || 'general';
		const currentEffects = effectsObj[breakpoint] || {};

		if (direction === 'out' && currentEffects.split && currentEffects.out)
			return currentEffects.out;

		return currentEffects;
	}

	getPreviewAnimationOptions(index, direction = 'in') {
		const effectsObj = this.getCurrentEffectsObj(index, direction);
		const transitionEnabled = effectsObj['transition-status'] !== false;
		const duration = transitionEnabled
			? Number(effectsObj['transition-duration'] || 0) * 1000
			: 0;
		const delay = transitionEnabled
			? Number(effectsObj['transition-delay'] || 0) * 1000
			: 0;

		return {
			duration: Number.isFinite(duration) ? duration : 0,
			delay: Number.isFinite(delay) ? delay : 0,
			easing: effectsObj.easing || 'ease',
			fill: 'forwards',
		};
	}

	getAnimationTargetSelector() {
		return this.getPreviewContentWithoutDataAttribute(this.dataTarget);
	}

	getPreviewAnimationTargetEntries() {
		const mainTarget = this.getAnimationTargetSelector();
		const entries = [];

		this.stylesObjs?.forEach((stylesObj, index) => {
			if (!stylesObj || this.effects?.[index]?.disableTransition) return;

			const addEntriesForSelector = (styles, selector) => {
				const animationStyles = this.getCurrentResponsiveStyles(styles);

				if (!animationStyles) return;

				let elements = [];
				try {
					elements = Array.from(
						this.mainDocument?.querySelectorAll?.(selector) || []
					);
				} catch (error) {
					if (error?.name !== 'SyntaxError') throw error;
				}

				elements.forEach(element => {
					entries.push({
						element,
						index,
						selector,
						styles: animationStyles,
					});
				});
			};

			if (this.hasMultipleTargetsArray?.[index]) {
				Object.entries(stylesObj).forEach(
					([targetSelector, styles]) => {
						addEntriesForSelector(
							styles,
							`${mainTarget} ${targetSelector}`
						);
					}
				);
				return;
			}

			this.transitionTargetsArray?.[index]?.forEach(transitionTarget => {
				addEntriesForSelector(
					stylesObj,
					this.getTargetForLine(transitionTarget, mainTarget)
				);
			});
		});

		return entries;
	}

	supportsWebAnimationPreview() {
		if (!['hover', 'click'].includes(this.action)) return false;

		return this.getPreviewAnimationTargetEntries().some(
			({ element }) => typeof element?.animate === 'function'
		);
	}

	getPreviewMode() {
		if (this.supportsWebAnimationPreview()) return 'web-animation';
		if (this.supportsCssHoverPreview()) return 'css-hover';
		return 'js-toggle';
	}

	getPreviewStyleConfigDebugDetails() {
		return (
			this.stylesObjs?.map((stylesObj, index) => {
				const breakpointKeys = Object.keys(stylesObj || {}).filter(
					key => this.breakpoints?.includes?.(key)
				);
				const targetKeys = Object.keys(stylesObj || {}).filter(
					key => !this.breakpoints?.includes?.(key)
				);
				const sourceStyles = this.hasMultipleTargetsArray?.[index]
					? targetKeys.reduce(
							(acc, targetKey) => ({
								...acc,
								...(this.getCurrentResponsiveStyles(
									stylesObj[targetKey]
								) || {}),
							}),
							{}
					  )
					: this.getCurrentResponsiveStyles(stylesObj);

				return {
					index,
					breakpoints: breakpointKeys,
					targets: targetKeys,
					properties: Object.keys(sourceStyles || {}),
					current: sourceStyles || {},
				};
			}) || []
		);
	}

	getPreviewEffectsConfigDebugDetails() {
		return (
			this.effectsObjs?.map((effectsObj, index) => ({
				index,
				breakpoints: Object.keys(effectsObj || {}),
				current: this.getCurrentEffectsObj(index),
				out: this.getCurrentEffectsObj(index, 'out'),
			})) || []
		);
	}

	getSvgPreviewCandidateDetails(element) {
		if (!this.isSVG || !element?.querySelectorAll) return [];

		return [
			'.maxi-svg-icon-block__icon',
			'.maxi-svg-icon-block__icon svg',
			'.maxi-svg-icon-block__icon svg path',
		].flatMap(selector => {
			try {
				return Array.from(element.querySelectorAll(selector) || []).map(
					candidate => ({
						selector,
						element: this.getNodeDebugDetails(candidate),
						bounds: this.getElementBounds(candidate),
						computed: this.getComputedDebugDetails(candidate),
					})
				);
			} catch (error) {
				if (error?.name !== 'SyntaxError') throw error;
				return [
					{
						selector,
						error: error?.message || String(error),
					},
				];
			}
		});
	}

	getPreviewAnimationDebugDetails(direction = 'in') {
		return this.getPreviewAnimationTargetEntries().map(entry => {
			const keyframes = this.getPreviewAnimationKeyframes(
				entry,
				direction
			);
			const options = this.getPreviewAnimationOptions(
				entry.index,
				direction
			);
			const bounds = this.getElementBounds(entry.element);

			return {
				index: entry.index,
				selector: entry.selector,
				styles: entry.styles,
				keyframes,
				options,
				element: this.getNodeDebugDetails(entry.element),
				bounds,
				zeroSized:
					!!bounds && (bounds.width === 0 || bounds.height === 0),
				computed: this.getComputedDebugDetails(entry.element),
				svgCandidates: this.getSvgPreviewCandidateDetails(
					entry.element
				),
			};
		});
	}

	getPreviewRelationConfigDebugDetails({
		includeAnimationTargets = true,
	} = {}) {
		return {
			previewMode: this.getPreviewMode(),
			currentBreakpoint: this.getCurrentBreakpoint(),
			sids: this.sids,
			isSVG: this.isSVG,
			isIconArray: this.isIconArray,
			hasMultipleTargetsArray: this.hasMultipleTargetsArray,
			transitionTargetsArray: this.transitionTargetsArray,
			transitionTriggers: this.transitionTriggers,
			styles: this.getPreviewStyleConfigDebugDetails(),
			effects: this.getPreviewEffectsConfigDebugDetails(),
			...(includeAnimationTargets && {
				animationTargets: this.getPreviewAnimationDebugDetails(),
			}),
		};
	}

	getStoredPreviewAnimationBaseStyle(element, cssProperty) {
		if (!this.previewAnimationBaseStyles)
			this.previewAnimationBaseStyles = new Map();

		if (!this.previewAnimationBaseStyles.has(element))
			this.previewAnimationBaseStyles.set(element, {});

		const baseStyles = this.previewAnimationBaseStyles.get(element);

		if (!Object.prototype.hasOwnProperty.call(baseStyles, cssProperty)) {
			baseStyles[cssProperty] =
				this.mainWindow
					?.getComputedStyle?.(element)
					?.getPropertyValue?.(cssProperty) || '';
		}

		return baseStyles[cssProperty];
	}

	getPreviewAnimationKeyframes(entry, direction = 'in') {
		const fromStyles = {};
		const toStyles = {};
		const computed = this.mainWindow?.getComputedStyle?.(entry.element);

		Object.entries(entry.styles || {}).forEach(([property, value]) => {
			if (property.startsWith('--')) return;

			const cleanValue = this.cleanAnimationStyleValue(value);
			if (cleanValue === null || cleanValue === '') return;

			const animationProperty = this.getAnimationPropertyName(property);
			const cssProperty =
				property.includes('-') || property.startsWith('--')
					? property
					: this.getAnimationCssPropertyName(property);
			const currentValue =
				computed?.getPropertyValue?.(cssProperty) ||
				computed?.getPropertyValue?.(property) ||
				'';
			const baseValue = this.getStoredPreviewAnimationBaseStyle(
				entry.element,
				cssProperty
			);
			const normalizedCurrentValue =
				this.normalizePreviewAnimationStyleValue(
					cssProperty,
					currentValue,
					cleanValue,
					direction === 'out' ? 'out-current' : 'current'
				);
			const normalizedBaseValue =
				this.normalizePreviewAnimationStyleValue(
					cssProperty,
					baseValue,
					cleanValue,
					'base'
				);

			fromStyles[animationProperty] = normalizedCurrentValue;
			toStyles[animationProperty] =
				direction === 'out' ? normalizedBaseValue : cleanValue;
		});

		if (!Object.keys(toStyles).length) return null;

		return [fromStyles, toStyles];
	}

	cancelPreviewAnimations() {
		if (!this.previewAnimations) this.previewAnimations = [];

		this.previewAnimations?.forEach(animation => {
			animation?.cancel?.();
		});
		this.previewAnimations = [];
	}

	playPreviewAnimations(direction = 'in') {
		const entries = this.getPreviewAnimationTargetEntries().filter(
			({ element }) => typeof element?.animate === 'function'
		);
		const preparedAnimations = entries
			.map(entry => ({
				...entry,
				keyframes: this.getPreviewAnimationKeyframes(entry, direction),
				options: this.getPreviewAnimationOptions(
					entry.index,
					direction
				),
			}))
			.filter(({ keyframes }) => !!keyframes);

		this.cancelPreviewAnimations();

		this.previewAnimations = preparedAnimations
			.map(({ element, keyframes, options }) =>
				element.animate(keyframes, options)
			)
			.filter(Boolean);

		this.debugPreview('preview-animation:play', {
			direction,
			animationCount: this.previewAnimations.length,
			targets: preparedAnimations.map(
				({ selector, keyframes, options, element }) => ({
					selector,
					keyframes,
					options,
					element: this.getNodeDebugDetails(element),
					bounds: this.getElementBounds(element),
					computed: this.getComputedDebugDetails(element),
				})
			),
		});
	}

	createPreviewStyleEl(
		styleEl,
		content = this.getPreviewStyleContent(styleEl),
		idSuffix = 'preview'
	) {
		if (!styleEl || !this.mainDocument?.createElement) return null;

		const previewStyleEl = this.mainDocument.createElement('style');
		previewStyleEl.id = `${styleEl.id}-${idSuffix}`;
		previewStyleEl.setAttribute?.('data-type', this.action);
		previewStyleEl.setAttribute?.('data-sids', this.sids);
		previewStyleEl.setAttribute?.('data-preview', 'true');
		previewStyleEl.innerText = content;

		return previewStyleEl;
	}

	addPreviewTransition(type = 'in') {
		const isOut = type === 'out';
		const previewTransitionEl = isOut
			? this.previewOutTransitionEl
			: this.previewInTransitionEl;

		if (!previewTransitionEl) return;
		if (this.previewTransitionType === type) return;

		(isOut
			? this.previewInTransitionEl
			: this.previewOutTransitionEl
		)?.remove?.();
		this.addStyleEl(previewTransitionEl);
		this.previewTransitionType = type;
	}

	addPreviewStyles() {
		this.removePreviewStyles();

		if (this.supportsWebAnimationPreview()) {
			this.previewTransitionType = 'web-animation';
		} else if (this.supportsCssHoverPreview()) {
			this.previewStylesEl = this.createPreviewStyleEl(
				this.stylesEl,
				this.getPreviewHoverContent(this.stylesEl)
			);
			this.previewInTransitionEl = this.createPreviewStyleEl(
				this.inTransitionEl,
				this.getPreviewHoverContent(this.inTransitionEl)
			);
			this.previewOutTransitionEl = this.createPreviewStyleEl(
				this.outTransitionEl,
				this.getPreviewBaseTargetContent(this.outTransitionEl)
			);

			this.addStyleEl(this.previewOutTransitionEl);
			this.addStyleEl(this.previewStylesEl);
			this.addStyleEl(this.previewInTransitionEl);
			this.previewTransitionType = 'hover-css';
		} else {
			this.previewStylesEl = this.createPreviewStyleEl(this.stylesEl);
			this.previewInTransitionEl = this.createPreviewStyleEl(
				this.inTransitionEl,
				this.getPreviewTransitionContent(this.inTransitionEl)
			);
			this.previewOutTransitionEl = this.createPreviewStyleEl(
				this.outTransitionEl,
				this.getPreviewTransitionContent(this.outTransitionEl)
			);

			this.addStyleEl(this.previewStylesEl);
			this.addPreviewTransition('in');
		}

		this.debugPreview('preview-styles:exported', {
			mode: this.getPreviewMode(),
			style: this.getStyleDebug(this.previewStylesEl),
			inTransition: this.getStyleDebug(this.previewInTransitionEl),
			outTransition: this.getStyleDebug(this.previewOutTransitionEl),
			svgStart: this.getStyleDebug(this.previewSvgStartStylesEl),
			config: this.getPreviewRelationConfigDebugDetails(),
			targets: this.getPreviewTargetDetails(),
		});
		this.debugPreviewDeep('preview-styles:exported:deep', () =>
			this.getDeepPreviewDebugDetails('preview-styles:exported')
		);
	}

	removePreviewStyles() {
		this.cancelPreviewAnimations();
		this.previewSvgStartStylesEl?.remove?.();
		this.previewStylesEl?.remove?.();
		this.previewInTransitionEl?.remove?.();
		this.previewOutTransitionEl?.remove?.();
		this.previewSvgStartStylesEl = null;
		this.previewStylesEl = null;
		this.previewInTransitionEl = null;
		this.previewOutTransitionEl = null;
		this.previewTransitionType = null;
		this.debugPreview('preview-styles:removed');
	}

	getLastUsableBreakpoint(currentBreakpoint, callback) {
		return [...this.breakpoints]
			.splice(0, this.breakpoints.indexOf(currentBreakpoint) + 1)
			.reverse()
			.find(breakpoint => callback(breakpoint));
	}

	getCurrentBreakpoint() {
		const winWidth = this.mainWindow?.innerWidth || window.innerWidth;

		let currentBreakpoint = 'general';

		Object.entries(this.breakpointsObj || {}).forEach(
			([breakpoint, value]) => {
				if (!['general', 'xxl'].includes(breakpoint)) {
					if (breakpoint === 'general') return;

					if (winWidth <= this.breakpointsObj.xl)
						currentBreakpoint = breakpoint;
				}
				if (winWidth <= value) currentBreakpoint = breakpoint;
			}
		);

		return currentBreakpoint;
	}

	getTransitionTimeout() {
		const currentBreakpoint = this.getCurrentBreakpoint();

		const getTransitionValue = (effects, prop) =>
			effects[
				`transition-${prop}-${this.getLastUsableBreakpoint(
					currentBreakpoint,
					breakpoint =>
						Object.prototype.hasOwnProperty.call(
							effects,
							`transition-${prop}-${breakpoint}`
						)
				)}`
			];

		return this.effects.reduce((promise, effects) => {
			if (effects.disableTransition) return promise;

			let transitionTimeout = 0;
			[effects, effects?.out].forEach(effects => {
				if (!effects) return;

				const transitionDuration = getTransitionValue(
					effects,
					'duration'
				);
				const transitionDelay = getTransitionValue(effects, 'delay');
				const transitionTimeoutTemp =
					(transitionDuration + transitionDelay) * 1000;

				transitionTimeout = Math.max(
					transitionTimeout,
					transitionTimeoutTemp
				);
			});

			return Math.max(promise, transitionTimeout);
		}, 0);
	}

	setIsPreview(isPreview, { staticState = 'start' } = {}) {
		this.debugPreview('set-preview', { isPreview, staticState });

		if (isPreview) {
			this.isPreview = true;
			this.enablePreviewInteractions();
			return;
		}

		this.isPreview = false;

		if (staticState === 'end') {
			this.enableStaticEndState();
			return;
		}

		this.enableStaticStartState();
	}

	getPreviewDemoWindow() {
		if (this.mainWindow) return this.mainWindow;
		if (typeof window !== 'undefined') return window;
		return null;
	}

	isPreviewDebugEnabled() {
		return getIsPreviewDebugEnabled(this.getPreviewDemoWindow());
	}

	isPreviewDeepDebugEnabled() {
		return getIsPreviewDeepDebugEnabled(this.getPreviewDemoWindow());
	}

	debugPreview(event, details = {}, options = {}) {
		const targetWindow = this.getPreviewDemoWindow();
		const context = {
			id: this.id,
			uniqueID: this.uniqueID,
			action: this.action,
			trigger: this.trigger,
			target: this.target,
			dataTarget: this.dataTarget,
			isEditorIframe: this.isEditorIframe,
			isPreview: this.isPreview,
			...details,
		};

		debugRelationPreview(event, context, targetWindow, options);
	}

	debugPreviewDeep(event, detailsFactory = {}) {
		if (!this.isPreviewDeepDebugEnabled()) return;

		const details =
			typeof detailsFactory === 'function'
				? detailsFactory()
				: detailsFactory;

		this.debugPreview(event, details, { deep: true });
	}

	getStyleDebug(styleEl) {
		if (!styleEl) return null;

		return {
			id: styleEl.id,
			type: styleEl.getAttribute?.('data-type'),
			sids: styleEl.getAttribute?.('data-sids'),
			length:
				styleEl.innerText?.length || styleEl.textContent?.length || 0,
			preview: (styleEl.innerText || styleEl.textContent || '').slice(
				0,
				240
			),
		};
	}

	getDeepStyleDebug(styleEl) {
		if (!styleEl) return null;

		const content = this.getPreviewStyleContent(styleEl);

		return {
			...this.getStyleDebug(styleEl),
			content,
		};
	}

	getPreviewTargetSelector(
		previewMode = this.isPreview ? this.getPreviewMode() : 'data-attribute'
	) {
		if (
			this.isPreview &&
			['css-hover', 'web-animation'].includes(previewMode)
		) {
			return this.getPreviewContentWithoutDataAttribute(this.dataTarget);
		}

		return this.dataTarget;
	}

	getNodeDebugDetails(element) {
		if (!element) return null;

		const className =
			typeof element.className === 'string'
				? element.className
				: element.className?.baseVal || String(element.className || '');

		return {
			nodeName: element.nodeName,
			id: element.id || null,
			className,
			dataBlock: element.getAttribute?.('data-block') || null,
			dataType: element.getAttribute?.('data-type') || null,
			dataMaxiRelations:
				element.getAttribute?.('data-maxi-relations') || null,
		};
	}

	getComputedDebugDetails(element) {
		const computed = element
			? this.mainWindow?.getComputedStyle?.(element)
			: null;

		if (!computed) return null;

		return {
			transition: computed.getPropertyValue?.('transition'),
			transitionDuration: computed.getPropertyValue?.(
				'transition-duration'
			),
			transitionDelay: computed.getPropertyValue?.('transition-delay'),
			transform: computed.getPropertyValue?.('transform'),
			transformOrigin: computed.getPropertyValue?.('transform-origin'),
			transformBox: computed.getPropertyValue?.('transform-box'),
			opacity: computed.getPropertyValue?.('opacity'),
			display: computed.getPropertyValue?.('display'),
			visibility: computed.getPropertyValue?.('visibility'),
			position: computed.getPropertyValue?.('position'),
			width: computed.getPropertyValue?.('width'),
			height: computed.getPropertyValue?.('height'),
			pointerEvents: computed.getPropertyValue?.('pointer-events'),
		};
	}

	getDeepPreviewSelectors() {
		const selectors = [
			this.trigger ? `.${this.trigger}` : null,
			this.blockTarget,
			this.fullTarget,
			this.dataTarget,
			this.getPreviewContentWithoutDataAttribute(this.dataTarget),
			this.getPreviewTargetSelector(
				this.isPreview ? this.getPreviewMode() : 'data-attribute'
			),
			...(this.getPreviewTargetDetails?.() || []).map(
				({ selector }) => selector
			),
		].filter(Boolean);

		return Array.from(new Set(selectors));
	}

	getDeepSelectorMatchDetails(selector) {
		try {
			const elements = Array.from(
				this.mainDocument?.querySelectorAll?.(selector) || []
			);

			return {
				selector,
				matchCount: elements.length,
				matches: elements.slice(0, 5).map(element => ({
					element: this.getNodeDebugDetails(element),
					bounds: this.getElementBounds(element),
					computed: this.getComputedDebugDetails(element),
					svgCandidates: this.getSvgPreviewCandidateDetails(element),
				})),
			};
		} catch (error) {
			return {
				selector,
				error: error?.message || String(error),
			};
		}
	}

	getDeepPreviewDebugDetails(stage, extra = {}) {
		return {
			stage,
			extra,
			relation: {
				id: this.id,
				uniqueID: this.uniqueID,
				action: this.action,
				trigger: this.trigger,
				target: this.target,
				blockTarget: this.blockTarget,
				fullTarget: this.fullTarget,
				dataTarget: this.dataTarget,
				isSVG: this.isSVG,
				isPreview: this.isPreview,
				isEditorIframe: this.isEditorIframe,
				isSiteEditor: this.isSiteEditor,
				previewMode: this.getPreviewMode(),
				currentBreakpoint: this.getCurrentBreakpoint(),
			},
			rawRelation: {
				css: this.css,
				effects: this.effects,
			},
			generated: {
				stylesString: this.stylesString,
				inTransitionString: this.inTransitionString,
				outTransitionString: this.outTransitionString,
				stylesObjs: this.stylesObjs,
				effectsObjs: this.effectsObjs,
				sids: this.sids,
				transitionTargetsArray: this.transitionTargetsArray,
				hasMultipleTargetsArray: this.hasMultipleTargetsArray,
				avoidHoverArray: this.avoidHoverArray,
			},
			styleElements: {
				staticStyles: this.getDeepStyleDebug(this.stylesEl),
				staticInTransition: this.getDeepStyleDebug(this.inTransitionEl),
				staticOutTransition: this.getDeepStyleDebug(
					this.outTransitionEl
				),
				previewSvgStart: this.getDeepStyleDebug(
					this.previewSvgStartStylesEl
				),
				previewStyles: this.getDeepStyleDebug(this.previewStylesEl),
				previewInTransition: this.getDeepStyleDebug(
					this.previewInTransitionEl
				),
				previewOutTransition: this.getDeepStyleDebug(
					this.previewOutTransitionEl
				),
			},
			selectors: this.getDeepPreviewSelectors().map(selector =>
				this.getDeepSelectorMatchDetails(selector)
			),
			animationTargets: this.getPreviewAnimationDebugDetails(),
			keyNodes: {
				trigger: {
					element: this.getNodeDebugDetails(this.triggerEl),
					bounds: this.getElementBounds(this.triggerEl),
					computed: this.getComputedDebugDetails(this.triggerEl),
				},
				blockTarget: {
					element: this.getNodeDebugDetails(this.blockTargetEl),
					bounds: this.getElementBounds(this.blockTargetEl),
					computed: this.getComputedDebugDetails(this.blockTargetEl),
					svgCandidates: this.getSvgPreviewCandidateDetails(
						this.blockTargetEl
					),
				},
				target: {
					element: this.getNodeDebugDetails(this.targetEl),
					bounds: this.getElementBounds(this.targetEl),
					computed: this.getComputedDebugDetails(this.targetEl),
					svgCandidates: this.getSvgPreviewCandidateDetails(
						this.targetEl
					),
				},
			},
			config: this.getPreviewRelationConfigDebugDetails({
				includeAnimationTargets: false,
			}),
		};
	}

	getPreviewTargetDetails() {
		const transitionTargets = Array.from(
			new Set(this.transitionTargetsArray?.flat?.() || [''])
		);
		const previewSelectorMode = this.isPreview
			? this.getPreviewMode()
			: 'data-attribute';
		const mainTarget = this.getPreviewTargetSelector(previewSelectorMode);

		return transitionTargets.map(transitionTarget => {
			const selector = this.getTargetForLine(
				transitionTarget,
				mainTarget
			).replace(/\s{2,}/g, ' ');

			try {
				const elements = Array.from(
					this.mainDocument?.querySelectorAll?.(selector) || []
				);
				const firstElement = elements[0];
				const computed = firstElement
					? this.mainWindow?.getComputedStyle?.(firstElement)
					: null;

				return {
					selector,
					matchCount: elements.length,
					previewSelectorMode,
					blockDataAttr:
						this.blockTargetEl?.getAttribute?.(
							'data-maxi-relations'
						) || null,
					element: this.getNodeDebugDetails(firstElement),
					bounds: this.getElementBounds(firstElement),
					computed: this.getComputedDebugDetails(firstElement),
				};
			} catch (error) {
				return {
					selector,
					error: error?.message || String(error),
				};
			}
		});
	}

	schedulePreviewDemo(callback) {
		this.cancelPreviewDemo();

		const targetWindow = this.getPreviewDemoWindow();

		if (targetWindow?.requestAnimationFrame) {
			this.debugPreview('schedule-frame', { type: 'animationFrame' });
			this.previewDemoRequestType = 'animationFrame';
			this.previewDemoRequestId = targetWindow.requestAnimationFrame(
				() => {
					this.previewDemoRequestId = null;
					this.previewDemoRequestType = null;
					callback();
				}
			);
			return;
		}

		const setTargetTimeout = targetWindow?.setTimeout || setTimeout;
		this.debugPreview('schedule-frame', { type: 'timeout' });
		this.previewDemoRequestType = 'timeout';
		this.previewDemoRequestId = setTargetTimeout(() => {
			this.previewDemoRequestId = null;
			this.previewDemoRequestType = null;
			callback();
		}, 0);
	}

	cancelPreviewDemo() {
		if (
			this.previewDemoRequestId === null ||
			typeof this.previewDemoRequestId === 'undefined'
		)
			return;

		const targetWindow = this.getPreviewDemoWindow();

		if (this.previewDemoRequestType === 'animationFrame') {
			targetWindow?.cancelAnimationFrame?.(this.previewDemoRequestId);
		} else {
			const clearTargetTimeout =
				targetWindow?.clearTimeout || clearTimeout;
			clearTargetTimeout(this.previewDemoRequestId);
		}

		this.previewDemoRequestId = null;
		this.previewDemoRequestType = null;
	}

	cancelPreviewHoverLeave() {
		if (
			this.previewHoverLeaveTimeout === null ||
			typeof this.previewHoverLeaveTimeout === 'undefined'
		)
			return;

		const targetWindow = this.getPreviewDemoWindow();
		const clearTargetTimeout = targetWindow?.clearTimeout || clearTimeout;
		clearTargetTimeout(this.previewHoverLeaveTimeout);
		this.previewHoverLeaveTimeout = null;
		this.debugPreview('hover-leave:cancelled');
	}

	schedulePreviewHoverLeave(callback) {
		this.cancelPreviewHoverLeave();

		const targetWindow = this.getPreviewDemoWindow();
		const setTargetTimeout = targetWindow?.setTimeout || setTimeout;
		const delay = this.getPreviewHoverLeaveDelay();

		this.debugPreview('hover-leave:scheduled', {
			delay,
			...this.getPreviewHoverEventDetails(),
		});
		this.previewHoverLeaveTimeout = setTargetTimeout(() => {
			this.previewHoverLeaveTimeout = null;
			callback();
		}, delay);
	}

	getPreviewHoverLeaveDelay() {
		return PREVIEW_HOVER_LEAVE_DEBOUNCE;
	}

	getEventPointerPosition(event) {
		if (
			!Number.isFinite(event?.clientX) ||
			!Number.isFinite(event?.clientY)
		)
			return null;

		return {
			x: event.clientX,
			y: event.clientY,
		};
	}

	updatePreviewPointerPosition(event) {
		const pointerPosition = this.getEventPointerPosition(event);

		if (pointerPosition) this.previewPointerPosition = pointerPosition;
	}

	getElementBounds(element) {
		const rect = element?.getBoundingClientRect?.();

		if (!rect) return null;

		const left = Number(rect.left);
		const top = Number(rect.top);
		const right = Number(rect.right);
		const bottom = Number(rect.bottom);

		if (
			!Number.isFinite(left) ||
			!Number.isFinite(top) ||
			!Number.isFinite(right) ||
			!Number.isFinite(bottom)
		)
			return null;

		return {
			left,
			top,
			right,
			bottom,
			width: Number.isFinite(rect.width) ? rect.width : right - left,
			height: Number.isFinite(rect.height) ? rect.height : bottom - top,
		};
	}

	capturePreviewHoverBounds() {
		this.previewHoverBounds = this.getElementBounds(this.triggerEl);
	}

	isPointerInsideBounds(pointer, bounds) {
		if (!pointer || !bounds) return false;

		return (
			pointer.x >= bounds.left - PREVIEW_HOVER_BOUNDS_TOLERANCE &&
			pointer.x <= bounds.right + PREVIEW_HOVER_BOUNDS_TOLERANCE &&
			pointer.y >= bounds.top - PREVIEW_HOVER_BOUNDS_TOLERANCE &&
			pointer.y <= bounds.bottom + PREVIEW_HOVER_BOUNDS_TOLERANCE
		);
	}

	isPreviewPointerInsideHoverBounds(event) {
		const pointer =
			this.getEventPointerPosition(event) || this.previewPointerPosition;

		return this.isPointerInsideBounds(pointer, this.previewHoverBounds);
	}

	getPreviewHoverEventDetails(event) {
		const pointer =
			this.getEventPointerPosition(event) || this.previewPointerPosition;
		const currentBounds = this.getElementBounds(this.triggerEl);
		const elementFromPoint = pointer
			? this.mainDocument?.elementFromPoint?.(pointer.x, pointer.y)
			: null;
		const relatedTarget = event?.relatedTarget;

		return {
			pointer,
			triggerBounds: currentBounds,
			blockTargetBounds: this.getElementBounds(this.blockTargetEl),
			targetBounds: this.getElementBounds(this.targetEl),
			previewHoverBounds: this.previewHoverBounds,
			pointerInsideTriggerBounds: this.isPointerInsideBounds(
				pointer,
				currentBounds
			),
			pointerInsidePreviewHoverBounds: this.isPointerInsideBounds(
				pointer,
				this.previewHoverBounds
			),
			triggerMatchesHover: !!this.triggerEl?.matches?.(':hover'),
			targetMatchesHover: !!this.targetEl?.matches?.(':hover'),
			blockTargetMatchesHover: !!this.blockTargetEl?.matches?.(':hover'),
			webAnimationPreview: this.supportsWebAnimationPreview(),
			cssHoverPreview: this.supportsCssHoverPreview(),
			elementFromPoint: this.getNodeDebugDetails(elementFromPoint),
			eventTarget: this.getNodeDebugDetails(event?.target),
			eventCurrentTarget: this.getNodeDebugDetails(event?.currentTarget),
			relatedTarget: this.getNodeDebugDetails(relatedTarget),
			triggerComputed: this.getComputedDebugDetails(this.triggerEl),
			targetComputed: this.getComputedDebugDetails(this.targetEl),
			blockDataAttr:
				this.blockTargetEl?.getAttribute?.('data-maxi-relations') ||
				null,
		};
	}

	shouldIgnorePreviewHoverLeave(event) {
		if (this.triggerEl?.matches?.(':hover')) return true;
		if (
			this.isContained &&
			(this.blockTargetEl?.matches?.(':hover') ||
				this.targetEl?.matches?.(':hover'))
		)
			return true;
		if (this.isPreviewPointerInsideHoverBounds(event)) return true;

		const relatedTarget = event?.relatedTarget;
		if (!relatedTarget) return false;

		return (
			!!this.triggerEl?.contains?.(relatedTarget) ||
			!!this.targetEl?.contains?.(relatedTarget)
		);
	}

	forcePreviewReflow() {
		const targetDetails = this.getPreviewTargetDetails();
		let didReflow = false;

		targetDetails.forEach(({ selector }) => {
			try {
				this.mainDocument
					?.querySelectorAll?.(selector)
					?.forEach(element => {
						didReflow = true;
						element?.getBoundingClientRect?.();
						void element?.offsetHeight;
						void this.mainWindow
							?.getComputedStyle?.(element)
							?.getPropertyValue?.('transition');
					});
			} catch (error) {
				if (error?.name !== 'SyntaxError') throw error;
			}
		});

		if (!didReflow) {
			this.targetEl?.getBoundingClientRect?.();
			void this.targetEl?.offsetHeight;
		}

		this.debugPreview('force-reflow', {
			didReflow,
			targets: targetDetails,
		});
		this.debugPreviewDeep('force-reflow:deep', () =>
			this.getDeepPreviewDebugDetails('force-reflow', {
				didReflow,
				targets: targetDetails,
			})
		);
	}

	removePreviewTransitions() {
		this.removeTransition(this.inTransitionEl);
		this.removeTransition(this.outTransitionEl);
	}

	enableStaticEndState() {
		this.debugPreview('static-end:start');
		this.cancelPreviewDemo();
		this.cancelPreviewHoverLeave();
		clearTimeout(this.transitionTimeout);
		this.removePreviewEvents();
		this.removeRelationSubscriber();
		this.removePreviewTransitions();
		this.removePreviewStyles();

		this.addDataAttrToBlock();
		this.addStyles();
		this.addRelationSubscriber();
		this.debugPreview('static-end:applied', {
			style: this.getStyleDebug(this.stylesEl),
			targets: this.getPreviewTargetDetails(),
		});
	}

	enableStaticStartState() {
		this.debugPreview('static-start:start');
		this.cancelPreviewDemo();
		this.cancelPreviewHoverLeave();
		clearTimeout(this.transitionTimeout);
		this.removePreviewEvents();
		this.removeRelationSubscriber();
		this.removePreviewTransitions();
		this.removePreviewStyles();

		this.removeStyles();
		this.removeAddAttrToBlock();
		this.debugPreview('static-start:applied', {
			targets: this.getPreviewTargetDetails(),
		});
	}

	enablePreviewInteractions() {
		this.debugPreview('preview-interactions:start');
		this.enableStaticStartState();
		this.addPreviewStyles();
		this.addPreviewEvents();
	}

	addPreviewEvents() {
		this.removePreviewEvents();

		if (!this.triggerEl?.addEventListener) {
			this.debugPreview('preview-events:missing-trigger', {
				triggerFound: !!this.triggerEl,
			});
			return;
		}

		switch (this.action) {
			case 'hover':
				this.addHoverEvents();
				break;
			case 'click':
			default:
				this.addClickEvents();
				break;
		}

		this.debugPreview('preview-events:attached', {
			eventType: this.action === 'hover' ? 'hover' : 'click',
			triggerMatches: this.mainDocument?.querySelectorAll?.(
				`.${this.trigger}`
			)?.length,
		});
	}

	removePreviewEvents() {
		this.cancelPreviewHoverLeave();

		if (this.boundOnMouseEnter) {
			this.triggerEl?.removeEventListener?.(
				'mouseenter',
				this.boundOnMouseEnter
			);
		}
		if (this.boundOnMouseLeave) {
			this.triggerEl?.removeEventListener?.(
				'mouseleave',
				this.boundOnMouseLeave
			);
		}
		if (this.boundOnMouseClick) {
			this.triggerEl?.removeEventListener?.(
				'click',
				this.boundOnMouseClick
			);
		}
		if (this.boundOnPreviewPointerMove) {
			this.mainDocument?.removeEventListener?.(
				'mousemove',
				this.boundOnPreviewPointerMove,
				true
			);
		}

		this.previewTransitionTriggerHandlers?.forEach(
			({ element, onMouseEnter, onMouseLeave }) => {
				element?.removeEventListener?.('mouseenter', onMouseEnter);
				element?.removeEventListener?.('mouseleave', onMouseLeave);
			}
		);

		this.boundOnMouseEnter = null;
		this.boundOnMouseLeave = null;
		this.boundOnMouseClick = null;
		this.boundOnPreviewPointerMove = null;
		this.previewHoverBounds = null;
		this.previewPointerPosition = null;
		this.previewTransitionTriggerHandlers = [];
	}

	addHoverEvents() {
		this.boundOnMouseEnter = this.onMouseEnter.bind(this);
		this.boundOnMouseLeave = this.onMouseLeave.bind(this);
		this.boundOnPreviewPointerMove = this.onPreviewPointerMove.bind(this);

		this.triggerEl.addEventListener('mouseenter', this.boundOnMouseEnter);
		this.triggerEl.addEventListener('mouseleave', this.boundOnMouseLeave);
		this.mainDocument?.addEventListener?.(
			'mousemove',
			this.boundOnPreviewPointerMove,
			true
		);

		if (this.supportsCssHoverPreview()) return;

		if (!this.isHoveredContained) return;

		this.previewTransitionTriggerHandlers = [];
		this.transitionTriggerEls?.forEach(transitionTriggerEl => {
			const onMouseEnter = () => {
				this.removeTransition(this.inTransitionEl);
				clearTimeout(this.contentTimeout);
			};

			const onMouseLeave = () => {
				const transitionDuration = Array.from(
					new Set(this.transitionTargetsArray.flat())
				)
					.filter(Boolean)
					.reduce((promise, transitionTarget) => {
						const transitionTargetEl =
							this.mainDocument.querySelector(
								`${this.dataTarget} ${transitionTarget ?? ''}`
							);

						const transitionDuration = transitionTargetEl
							? [
									'transition-duration',
									'transition-delay',
							  ].reduce(
									(sum, prop) =>
										sum +
										parseFloat(
											this.mainWindow
												.getComputedStyle(
													transitionTargetEl
												)
												.getPropertyValue(prop)
												.replace('s', '')
										),
									0
							  ) * 1000
							: 0;

						return Math.max(promise, transitionDuration);
					}, 0);

				this.contentTimeout = setTimeout(() => {
					this.addTransition(this.inTransitionEl);
				}, transitionDuration);
			};

			transitionTriggerEl?.addEventListener?.('mouseenter', onMouseEnter);
			transitionTriggerEl?.addEventListener?.('mouseleave', onMouseLeave);
			this.previewTransitionTriggerHandlers.push({
				element: transitionTriggerEl,
				onMouseEnter,
				onMouseLeave,
			});
		});
	}

	addClickEvents() {
		this.boundOnMouseClick = this.onMouseClick.bind(this);
		this.triggerEl.addEventListener('click', this.boundOnMouseClick);
	}

	onPreviewPointerMove(event) {
		this.updatePreviewPointerPosition(event);
	}

	onMouseEnter(event) {
		this.updatePreviewPointerPosition(event);
		this.capturePreviewHoverBounds();
		this.debugPreview(
			'event:hover-enter',
			this.getPreviewHoverEventDetails(event)
		);
		this.debugPreviewDeep('event:hover-enter:deep', () =>
			this.getDeepPreviewDebugDetails('event:hover-enter', {
				event: this.getPreviewHoverEventDetails(event),
			})
		);

		if (this.supportsWebAnimationPreview()) {
			this.cancelPreviewHoverLeave();
			this.playPreviewAnimations('in');
			this.forcePreviewReflow();
			return;
		}

		if (this.supportsCssHoverPreview()) {
			this.forcePreviewReflow();
			return;
		}

		this.cancelPreviewHoverLeave();
		this.enableTransitions();
	}

	onMouseLeave(event) {
		this.updatePreviewPointerPosition(event);
		this.debugPreview(
			'event:hover-leave',
			this.getPreviewHoverEventDetails(event)
		);
		this.debugPreviewDeep('event:hover-leave:deep', () =>
			this.getDeepPreviewDebugDetails('event:hover-leave', {
				event: this.getPreviewHoverEventDetails(event),
			})
		);

		if (this.supportsWebAnimationPreview()) {
			if (this.shouldIgnorePreviewHoverLeave(event)) {
				this.debugPreview(
					'hover-leave:ignored-still-hovered',
					this.getPreviewHoverEventDetails(event)
				);
				this.forcePreviewReflow();
				return;
			}

			this.schedulePreviewHoverLeave(() => {
				if (!this.isPreview) return;

				if (this.shouldIgnorePreviewHoverLeave()) {
					this.debugPreview(
						'hover-leave:ignored-still-hovered',
						this.getPreviewHoverEventDetails()
					);
					this.forcePreviewReflow();
					return;
				}

				this.playPreviewAnimations('out');
				this.forcePreviewReflow();
			});
			return;
		}

		if (this.supportsCssHoverPreview()) {
			this.forcePreviewReflow();
			return;
		}

		if (this.shouldIgnorePreviewHoverLeave(event)) {
			this.debugPreview(
				'hover-leave:ignored-still-hovered',
				this.getPreviewHoverEventDetails(event)
			);
			return;
		}

		this.schedulePreviewHoverLeave(() => {
			if (!this.isPreview) return;

			if (this.shouldIgnorePreviewHoverLeave()) {
				this.debugPreview(
					'hover-leave:ignored-still-hovered',
					this.getPreviewHoverEventDetails()
				);
				return;
			}

			this.addPreviewTransition('out');
			this.debugPreview('hover-leave:out-transition-added', {
				transition: this.getStyleDebug(this.previewOutTransitionEl),
				targets: this.getPreviewTargetDetails(),
			});
			this.forcePreviewReflow();

			this.removeRelationSubscriber();
			this.removeAddAttrToBlock();
			this.debugPreview('hover-leave:styles-removed', {
				targets: this.getPreviewTargetDetails(),
			});
		});
	}

	addClickEffects() {
		if (this.supportsWebAnimationPreview()) {
			this.playPreviewAnimations('in');
			this.forcePreviewReflow();
			return;
		}

		if (this.transitionTimeout) this.addPreviewTransition('in');
		clearTimeout(this.transitionTimeout);

		this.addPreviewTransition('in');
		this.debugPreview('click:in-transition-added', {
			transition: this.getStyleDebug(this.previewInTransitionEl),
			targets: this.getPreviewTargetDetails(),
		});

		this.forcePreviewReflow();
		this.addDataAttrToBlock();
		this.debugPreview('click:styles-applied', {
			style: this.getStyleDebug(this.previewStylesEl),
			targets: this.getPreviewTargetDetails(),
		});
	}

	onMouseClick() {
		this.debugPreview('event:click');
		this.debugPreviewDeep('event:click:deep', () =>
			this.getDeepPreviewDebugDetails('event:click')
		);
		this.addClickEffects();
	}

	/**
	 * Generates a clean CSS and Effect object to be used to generate styles
	 * and transition strings.
	 */
	generateCssResponsiveObj() {
		const getCssObjForEachTarget = (css, effects) => {
			const stylesObj = {};
			const effectsObj = {};

			const getLastEffectsBreakpointAttribute = (
				target,
				currentBreakpoint,
				isOut = false
			) => {
				const inOrOutEffects = isOut ? effects.out : effects;

				const lastBreakpoint = this.getLastUsableBreakpoint(
					currentBreakpoint,
					breakpoint =>
						Object.prototype.hasOwnProperty.call(
							inOrOutEffects,
							`${target}-${breakpoint}`
						)
				);

				return {
					[target]:
						inOrOutEffects[
							`${target}-${lastBreakpoint ?? 'general'}`
						],
				};
			};

			this.breakpoints.forEach(breakpoint => {
				const hasCSS = Object.prototype.hasOwnProperty.call(
					css,
					breakpoint
				);

				if (hasCSS)
					stylesObj[breakpoint] = { ...css[breakpoint].styles };

				if (effects.disableTransition) return;

				const getTransitionAttributes = (isOut = false) =>
					[
						'split',
						'transition-status',
						'transition-duration',
						'transition-delay',
						'easing',
					].reduce(
						(prev, curr) => ({
							...prev,
							...getLastEffectsBreakpointAttribute(
								curr,
								breakpoint,
								isOut
							),
						}),
						{}
					);

				effectsObj[breakpoint] = getTransitionAttributes();

				if (effectsObj[breakpoint].split)
					effectsObj[breakpoint].out = getTransitionAttributes(true);
			});

			return { stylesObj, effectsObj };
		};

		const cleanValues = obj => {
			const response = { ...obj };

			// Clean values
			Object.entries(response).forEach(([key, value]) => {
				[...this.breakpoints]
					.reverse()
					.reduce((prevBreakpoint, breakpoint) => {
						const doesExist = Object.prototype.hasOwnProperty.call(
							value,
							prevBreakpoint
						);

						if (!doesExist) return breakpoint;

						const isEmpty =
							Object.keys(value[prevBreakpoint]).length === 0;
						const isEqualThanPrevious =
							JSON.stringify(value[breakpoint]) ===
							JSON.stringify(value[prevBreakpoint]);

						if (isEmpty || isEqualThanPrevious)
							delete response[key][prevBreakpoint];

						return breakpoint;
					});
			});

			return response;
		};

		const stylesObjs = [];
		const effectsObjs = [];

		const pushStylesAndEffects = obj => {
			const isEmptyObject = obj => Object.keys(obj).length === 0;

			Object.entries(obj).forEach(([key, value]) => {
				const arrayToPush =
					key === 'stylesObj' ? stylesObjs : effectsObjs;
				arrayToPush.push(!isEmptyObject(value) ? value : null);
			});
		};

		if (Array.isArray(this.css))
			this.css.forEach((css, index) => {
				if (this.hasMultipleTargetsArray[index]) {
					const stylesObj = {};
					// effectsObj is the same for all targets
					let effectsObj = {};

					Object.keys(css).forEach(target => {
						const {
							stylesObj: rawStylesObj,
							effectsObj: rawEffects,
						} = cleanValues(
							getCssObjForEachTarget(
								css[target],
								this.effects[index]
							)
						);

						stylesObj[target] = rawStylesObj;
						effectsObj = rawEffects;
					});

					pushStylesAndEffects({ stylesObj, effectsObj });
				} else {
					pushStylesAndEffects(
						cleanValues(
							getCssObjForEachTarget(css, this.effects[index])
						)
					);
				}
			});

		return {
			stylesObjs,
			effectsObjs,
		};
	}

	generateBreakpointsObj() {
		const breakpointsObj = {};

		const getBreakpointValues = css => {
			this.breakpoints.forEach(breakpoint => {
				const containsBreakpoint = Object.prototype.hasOwnProperty.call(
					css,
					breakpoint
				);

				if (!containsBreakpoint) return;

				const hasStyles = css[breakpoint].styles.isArray
					? css[breakpoint].styles.length > 0
					: Object.keys(css[breakpoint].styles).length > 0;

				if (hasStyles) {
					let { breakpoint: breakpointValue } = css[breakpoint];

					breakpointValue =
						breakpoint === 'general' ? '' : breakpointValue;

					breakpointsObj[breakpoint] = breakpointValue;
				}
			});
		};

		if (Array.isArray(this.css))
			this.css.forEach((css, index) => {
				if (this.hasMultipleTargetsArray[index]) {
					Object.keys(css).forEach(target => {
						getBreakpointValues(css[target]);
					});
				} else getBreakpointValues(css);
			});

		return breakpointsObj;
	}

	static escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	getAvoidHover() {
		if (!this.hoverStatus || !this.targetEl) return;

		this.transitionTargetsArray.forEach(transitionTargets =>
			this.avoidHoverArray.push(
				transitionTargets.some(transitionTarget =>
					Array.from(
						this.mainDocument.querySelectorAll(
							`${this.fullTarget} ${
								this.fullTarget.includes(transitionTarget)
									? ''
									: transitionTarget
							}`
						)
					).some(
						element =>
							this.targetEl
								.closest('.maxi-block')
								.contains(element) &&
							this.targetEl.contains(element)
					)
				)
			)
		);
	}

	setDataAttrToBlock(value) {
		if (!this.blockTargetEl) return;
		// On setting the 'false' value, is necessary to check the 'data-maxi-relations-trigger'
		// to ensure the last trigger is not removed. It happens when moving from some trigger to
		// other really fast between while `transitionTimeout` is still running.
		if (value === 'false') {
			const currentTrigger = this.blockTargetEl.getAttribute(
				'data-maxi-relations-trigger'
			);

			if (currentTrigger === this.trigger || !currentTrigger)
				this.blockTargetEl.setAttribute('data-maxi-relations', value);
		} else this.blockTargetEl.setAttribute('data-maxi-relations', value);

		this.blockTargetEl.setAttribute(
			'data-maxi-relations-trigger',
			this.trigger
		);
	}

	addDataAttrToBlock() {
		this.setDataAttrToBlock('true');
	}

	removeAddAttrToBlock() {
		this.setDataAttrToBlock('false');
	}

	// Target for the creation of styles and transition lines needs to be considered
	// as it can create higher specificity than the default block styles.
	getTargetForLine(transitionTarget, mainTarget = this.dataTarget) {
		if (transitionTarget)
			if (!mainTarget.includes(transitionTarget))
				return `${mainTarget} ${transitionTarget}`;
			else return mainTarget;

		return `${mainTarget} ${this.target}`;
	}

	generateStyles() {
		const getStylesLine = (stylesObj, target, index) => {
			if (!stylesObj) return;
			const isBackground = target.includes('maxi-background-displayer');

			Object.entries(this.breakpointsObj).forEach(
				([breakpoint, breakpointValue]) => {
					if (stylesObj[breakpoint]) {
						// Checks if the element needs special CSS to be avoided in case the element is hovered
						const avoidHoverString = this.avoidHoverArray[index]
							? ':not(:hover)'
							: '';

						let finalTarget;
						// For background layers styles, avoidHoverString needs to be added to the parent element
						// to make sure hover styles will override the IB styles.
						if (target.includes('.maxi-background-displayer')) {
							finalTarget = target
								.replace(
									/(\s*)> .maxi-background-displayer/,
									match => `${avoidHoverString}${match}`
								)
								.trim();
						} else if (
							target.includes('.maxi-button-block__button')
						) {
							// Avoids button content and icon have different trigger when hovering.
							finalTarget = target.replace(
								'maxi-button-block__button',
								match => `${match}${avoidHoverString}`
							);
						} else if (this.isSVG) {
							finalTarget = target.replace(
								'maxi-svg-icon-block__icon',
								match => `${match}${avoidHoverString}`
							);
						} else {
							finalTarget = `${target.trim()}${avoidHoverString}`;
						}

						if (
							finalTarget.includes(
								'maxi-button-block__content'
							) &&
							!finalTarget.includes('maxi-button-block__button')
						) {
							finalTarget = finalTarget
								.replace(avoidHoverString, '')
								.replace(
									'.maxi-button-block__content',
									`.maxi-button-block__button${avoidHoverString} .maxi-button-block__content`
								);
						}

						if (
							breakpoint !== 'general' &&
							finalTarget.includes('[maxi-blocks-responsive]')
						)
							finalTarget = finalTarget.replace(
								'[maxi-blocks-responsive]',
								`[maxi-blocks-responsive="${breakpoint}"]`
							);

						const selector =
							this.isSiteEditor || this.isEditorIframe
								? `body.maxi-blocks--active${finalTarget} {`.replace(
										/\s{2,}/g,
										' '
								  )
								: `body.maxi-blocks--active ${finalTarget} {`.replace(
										/\s{2,}/g,
										' '
								  );

						Object.entries(stylesObj[breakpoint]).forEach(
							([key, value]) => {
								const selectorRegExp = new RegExp(
									`(${Relation.escapeRegExp(selector)})`
								);

								if (!this.stylesString.match(selectorRegExp))
									this.stylesString += `${selector}}`;

								let postfix = '';

								if (
									selector.includes('divider-maxi') &&
									(key === 'width' || key === 'height')
								)
									postfix = ' !important';

								this.stylesString = this.stylesString.replace(
									selectorRegExp,
									`$1 ${key}: ${value}${postfix};`
								);
							}
						);

						if (this.isBorderArray[index] && isBackground) {
							const getBorderValue = target =>
								this.attributes[
									`border-${target}-width-${breakpoint}`
								];

							const widthTop = getBorderValue('top');
							const widthRight = getBorderValue('right');
							const widthBottom = getBorderValue('bottom');
							const widthLeft = getBorderValue('left');
							const widthUnit =
								this.attributes[`border-unit-${breakpoint}`] ||
								'px';

							// Rounds to 2 decimals
							const roundNumber = number =>
								Math.round(number * 100) / 100;

							const selectorRegExp = new RegExp(
								`(${Relation.escapeRegExp(selector)})`
							);
							if (!this.stylesString.match(selectorRegExp))
								this.stylesString += `${selector}}`;

							if (widthTop || widthTop === 0)
								this.stylesString = this.stylesString.replace(
									selectorRegExp,
									`$1 top: -${roundNumber(
										widthTop
									)}${widthUnit};`
								);
							if (widthBottom || widthBottom === 0)
								this.stylesString = this.stylesString.replace(
									selectorRegExp,
									`$1 bottom: -${roundNumber(
										widthBottom
									)}${widthUnit};`
								);
							if (widthLeft || widthLeft === 0)
								this.stylesString = this.stylesString.replace(
									selectorRegExp,
									`$1 left: -${roundNumber(
										widthLeft
									)}${widthUnit};`
								);
							if (widthRight || widthRight === 0)
								this.stylesString = this.stylesString.replace(
									selectorRegExp,
									`$1 right: -${roundNumber(
										widthRight
									)}${widthUnit};`
								);
						}
					}
				}
			);
		};
		const mainTarget = this.dataTarget;

		this.stylesObjs.forEach((stylesObj, index) => {
			if (this.hasMultipleTargetsArray[index])
				Object.entries(stylesObj).forEach(
					([targetSelector, styles]) =>
						Object.keys(styles).length &&
						getStylesLine(
							styles,
							`${mainTarget} ${targetSelector}`,
							index
						)
				);
			else
				this.transitionTargetsArray[index].forEach(transitionTarget =>
					getStylesLine(
						stylesObj,
						this.getTargetForLine(
							transitionTarget,
							this.dataTarget
						),
						index
					)
				);
		});
	}

	addStyles() {
		this.addStyleEl(this.stylesEl);
	}

	removeStyles() {
		if (this.stylesEl) this.stylesEl.remove();
	}

	generateTransitions() {
		let inTransitionString = '';
		let outTransitionString = '';

		const getTransitionLine = (stylesObj, target, index) => {
			const isBackground = target.includes('maxi-background-displayer');

			Object.entries(this.breakpointsObj).forEach(
				([breakpoint, breakpointValue]) => {
					let hasEffects = !!this.effectsObjs[index][breakpoint];
					let effectsBreakpoint = breakpoint;

					// Default effects will come for general breakpoint, but maybe
					// creator has decided to affect to a concrete breakpoint, so there's
					// no styles for general. The result is that we have styles for a concrete
					// breakpoint and transitions for general. Need to set general transitions
					// in that case or the transition will not work.
					if (!hasEffects) {
						const breakpointIndex =
							this.breakpoints.indexOf(breakpoint);

						const previousBreakpoints = this.breakpoints.slice(
							0,
							breakpointIndex
						);

						const prevEffectsBreakpoints =
							previousBreakpoints.filter(
								previousBreakpoint =>
									this.effectsObjs[index][previousBreakpoint]
							);
						const prevEffectsBreakpoint = prevEffectsBreakpoints[0];
						const prevBreakpointsHasStyles = !this.stylesObjs.some(
							styleObj =>
								styleObj && prevEffectsBreakpoint in styleObj
						);

						if (
							prevEffectsBreakpoints.length &&
							prevBreakpointsHasStyles
						)
							hasEffects = true;

						effectsBreakpoint = prevEffectsBreakpoint;
					}

					if (hasEffects) {
						// Add style objects from current and higher breakpoints,
						// because styles from higher breakpoints will apply for lower ones
						// and need to add transitions for them as well.
						let currentStyleObj = [...this.breakpoints]
							.splice(0, this.breakpoints.indexOf(breakpoint) + 1)
							.reduce((acc, breakpoint) => {
								const lastUsableBreakpoint =
									this.getLastUsableBreakpoint(
										breakpoint,
										bp =>
											stylesObj?.[bp] &&
											Object.keys(stylesObj[bp]).length
									);

								if (
									lastUsableBreakpoint !== undefined &&
									stylesObj?.[lastUsableBreakpoint]
								) {
									return {
										...acc,
										...stylesObj[lastUsableBreakpoint],
									};
								}

								return acc;
							}, {});

						if (this.isBorder && isBackground)
							currentStyleObj = {
								...currentStyleObj,
								top: null,
								left: null,
							};

						if (Object.keys(currentStyleObj).length) {
							const addTransitionString = (
								transitionString,
								transitionTarget,
								fullTransitionStringRaw
							) => {
								let fullTransitionString =
									fullTransitionStringRaw;

								let selector =
									this.isSiteEditor || this.isEditorIframe
										? `body.maxi-blocks--active${transitionTarget} {`.replace(
												/\s{2,}/g,
												' '
										  )
										: `body.maxi-blocks--active ${transitionTarget} {`.replace(
												/\s{2,}/g,
												' '
										  );
								if (
									breakpoint !== 'general' &&
									selector.includes(
										'[maxi-blocks-responsive]'
									)
								)
									selector = selector.replace(
										'[maxi-blocks-responsive]',
										`[maxi-blocks-responsive="${breakpoint}"]`
									);

								const selectorRegExp = new RegExp(
									`(${Relation.escapeRegExp(selector)})`
								);

								if (!fullTransitionString.match(selectorRegExp))
									fullTransitionString += `${selector}}`;

								const transitionExistsRegExp = new RegExp(
									`(${Relation.escapeRegExp(
										selector
									)}[^{]*transition:)`
								);
								if (!transitionString) return '';

								if (
									fullTransitionString.match(
										transitionExistsRegExp
									)
								) {
									if (!this.isIconArray[index])
										fullTransitionString =
											fullTransitionString.replace(
												transitionExistsRegExp,
												`$1 ${transitionString}`
											);
								} else {
									fullTransitionString =
										fullTransitionString.replace(
											selectorRegExp,
											`$1 transition: ${transitionString.replace(
												/, $/,
												''
											)};`
										);
								}

								return fullTransitionString;
							};

							const effectsObj =
								this.effectsObjs[index][effectsBreakpoint];
							const { split } = effectsObj;

							if (split) {
								const inTransitionStringPart =
									this.getTransitionString(
										currentStyleObj,
										effectsObj,
										this.isIconArray[index]
									);
								inTransitionString = addTransitionString(
									inTransitionStringPart,
									target,
									inTransitionString
								);

								const outTransitionStringPart =
									this.getTransitionString(
										currentStyleObj,
										effectsObj.out,
										this.isIconArray[index]
									);
								outTransitionString = addTransitionString(
									outTransitionStringPart,
									target,
									outTransitionString
								);
							} else {
								const transitionString =
									this.getTransitionString(
										currentStyleObj,
										effectsObj,
										this.isIconArray[index]
									);

								inTransitionString = addTransitionString(
									transitionString,
									target,
									inTransitionString
								);
								outTransitionString = addTransitionString(
									transitionString,
									target,
									outTransitionString
								);
							}
						}
					}
				}
			);
		};

		this.stylesObjs.forEach((stylesObj, index) => {
			if (this.effects[index].disableTransition) return;

			if (this.hasMultipleTargetsArray[index]) {
				if (!this.isSVG)
					Object.keys(stylesObj).forEach(targetSelector => {
						getTransitionLine(
							stylesObj[targetSelector],
							`${this.dataTarget} ${targetSelector}`,
							index
						);
					});
				else
					this.transitionTargetsArray[index].forEach(
						transitionTarget => {
							// Checks if the element needs special CSS to be avoided in case the element is hovered
							const svgTarget = `${this.dataTarget} ${
								this.avoidHoverArray[index]
									? transitionTarget.replace(
											'maxi-svg-icon-block__icon',
											match => `${match}:not(:hover)`
									  )
									: transitionTarget
							}`;

							Object.keys(stylesObj).forEach(targetSelector =>
								getTransitionLine(
									stylesObj[targetSelector],
									svgTarget,
									index
								)
							);
						}
					);
			} else
				this.transitionTargetsArray[index].forEach(transitionTarget =>
					getTransitionLine(
						stylesObj,
						this.getTargetForLine(transitionTarget),
						index
					)
				);
		});

		this.inTransitionString = inTransitionString;
		this.outTransitionString = outTransitionString;
	}

	addTransition(element) {
		this.addStyleEl(element);
	}

	// eslint-disable-next-line class-methods-use-this
	removeTransition(element) {
		element?.remove();
	}

	// eslint-disable-next-line class-methods-use-this
	isEmptyDefaultTransition(defaultTransition) {
		return /^none(?:\s|$)/.test((defaultTransition || '').trim());
	}

	getTransitionString(styleObj, effectsObj, isIcon) {
		const {
			'transition-status': status,
			'transition-duration': duration,
			'transition-delay': delay,
			easing,
		} = effectsObj;

		const transitionPropertiesString = `${
			status ? `${duration}s ${easing} ${delay}s` : '0s 0s'
		}, `;

		const transitionString = isIcon
			? `all ${transitionPropertiesString}`
			: Object.keys(styleObj).reduce(
					(transitionString, style) =>
						`${transitionString}${style} ${transitionPropertiesString}`,
					''
			  );

		if (
			!this.isEmptyDefaultTransition(this.defaultTransition) &&
			!transitionString.includes(this.defaultTransition)
		) {
			return `${this.defaultTransition}, ${transitionString}`;
		}
		return transitionString;
	}

	// Ensures the data-maxi-relations attributes keeps 'true' while the main element is hovered.
	// This situation prevents the attribute set to false when the target element is triggered by 2
	// or more elements that are nested one inside the other
	addRelationSubscriber() {
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'data-maxi-relations'
				) {
					if (mutation.target.dataset.maxiRelations !== 'true')
						mutation.target.dataset.maxiRelations = 'true';
				}
			});
		});

		if (this.blockTargetEl)
			observer.observe(this.blockTargetEl, {
				attributes: true,
				attributeFilter: ['data-maxi-relations'],
			});

		this.observer = observer;
	}

	// Removes the observer added by the addRelationSubscriber method
	removeRelationSubscriber() {
		if (this.observer && typeof this.observer.disconnect === 'function') {
			this.observer.disconnect();
			this.observer = null;
		}
	}

	enableTransitions() {
		this.debugPreview('hover-enter:start');
		if (this.transitionTimeout) this.addPreviewTransition('in');
		clearTimeout(this.transitionTimeout);

		this.addPreviewTransition('in');
		this.debugPreview('hover-enter:in-transition-added', {
			transition: this.getStyleDebug(this.previewInTransitionEl),
			targets: this.getPreviewTargetDetails(),
		});
		this.forcePreviewReflow();
		this.addDataAttrToBlock();
		this.addRelationSubscriber();
		this.debugPreview('hover-enter:styles-applied', {
			style: this.getStyleDebug(this.previewStylesEl),
			targets: this.getPreviewTargetDetails(),
		});
	}

	disableTransitions() {
		this.cancelPreviewDemo();
		this.addPreviewTransition('out');

		this.removeAddAttrToBlock();
	}

	removePreviousStylesAndTransitions() {
		this.enableStaticStartState();

		// IDs for the styles and transitions elements
		const previousStylesElId = `relations--${this.uniqueID}-${this.id}-styles`;
		const previousInTransitionsElId = `relations--${this.uniqueID}-${this.id}-in-transitions`;
		const previousOutTransitionsElId = `relations--${this.uniqueID}-${this.id}-out-transitions`;

		// Function to remove an element by its ID
		const removeElementsById = elementId => {
			const elements = this.mainDocument.querySelectorAll(
				`#${elementId}`
			);
			elements.forEach(element => {
				if (element) {
					element.remove();
				}
			});
		};

		// Remove the previous styles and transitions elements
		[
			previousStylesElId,
			previousInTransitionsElId,
			previousOutTransitionsElId,
		].forEach(elementId => {
			removeElementsById(elementId);
			removeElementsById(`${elementId}-preview`);
		});
	}
}

export default Relation;
