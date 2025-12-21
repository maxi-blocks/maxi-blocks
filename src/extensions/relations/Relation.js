/**
 * Internal dependencies
 */
import getBlockNameFromUniqueID from '@extensions/attributes/getBlockNameFromUniqueID';
import { getIsSiteEditor, getSiteEditorIframe } from '@extensions/fse';

// Relations (IB)
class Relation {
	constructor(item, relationAction = null, relationIndex = null) {
		this.id = item?.id;
		this.uniqueID = item?.uniqueID;
		this.css = item?.css;
		this.beforeCss = item?.beforeCss; // Before state CSS
		this.isPreview = false;

		if (!this.uniqueID || this.css.length === 0) return;

		this.mainDocument = document;
		this.mainWindow = window;

		this.isSiteEditor = getIsSiteEditor();
		if (this.isSiteEditor) {
			const siteEditorIframe = getSiteEditorIframe();
			if (siteEditorIframe) this.mainDocument = siteEditorIframe;
			const iframe =
				document.querySelector(
					'.edit-site-visual-editor .components-resizable-box__container iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
				) ??
				document.querySelector(
					'.editor-visual-editor .components-resizable-box__container iframe[name="editor-canvas"].edit-site-visual-editor__editor-canvas'
				);
			if (iframe) this.mainWindow = iframe.contentWindow;
		}

		this.trigger = item.trigger;
		this.triggerEl = this.mainDocument.querySelector(`.${this.trigger}`);

		this.blockTarget = `.${this.uniqueID}`;
		this.blockTargetEl = this.mainDocument.querySelector(this.blockTarget);
		this.target = item.target ?? '';

		this.targetPrefix = this.isSiteEditor
			? '.editor-styles-wrapper[maxi-blocks-responsive] .maxi-block.maxi-block--backend'
			: '.edit-post-visual-editor[maxi-blocks-responsive] .maxi-block.maxi-block--backend';

		this.fullTarget = `${this.targetPrefix}${this.blockTarget} ${this.target}`;
		this.targetEl = this.mainDocument.querySelector(this.fullTarget);
		this.dataTarget = `${this.targetPrefix}${
			this.blockTarget
		}[data-maxi-relations="true"]${`[data-type="maxi-blocks/${getBlockNameFromUniqueID(
			this.uniqueID
		)}"]`}`;

		if (!this.triggerEl || !this.targetEl) return;

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
		this.beforeStylesString = '';
		this.generateStyles();
		this.generateBeforeStyles();

		this.stylesEl = null;
		this.beforeStylesEl = null;
		this.inTransitionEl = null;
		this.outTransitionEl = null;
		this.generateStylesEls();

		// Prevents removing the IB transitions before they end when mouse leave the IB trigger
		this.transitionTimeout = null;
		// Prevents IB transitions overwrite native hover ones (when is contained) when mouse
		// leave the hover transition trigger
		this.contentTimeout = null;
	}

	// Create style elements for before/after styles and transitions
	generateStylesEls() {
		// After state styles (applied on trigger)
		this.stylesEl = this.mainDocument.createElement('style');
		this.stylesEl.id = `relations--${this.uniqueID}-${this.id}-styles`;
		this.stylesEl.setAttribute('data-type', this.action);
		this.stylesEl.setAttribute('data-sids', this.sids);
		this.stylesEl.innerText = this.stylesString;

		// Before state styles (applied immediately as default)
		if (this.beforeStylesString.length > 0) {
			this.beforeStylesEl = this.mainDocument.createElement('style');
			this.beforeStylesEl.id = `relations--${this.uniqueID}-${this.id}-before-styles`;
			this.beforeStylesEl.setAttribute('data-type', 'before');
			this.beforeStylesEl.setAttribute('data-sids', this.sids);
			this.beforeStylesEl.innerText = this.beforeStylesString;
		}

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

	getLastUsableBreakpoint(currentBreakpoint, callback) {
		return [...this.breakpoints]
			.splice(0, this.breakpoints.indexOf(currentBreakpoint) + 1)
			.reverse()
			.find(breakpoint => callback(breakpoint));
	}

	setIsPreview(isPreview) {
		this.isPreview = isPreview;

		if (this.isPreview) {
			this.addBeforeStyles(); // Apply before state as default
			this.enableTransitions();
		} else {
			this.removeBeforeStyles();
			this.disableTransitions();
		}
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

						const selector = this.isSiteEditor
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

	/**
	 * Generate CSS string from beforeCss for the default/resting state
	 */
	generateBeforeStyles() {
		// console.log('Rel: generateBeforeStyles', this.uniqueID, this.beforeCss);
		if (!this.beforeCss || Object.keys(this.beforeCss).length === 0) return;

		// Use the same target format as generateStyles
		// Before styles should apply to the block without the data-maxi-relations condition
		const baseTarget = `${this.targetPrefix}${this.blockTarget}`;

		Object.entries(this.beforeCss).forEach(([breakpoint, data]) => {
			if (!data?.styles || Object.keys(data.styles).length === 0) return;

			let targetWithBreakpoint = baseTarget;
			if (breakpoint !== 'general') {
				targetWithBreakpoint = targetWithBreakpoint.replace(
					'[maxi-blocks-responsive]',
					`[maxi-blocks-responsive="${breakpoint}"]`
				);
			}

			// Build the full selector with target
			const fullTarget = this.target
				? `${targetWithBreakpoint} ${this.target}`
				: targetWithBreakpoint;

			// Simplified selector - relies on add/remove lifecycle instead of body class
			const selector = `${fullTarget} {`.replace(/\s{2,}/g, ' ');

			let cssBlock = selector;
			Object.entries(data.styles).forEach(([prop, value]) => {
				cssBlock += ` ${prop}: ${value} !important;`;
			});
			cssBlock += ' }';

			this.beforeStylesString += cssBlock;
		});
		// console.log('Rel: beforeStylesString', this.beforeStylesString);
	}

	addStyles() {
		this.addStyleEl(this.stylesEl);
	}

	addBeforeStyles() {
		if (this.beforeStylesEl) {
			this.addStyleEl(this.beforeStylesEl);
		}
	}

	removeStyles() {
		if (this.stylesEl) this.stylesEl.remove();
	}

	removeBeforeStyles() {
		if (this.beforeStylesEl) this.beforeStylesEl.remove();
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

								let selector = this.isSiteEditor
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
			this.defaultTransition !== 'none 0s ease 0s' &&
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
		// console.log('IB is active'); // 🔥
		if (this.transitionTimeout) this.removeTransition(this.outTransitionEl);
		clearTimeout(this.transitionTimeout);

		this.addRelationSubscriber();

		this.addDataAttrToBlock();
		this.addTransition(this.inTransitionEl);
		this.addStyles();
	}

	disableTransitions() {
		// console.log('IB is inactive'); // 🔥
		this.removeTransition(this.inTransitionEl);
		this.addTransition(this.outTransitionEl);

		this.removeStyles();
	}

	removePreviousStylesAndTransitions() {
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
		removeElementsById(previousStylesElId);
		removeElementsById(previousInTransitionsElId);
		removeElementsById(previousOutTransitionsElId);
	}
}

export default Relation;
