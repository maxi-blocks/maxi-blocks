/* eslint-disable class-methods-use-this */

// Relations (IB)
class Relation {
	constructor(item) {
		this.uniqueID = item?.uniqueID;
		this.css = item?.css;

		if (!this.uniqueID || Object.keys(this.css).length === 0) return;

		this.trigger = item.trigger;
		this.triggerEl = document.querySelector(`.${this.trigger}`);
		this.blockTargetEl = document.querySelector(`#${this.uniqueID}`);
		this.target = item.target ?? '';
		this.fullTarget = `#${item.uniqueID} ${this.target}`;
		this.targetEl = document.querySelector(this.fullTarget);
		this.dataTarget = `#${item.uniqueID}[data-maxi-relations="true"]`;

		if (!this.triggerEl || !this.targetEl) return;

		this.breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		this.hasMultipleTargets = Object.keys(this.css).some(
			key => !this.breakpoints.includes(key)
		);

		this.action = item.action;
		this.effects = item.effects;

		({ stylesObj: this.stylesObj, effectsObj: this.effectsObj } =
			this.generateCssResponsiveObj());

		this.breakpointsObj = this.generateBreakpointsObj();

		this.hoverStatus = this.effects.hoverStatus;
		this.isContained = this.triggerEl.contains(this.targetEl);
		this.isHoveredContained = this.hoverStatus && this.isContained;

		// transitionTrigger is an alternative trigger to target; not always used
		// Check its eventListeners to understand better about its responsibility
		this.transitionTrigger = this.effects.transitionTrigger;
		this.transitionTriggerEl = this.transitionTrigger
			? this.blockTargetEl.querySelector(this.transitionTrigger)
			: this.targetEl;

		switch (typeof this.effects.transitionTarget) {
			case 'string':
				this.transitionTargets = [this.effects.transitionTarget];
				break;
			case 'object':
				this.transitionTargets = this.effects.transitionTarget;
				break;
			default:
				this.transitionTargets = [''];
		}

		this.isIcon =
			item.settings === 'Icon colour' || item.settings === 'Button icon';
		this.isSVG = this.fullTarget.includes('svg-icon-maxi');
		this.avoidHover = null;
		this.getAvoidHover();

		this.transitionString = '';
		this.generateTransitions();

		this.stylesString = '';
		this.generateStyles();

		this.stylesEl = null;
		this.transitionEl = null;
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
		this.stylesEl.innerText = this.stylesString;

		this.transitionEl = document.createElement('style');
		this.transitionEl.id = `relations--${this.uniqueID}-transitions`;
		this.transitionEl.innerText = this.transitionString;
	}

	// Insert transitions or styles element just after Maxi inline css element
	addStyleEl(styleEl) {
		if (!this.inlineStylesEl)
			this.inlineStylesEl = document.querySelector(
				'#maxi-blocks-inline-css'
			);

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
				currentBreakpoint
			) => {
				const lastBreakpoint = this.getLastUsableBreakpoint(
					currentBreakpoint,
					breakpoint =>
						Object.prototype.hasOwnProperty.call(
							effects,
							`${target}-${breakpoint}`
						)
				);

				return {
					[target]:
						effects[`${target}-${lastBreakpoint ?? 'general'}`],
				};
			};

			this.breakpoints.forEach(breakpoint => {
				const hasCSS = Object.prototype.hasOwnProperty.call(
					css,
					breakpoint
				);

				if (hasCSS)
					stylesObj[breakpoint] = { ...css[breakpoint].styles };

				effectsObj[breakpoint] = {
					...getLastEffectsBreakpointAttribute(
						'transition-status',
						breakpoint
					),
					...getLastEffectsBreakpointAttribute(
						'transition-duration',
						breakpoint
					),
					...getLastEffectsBreakpointAttribute(
						'transition-delay',
						breakpoint
					),
					...getLastEffectsBreakpointAttribute('easing', breakpoint),
				};
			});

			return { stylesObj, effectsObj };
		};

		const cleanValues = obj => {
			const response = { ...obj };

			// Clean values
			Object.entries(response).forEach(([key, value]) => {
				[this.breakpoints]
					.reverse()
					.reduce((prevBreakpoint, breakpoint) => {
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

		if (this.hasMultipleTargets) {
			const stylesObj = {};
			// effectsObj is the same for all targets
			let effectsObj = {};

			Object.keys(this.css).forEach(target => {
				const { stylesObj: rawStylesObj, effectsObj: rawEffects } =
					cleanValues(
						getCssObjForEachTarget(this.css[target], this.effects)
					);

				stylesObj[target] = rawStylesObj;
				effectsObj = rawEffects;
			});

			return { stylesObj, effectsObj };
		}

		return cleanValues(getCssObjForEachTarget(this.css, this.effects));
	}

	generateBreakpointsObj() {
		const breakpointsObj = {};

		const getBreakpointValues = css => {
			this.breakpoints.forEach(breakpoint => {
				if (
					Object.prototype.hasOwnProperty.call(css, breakpoint) &&
					(breakpoint !== 'xxl' ||
						Object.prototype.hasOwnProperty.call(css, 'xl'))
				) {
					let { breakpoint: breakpointValue } = css[breakpoint];

					breakpointValue =
						breakpoint === 'general' ? '' : breakpointValue;
					breakpointValue =
						breakpoint === 'xxl'
							? css.xl.breakpoint
							: breakpointValue;

					breakpointsObj[breakpoint] = breakpointValue;
				}
			});
		};

		if (this.hasMultipleTargets) {
			Object.keys(this.css).forEach(target => {
				getBreakpointValues(this.css[target]);
			});
		} else getBreakpointValues(this.css);

		return breakpointsObj;
	}

	escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	getAvoidHover() {
		if (!this.hoverStatus || !this.targetEl) return;

		this.avoidHover = this.transitionTargets.some(transitionTarget =>
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
					this.targetEl.closest('.maxi-block').contains(element) &&
					this.targetEl.contains(element)
			)
		);
	}

	setDataAttrToBlock(value) {
		this.blockTargetEl.setAttribute('data-maxi-relations', value);
	}

	addDataAttrToBlock() {
		this.setDataAttrToBlock('true');
	}

	removeAddAttrToBlock() {
		this.setDataAttrToBlock('false');
	}

	// Target for the creation of styles and transition lines needs to be considered
	// as it can create higher specificity than the default block styles.
	getTargetForLine(transitionTarget) {
		if (transitionTarget)
			if (!this.dataTarget.includes(transitionTarget))
				return `${this.dataTarget} ${transitionTarget}`;
			else return this.dataTarget;

		return `${this.dataTarget} ${this.target}`;
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
		const getStylesLine = (stylesObj, target) => {
			Object.entries(this.breakpointsObj).forEach(
				([breakpoint, breakpointValue]) => {
					if (stylesObj[breakpoint]) {
						// Checks if the element needs special CSS to be avoided in case the element is hovered
						const avoidHoverString = this.avoidHover
							? ':not(:hover)'
							: '';

						const { prevLine, postLine } = this.getMediaLines(
							breakpoint,
							breakpointValue
						);

						const selector =
							`${prevLine} body.maxi-blocks--active ${
								this.isSVG
									? target.replace(
											'maxi-svg-icon-block__icon',
											match =>
												`${match}${avoidHoverString}`
									  )
									: `${target.trim()}${avoidHoverString}`
							} {`.replace(/\s{2,}/g, ' ');

						Object.entries(stylesObj[breakpoint]).forEach(
							([key, value]) => {
								const selectorRegExp = new RegExp(
									`(${this.escapeRegExp(selector)})`
								);
								if (!this.stylesString.match(selectorRegExp))
									this.stylesString += `${selector}}${postLine}`;

								this.stylesString = this.stylesString.replace(
									selectorRegExp,
									`$1 ${key}: ${value};`
								);
							}
						);
					}
				}
			);
		};

		if (this.hasMultipleTargets)
			Object.entries(this.stylesObj).forEach(
				([targetSelector, styles]) =>
					Object.keys(styles).length &&
					getStylesLine(
						styles,
						`${this.dataTarget} ${targetSelector}`
					)
			);
		else
			this.transitionTargets.forEach(transitionTarget =>
				getStylesLine(
					this.stylesObj,
					this.getTargetForLine(transitionTarget)
				)
			);
	}

	addStyles() {
		this.addStyleEl(this.stylesEl);
	}

	removeStyles() {
		this.stylesEl.remove();
	}

	generateTransitions() {
		const getTransitionLine = (stylesObj, target) => {
			Object.entries(this.breakpointsObj).forEach(
				([breakpoint, breakpointValue]) => {
					if (this.effectsObj[breakpoint]) {
						const { prevLine, postLine } = this.getMediaLines(
							breakpoint,
							breakpointValue
						);

						const selector =
							`${prevLine}body.maxi-blocks--active ${target} {`.replace(
								/\s{2,}/g,
								' '
							);

						const currentStyleObj =
							stylesObj[
								this.getLastUsableBreakpoint(
									breakpoint,
									breakpoint =>
										stylesObj?.[breakpoint] &&
										Object.keys(stylesObj?.[breakpoint])
											.length
								)
							];

						if (currentStyleObj) {
							const transitionString = this.getTransitionString(
								currentStyleObj,
								this.effectsObj[breakpoint],
								this.isIcon
							);

							const selectorRegExp = new RegExp(
								`(${this.escapeRegExp(selector)})`
							);
							if (!this.transitionString.match(selectorRegExp))
								this.transitionString += `${selector}}${postLine}`;

							const transitionExistsRegExp = new RegExp(
								`(${this.escapeRegExp(
									selector
								)}[^{]*transition:)`
							);
							if (!transitionString) return;

							if (
								this.transitionString.match(
									transitionExistsRegExp
								)
							) {
								if (!this.isIcon)
									this.transitionString =
										this.transitionString.replace(
											transitionExistsRegExp,
											`$1 ${transitionString}`
										);
							} else {
								this.transitionString =
									this.transitionString.replace(
										selectorRegExp,
										`$1 transition: ${transitionString.replace(
											/, $/,
											''
										)};`
									);
							}
						}
					}
				}
			);
		};

		if (this.hasMultipleTargets) {
			if (!this.isSVG)
				Object.keys(this.stylesObj).forEach(targetSelector => {
					getTransitionLine(
						this.stylesObj[targetSelector],
						`${this.dataTarget} ${targetSelector}`
					);
				});
			else
				this.transitionTargets.forEach(transitionTarget => {
					// Checks if the element needs special CSS to be avoided in case the element is hovered
					const svgTarget = `${this.dataTarget} ${
						this.avoidHover
							? transitionTarget.replace(
									'maxi-svg-icon-block__icon',
									match => `${match}:not(:hover)`
							  )
							: transitionTarget
					}`;

					Object.keys(this.stylesObj).forEach(targetSelector =>
						getTransitionLine(
							this.stylesObj[targetSelector],
							svgTarget
						)
					);
				});
		} else
			this.transitionTargets.forEach(transitionTarget =>
				getTransitionLine(
					this.stylesObj,
					this.getTargetForLine(transitionTarget)
				)
			);
	}

	addTransition() {
		this.addStyleEl(this.transitionEl);
	}

	removeTransition() {
		this.transitionEl.remove();
	}

	getTransitionString(styleObj, effectsObj, isIcon) {
		const {
			'transition-status': status,
			'transition-duration': duration,
			'transition-delay': delay,
			easing,
		} = effectsObj;

		const transitionPropertiesString = `${
			status ? `${duration}s ${delay}s ${easing}` : '0s 0s'
		}, `;

		return isIcon
			? `all ${transitionPropertiesString}`
			: Object.keys(styleObj).reduce(
					(transitionString, style) =>
						`${transitionString}${style} ${transitionPropertiesString}`,
					''
			  );
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
			this.transitionTriggerEl.addEventListener('mouseenter', () => {
				// console.log('Entering hover target'); // 🔥

				// Remove transitions to let the original ones be applied
				this.removeTransition();

				this.isNestedHoverTransition = true;
				clearTimeout(this.contentTimeout);
			});

			this.transitionTriggerEl.addEventListener('mouseleave', () => {
				const transitionDuration = this.transitionTargets.reduce(
					(promise, transitionTarget) => {
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
											getComputedStyle(transitionTargetEl)
												.getPropertyValue(prop)
												.replace('s', '')
										),
									0
							  ) * 1000
							: 0;

						return Math.max(promise, transitionDuration);
					},
					0
				);

				// console.log('Leaving hover target'); // 🔥

				this.contentTimeout = setTimeout(() => {
					// Set the transitions back waiting the original to be done
					this.addTransition();
				}, transitionDuration);
			});
		}
	}

	onMouseEnter() {
		// console.log('IB is active'); // 🔥
		clearTimeout(this.transitionTimeout);

		this.addDataAttrToBlock();
		this.addTransition();
		this.addStyles();
	}

	onMouseLeave() {
		// console.log('IB is inactive'); // 🔥
		if (this.isContained) this.addTransition();

		this.removeStyles();

		this.transitionTimeout = setTimeout(() => {
			// Removing transition after transition-duration + 1s to make sure it's done
			this.removeTransition();
			this.removeAddAttrToBlock();
		}, this.effects['transition-duration-general'] * 1000 + 1000);
	}

	addClickEvents() {
		this.triggerEl.addEventListener('click', this.onMouseClick.bind(this));
	}

	onMouseClick() {
		this.addDataAttrToBlock();
		this.addTransition();
		this.addStyles();
	}
}

window.addEventListener('load', () => {
	// eslint-disable-next-line no-undef
	if (maxiRelations && maxiRelations[0]) {
		// eslint-disable-next-line no-undef
		maxiRelations[0].forEach(relation => new Relation(relation));
	}
});
