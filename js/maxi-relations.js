/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
// Relations (IB)
class Relation {
	constructor(item) {
		this.uniqueID = item?.uniqueID;
		this.css = item?.css;

		// Check if css is empty (either no length, or empty object)
		const isCssEmpty = Array.isArray(this.css)
			? this.css.length === 0
			: !this.css ||
			  (typeof this.css === 'object' &&
					Object.keys(this.css).length === 0);

		if (!this.uniqueID || isCssEmpty) return;

		this.trigger = item.trigger;
		this.triggerEl = document.querySelector(`.${this.trigger}`);
		this.blockTargetEl = document.querySelector(`#${this.uniqueID}`);
		this.target = item.target ?? '';
		this.fullTarget = `#${item.uniqueID} ${this.target}`;
		this.targetEl = document.querySelector(this.fullTarget);
		this.dataTarget = `#${item.uniqueID}[data-maxi-relations="true"]`;

		if (!this.triggerEl || !this.targetEl) return;

		this.defaultTransition = window
			.getComputedStyle(this.targetEl)
			.getPropertyValue('transition');

		// Normalize the default transition to ensure consistency across browsers
		if (this.defaultTransition.trim() === 'none') {
			this.defaultTransition = 'none 0s ease 0s';
		}

		this.breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		this.breakpointsSet = new Set(this.breakpoints);
		const hasMultipleTargets = item =>
			Object.keys(item).some(key => !this.breakpointsSet.has(key));
		this.hasMultipleTargetsArray = this.css.map(hasMultipleTargets);

		this.action = item.action;
		this.sids = item.sid || item.settings;
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
		this.generateStylesEls();

		// Prevents removing the IB transitions before they end when mouse leave the IB trigger
		this.transitionTimeout = null;
		// Prevents IB transitions overwrite native hover ones (when is contained) when mouse
		// leave the hover transition trigger
		this.contentTimeout = null;

		this.init();
	}

	// Create two different <style> elements, one for the styles and one for the transitions.
	generateStylesEls() {
		this.stylesEl = document.createElement('style');
		this.stylesEl.id = `relations--${this.uniqueID}-styles`;
		this.stylesEl.setAttribute('data-type', this.action);
		this.stylesEl.setAttribute('data-sids', this.sids);
		this.stylesEl.innerText = this.stylesString;

		if (this.inTransitionString.length > 0) {
			this.inTransitionEl = document.createElement('style');
			this.inTransitionEl.id = `relations--${this.uniqueID}-in-transitions`;
			this.inTransitionEl.setAttribute('data-type', this.action);
			this.inTransitionEl.setAttribute('data-sids', this.sids);
			this.inTransitionEl.innerText = this.inTransitionString;
		}
		if (this.outTransitionString.length > 0) {
			this.outTransitionEl = document.createElement('style');
			this.outTransitionEl.id = `relations--${this.uniqueID}-out-transitions`;
			this.outTransitionEl.setAttribute('data-type', this.action);
			this.outTransitionEl.setAttribute('data-sids', this.sids);
			this.outTransitionEl.innerText = this.outTransitionString;
		}
	}

	// Insert transitions or styles element just after Maxi inline css element
	addStyleEl(styleEl) {
		if (!styleEl) return;

		if (!this.inlineStylesEl)
			this.inlineStylesEl = document.querySelector(
				'style[id*=maxi-blocks]'
			);

		const currentEl = document.querySelector(`#${styleEl.id}`);

		if (currentEl) {
			const currentElSids = currentEl
				.getAttribute('data-sids')
				.split(',')
				.map(item => item.trim());

			if (
				currentEl.getAttribute('data-type') === this.action &&
				JSON.stringify(currentElSids) === JSON.stringify(this.sids)
			)
				currentEl.replaceWith(styleEl);
			else currentEl.insertAdjacentElement('afterend', styleEl);
		} else
			this.inlineStylesEl.parentNode.insertBefore(
				styleEl,
				this.inlineStylesEl.nextSibling
			);
	}

	getCurrentBreakpoint() {
		const winWidth = window.innerWidth;

		let currentBreakpoint = 'general';

		Object.entries(this.breakpointsObj).forEach(([breakpoint, value]) => {
			if (!['general', 'xxl'].includes(breakpoint)) {
				if (breakpoint === 'general') return;

				if (winWidth <= this.breakpointsObj.xl)
					currentBreakpoint = breakpoint;
			}
			if (winWidth <= value) currentBreakpoint = breakpoint;
		});

		return currentBreakpoint;
	}

	getLastUsableBreakpoint(currentBreakpoint, callback) {
		const index = this.breakpoints.indexOf(currentBreakpoint);
		for (let i = index; i > -1; i -= 1) {
			if (callback(this.breakpoints[i])) {
				return this.breakpoints[i];
			}
		}
		return null;
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

		this.css.forEach((css, index) => {
			if (this.hasMultipleTargetsArray[index]) {
				const stylesObj = {};
				// effectsObj is the same for all targets
				let effectsObj = {};

				Object.keys(css).forEach(target => {
					const { stylesObj: rawStylesObj, effectsObj: rawEffects } =
						cleanValues(
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

		this.css.forEach((css, index) => {
			if (this.hasMultipleTargetsArray[index]) {
				Object.keys(css).forEach(target => {
					getBreakpointValues(css[target]);
				});
			} else getBreakpointValues(css);
		});

		return breakpointsObj;
	}

	escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	getAvoidHover() {
		if (!this.hoverStatus || !this.targetEl) return;

		this.transitionTargetsArray.forEach(transitionTargets =>
			this.avoidHoverArray.push(
				transitionTargets.some(transitionTarget =>
					Array.from(
						document.querySelectorAll(
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
		// On setting the 'false' value, is necessary to check the 'data-maxi-relations-trigger'
		// to ensure the last trigger is not removed. It happens when moving from some trigger to
		// other really fast between while `transitionTimeout` is still running.
		if (value === 'false') {
			const currentTrigger = this.blockTargetEl?.getAttribute(
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

	getMediaLines(breakpoint, breakpointValue) {
		let prevLine = '';
		let postLine = '';

		if (breakpoint === 'general') return { prevLine, postLine };

		const mediaRule = breakpoint === 'xxl' ? 'min-width' : 'max-width';
		const mediaValue =
			breakpoint === 'xxl' ? breakpointValue + 1 : breakpointValue;

		prevLine = `@media screen and (${mediaRule}: ${mediaValue}px) {`;
		postLine = '}';

		return { prevLine, postLine };
	}

	generateStyles() {
		const getStylesLine = (stylesObj, target, index) => {
			const isBackground = target.includes('maxi-background-displayer');
			let targetStyleString = '';

			Object.entries(this.breakpointsObj).forEach(
				([breakpoint, breakpointValue]) => {
					if (stylesObj[breakpoint]) {
						// Checks if the element needs special CSS to be avoided in case the element is hovered
						const avoidHoverString = this.avoidHoverArray[index]
							? ':not(:hover)'
							: '';

						const { prevLine, postLine } = this.getMediaLines(
							breakpoint,
							breakpointValue
						);

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

						const selector =
							`${prevLine} body.maxi-blocks--active ${finalTarget} {`.replace(
								/\s{2,}/g,
								' '
							);

						Object.entries(stylesObj[breakpoint]).forEach(
							([key, value]) => {
								const selectorRegExp = new RegExp(
									`(${this.escapeRegExp(selector)})`
								);
								if (!targetStyleString.match(selectorRegExp)) {
									targetStyleString += `${selector}}${postLine}`;
								}

								// Generate the property-value pair string
								const propertyValuePair = `${key}: ${value};`;

								// Check if the property-value pair already exists in the stylesString
								if (
									!targetStyleString.includes(
										propertyValuePair
									)
								) {
									// If it doesn't exist, perform the replace operation
									targetStyleString =
										targetStyleString.replace(
											selectorRegExp,
											`$1 ${propertyValuePair}`
										);
								}
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
								`(${this.escapeRegExp(selector)})`
							);
							if (!targetStyleString.match(selectorRegExp))
								targetStyleString += `${selector}}${postLine}`;

							if (widthTop || widthTop === 0)
								targetStyleString = targetStyleString.replace(
									selectorRegExp,
									`$1 top: -${roundNumber(
										widthTop
									)}${widthUnit};`
								);
							if (widthBottom || widthBottom === 0)
								targetStyleString = targetStyleString.replace(
									selectorRegExp,
									`$1 bottom: -${roundNumber(
										widthBottom
									)}${widthUnit};`
								);
							if (widthLeft || widthLeft === 0)
								targetStyleString = targetStyleString.replace(
									selectorRegExp,
									`$1 left: -${roundNumber(
										widthLeft
									)}${widthUnit};`
								);
							if (widthRight || widthRight === 0)
								targetStyleString = targetStyleString.replace(
									selectorRegExp,
									`$1 right: -${roundNumber(
										widthRight
									)}${widthUnit};`
								);
						}
					}
				}
			);

			this.stylesString += targetStyleString;
		};

		// On styles (not transitions), we need to keep the styles after run the interaction.
		// As the same target block can be used by multiple interactions, we can't depend the styles
		// on the "data-relations" attribute, as it can be changed by other interactions.
		// To prevent it, in case the interaction is 'click' type, the target don't contains
		// the "data-relations" attribute, so we can keep the styles after the interaction.
		const mainTarget =
			this.action === 'click'
				? `#${this.uniqueID}[data-maxi-relations="true"]`
				: this.dataTarget;

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
							this.action === 'click'
								? `#${this.uniqueID}[data-maxi-relations="true"]`
								: this.dataTarget
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
		this.stylesEl.remove();
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
							styleObj => prevEffectsBreakpoint in styleObj
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
							.reduce(
								(acc, breakpoint) => ({
									...acc,
									...stylesObj[
										this.getLastUsableBreakpoint(
											breakpoint,
											breakpoint =>
												stylesObj?.[breakpoint] &&
												Object.keys(
													stylesObj?.[breakpoint]
												).length
										)
									],
								}),
								{}
							);

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
								if (
									fullTransitionStringRaw.includes(
										transitionString
									)
								)
									return fullTransitionStringRaw;

								let fullTransitionString =
									fullTransitionStringRaw;

								const { prevLine, postLine } =
									this.getMediaLines(
										breakpoint,
										breakpointValue
									);

								const selector =
									`${prevLine}body.maxi-blocks--active ${transitionTarget} {`.replace(
										/\s{2,}/g,
										' '
									);

								const selectorRegExp = new RegExp(
									`(${this.escapeRegExp(selector)})`
								);

								if (!fullTransitionString.match(selectorRegExp))
									fullTransitionString += `${selector}}${postLine}`;

								const transitionExistsRegExp = new RegExp(
									`(${this.escapeRegExp(
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

		observer.observe(this.blockTargetEl, {
			attributes: true,
			attributeFilter: ['data-maxi-relations'],
		});

		this.observer = observer;
	}

	// Removes the observer added by the addRelationSubscriber method
	removeRelationSubscriber() {
		this.observer?.disconnect();
	}

	init() {
		switch (this.action) {
			case 'hover':
				this.addHoverEvents();
				break;
			case 'click':
			default:
				this.addClickEvents();
				break;
		}
	}

	addHoverEvents() {
		this.triggerEl.addEventListener(
			'mouseenter',
			this.onMouseEnter.bind(this)
		);
		this.triggerEl.addEventListener(
			'mouseleave',
			this.onMouseLeave.bind(this)
		);

		/**
		 * In case the target element is nested inside the trigger element, we need to ensure the original hover transition
		 * works correctly on hovering. It means, we need to remove the transitions added by the trigger when hovering the target
		 * to ensure it has the selected effects
		 */
		if (this.isHoveredContained) {
			this.transitionTriggerEls?.forEach(transitionTriggerEl => {
				transitionTriggerEl.addEventListener('mouseenter', () => {
					// console.log('Entering hover target'); // 🔥

					// Remove transitions to let the original ones be applied
					this.removeTransition(this.inTransitionEl);

					clearTimeout(this.contentTimeout);
				});

				transitionTriggerEl.addEventListener('mouseleave', () => {
					const transitionDuration = Array.from(
						new Set(this.transitionTargetsArray.flat())
					)
						.filter(Boolean)
						.reduce((promise, transitionTarget) => {
							const transitionTargetEl = document.querySelector(
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
												getComputedStyle(
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

					// console.log('Leaving hover target'); // 🔥

					this.contentTimeout = setTimeout(() => {
						// Set the transitions back waiting the original to be done
						this.addTransition(this.inTransitionEl);
					}, transitionDuration);
				});
			});
		}
	}

	onMouseEnter() {
		// console.log('IB is active'); // 🔥
		if (this.transitionTimeout) this.removeTransition(this.outTransitionEl);
		clearTimeout(this.transitionTimeout);

		this.addRelationSubscriber();

		this.addDataAttrToBlock();
		this.addTransition(this.inTransitionEl);
		this.addStyles();
	}

	onMouseLeave() {
		// console.log('IB is inactive'); // 🔥
		this.removeTransition(this.inTransitionEl);
		this.addTransition(this.outTransitionEl);

		this.removeStyles();

		// If the targeted element is hovered and the element has a transition set, remove transitions immediately
		if (
			this.targetEl.matches(':hover') &&
			this.defaultTransition !== 'none 0s ease 0s'
		) {
			this.removeTransition(this.outTransitionEl);
			this.removeAddAttrToBlock();
		} else {
			const transitionTimeout = this.getTransitionTimeout();

			const removeTransitionAction = () => {
				this.removeTransition(this.outTransitionEl);
				this.removeAddAttrToBlock();
				this.removeRelationSubscriber();
			};

			if (transitionTimeout === 0) {
				removeTransitionAction();
			} else {
				this.transitionTimeout = setTimeout(
					removeTransitionAction,
					transitionTimeout
				);
			}
		}
	}

	addClickEvents() {
		this.triggerEl.addEventListener('click', this.onMouseClick.bind(this));
	}

	onMouseClick() {
		this.addDataAttrToBlock();
		this.addTransition(this.inTransitionEl);
		this.addStyles();

		this.transitionTimeout = setTimeout(() => {
			this.removeTransition(this.inTransitionEl);
		}, this.getTransitionTimeout());
	}
}

function initializeRelations() {
	let relations;

	if (typeof maxiRelations !== 'undefined' && maxiRelations !== null) {
		if (typeof maxiRelations[0] === 'string') {
			try {
				relations = JSON.parse(maxiRelations[0]);
			} catch (e) {
				console.error('Invalid JSON string in maxiRelations', e);
				relations = null;
			}
		} else if (
			typeof maxiRelations[0] === 'object' &&
			maxiRelations[0] !== null
		) {
			[relations] = maxiRelations;
		}
	}

	if (
		!relations &&
		typeof maxiRelationsLegacy !== 'undefined' &&
		maxiRelationsLegacy !== null
	) {
		if (typeof maxiRelationsLegacy[0] === 'string') {
			try {
				relations = JSON.parse(maxiRelationsLegacy[0]);
			} catch (e) {
				console.error('Invalid JSON string in maxiRelationsLegacy', e);
				relations = null;
			}
		} else if (
			typeof maxiRelationsLegacy[0] === 'object' &&
			maxiRelationsLegacy[0] !== null
		) {
			[relations] = maxiRelationsLegacy;
		}
	}

	if (!relations) return;

	const uniqueRelations = relations.reduce(
		(uniqueArray, { action, trigger, uniqueID, target }) => {
			const getIsUnique = relation =>
				relation.action === action &&
				relation.trigger === trigger &&
				relation.uniqueID === uniqueID &&
				relation.target === target;

			const isUniqueRelation = uniqueRelation =>
				getIsUnique(uniqueRelation);
			const isUnique = !uniqueArray.find(isUniqueRelation);
			if (isUnique) {
				const isSameRelation = sameRelation =>
					getIsUnique(sameRelation);
				const sameRelations = relations.filter(isSameRelation);
				const mergeRelations = (obj, relation) => {
					Object.keys(relation).forEach(key => {
						if (
							key !== 'action' &&
							key !== 'trigger' &&
							key !== 'uniqueID' &&
							key !== 'target'
						) {
							if (!obj[key]) obj[key] = [];
							obj[key].push(relation[key]);
						} else {
							obj[key] = relation[key];
						}
					});
					return obj;
				};

				const mergedSameRelations = sameRelations.reduce(
					mergeRelations,
					{}
				);
				uniqueArray.push(mergedSameRelations);
			}

			return uniqueArray;
		},
		[]
	);

	const createRelation = relation => new Relation(relation);
	uniqueRelations.forEach(createRelation);
}

initializeRelations();
