/* eslint-disable class-methods-use-this */

// Relations (IB)
class Relation {
	constructor(item) {
		this.uniqueID = item?.uniqueID;
		this.css = item?.css;

		if (!this.uniqueID || this.css?.length === 0) return;

		this.trigger = item.trigger;
		this.triggerEl = document.querySelector(`.${this.trigger}`);
		this.blockTargetEl = document.querySelector(`#${this.uniqueID}`);
		this.target = item.target ?? '';
		this.fullTarget = `#${item.uniqueID} ${this.target}`;
		this.targetEl = document.querySelector(this.fullTarget);
		this.dataTarget = `#${item.uniqueID}[data-maxi-relations="true"]`;

		if (!this.triggerEl || !this.targetEl) return;

		this.action = item.action;
		this.effects = item.effects;

		this.stylesObj = null;
		this.effectsObj = null;
		this.generateCssResponsiveObj();

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
		this.transitionTargets.forEach(transitionTarget =>
			this.generateTransitions(transitionTarget)
		);
		this.stylesString = '';
		this.transitionTargets.forEach(transitionTarget =>
			this.generateStyles(transitionTarget)
		);

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

	/**
	 * Generates a clean CSS and Effect object to be used to generate styles
	 * and transition strings.
	 */
	generateCssResponsiveObj() {
		const getCssObjForEachTarget = (css, effects) => {
			let stylesObj = {};
			let effectsObj = {};

			Object.entries(css).forEach(([breakpoint, obj]) => {
				if (
					['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].includes(
						breakpoint
					) &&
					(window.innerWidth <= obj.breakpoint || !obj.breakpoint)
				) {
					stylesObj = {
						...stylesObj,
						...obj.styles,
					};

					const getLastEffectsBreakpointAttribute = target =>
						this.effects[`${target}-${breakpoint}`] !== undefined
							? {
									[target]:
										effects[`${target}-${breakpoint}`],
							  }
							: {};

					effectsObj = {
						...effectsObj,
						...getLastEffectsBreakpointAttribute(
							'transition-status'
						),
						...getLastEffectsBreakpointAttribute(
							'transition-duration'
						),
						...getLastEffectsBreakpointAttribute(
							'transition-delay'
						),
						...getLastEffectsBreakpointAttribute('easing'),
					};
				} else if (!obj.breakpoint) {
					const { stylesObj: rawStyles, effectsObj: rawEffects } =
						getCssObjForEachTarget(obj, effects);

					stylesObj = {
						...stylesObj,
						[breakpoint]: rawStyles,
						isTargets: true,
					};

					effectsObj = {
						...effectsObj,
						...rawEffects,
					};
				}
			});

			return { stylesObj, effectsObj };
		};

		const { stylesObj, effectsObj } = getCssObjForEachTarget(
			this.css,
			this.effects
		);

		this.stylesObj = stylesObj;
		this.effectsObj = effectsObj;
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

	addDataAttrToBlock() {
		this.blockTargetEl.setAttribute('data-maxi-relations', 'true');
	}

	removeAddAttrToBlock() {
		this.blockTargetEl.setAttribute('data-maxi-relations', 'false');
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

	generateStyles(transitionTarget) {
		const getStylesLine = (stylesObj, target) => {
			// Checks if the element needs special CSS to be avoided in case the element is hovered
			const avoidHoverString = this.avoidHover ? ':not(:hover)' : '';

			const selector = `body.maxi-blocks--active ${
				this.isSVG
					? target.replace(
							'maxi-svg-icon-block__icon',
							match => `${match}${avoidHoverString}`
					  )
					: `${target.trim()}${avoidHoverString}`
			} {`.replace(/\s{2,}/g, ' ');

			Object.entries(stylesObj).forEach(([key, value]) => {
				const selectorRegExp = new RegExp(
					`(${this.escapeRegExp(selector)})`
				);
				if (!this.stylesString.match(selectorRegExp))
					this.stylesString += `${selector}}`;

				this.stylesString = this.stylesString.replace(
					selectorRegExp,
					`$1 ${key}: ${value};`
				);
			});
		};

		if (this.stylesObj.isTargets)
			Object.entries(this.stylesObj).forEach(
				([targetSelector, styles]) =>
					targetSelector !== 'isTargets' &&
					Object.keys(styles).length &&
					getStylesLine(
						styles,
						`${this.dataTarget} ${targetSelector}`
					)
			);
		else
			getStylesLine(
				this.stylesObj,
				this.getTargetForLine(transitionTarget)
			);
	}

	addStyles() {
		this.addStyleEl(this.stylesEl);
	}

	removeStyles() {
		this.stylesEl.remove();
	}

	generateTransitions(transitionTarget) {
		const getLine = (stylesObj, target) => {
			const selector = `body.maxi-blocks--active ${target} {`.replace(
				/\s{2,}/g,
				' '
			);
			const transitionString = this.getTransitionString(
				stylesObj,
				this.effectsObj,
				this.isIcon
			);

			const selectorRegExp = new RegExp(
				`(${this.escapeRegExp(selector)})`
			);
			if (!this.transitionString.match(selectorRegExp))
				this.transitionString += `${selector}}`;

			const transitionExistsRegExp = new RegExp(
				`(${this.escapeRegExp(selector)}[^{]*transition:)`
			);
			if (!transitionString) return;

			if (this.transitionString.match(transitionExistsRegExp)) {
				!this.isIcon &&
					(this.transitionString = this.transitionString.replace(
						transitionExistsRegExp,
						`$1 ${transitionString}`
					));
			} else {
				this.transitionString = this.transitionString.replace(
					selectorRegExp,
					`$1 transition: ${transitionString.replace(/, $/, '')};`
				);
			}
		};

		if (this.stylesObj.isTargets) {
			if (!this.isSVG)
				Object.keys(this.stylesObj).forEach(targetSelector => {
					targetSelector !== 'isTargets' &&
						getLine(
							this.stylesObj[targetSelector],
							`${this.dataTarget} ${targetSelector}`
						);
				});
			else {
				// Checks if the element needs special CSS to be avoided in case the element is hovered
				const svgTarget = `${this.dataTarget} ${
					this.avoidHover
						? transitionTarget.replace(
								'maxi-svg-icon-block__icon',
								match => `${match}:not(:hover)`
						  )
						: transitionTarget
				}`;

				getLine(this.stylesObj, svgTarget);
			}
		} else getLine(this.stylesObj, this.getTargetForLine(transitionTarget));
	}

	addTransition() {
		this.addStyleEl(this.transitionEl);
	}

	removeTransition() {
		this.transitionEl.remove();
	}

	getTransitionString(styleObj, effectsObj, isIcon) {
		if (isIcon)
			return effectsObj['transition-status']
				? `all ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj.easing}`
				: 'all 0s 0s, ';
		return Object.keys(styleObj).reduce(
			(transitionString, style) =>
				effectsObj['transition-status']
					? `${transitionString}${style} ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj.easing}, `
					: `${transitionString}${style} 0s 0s, `,
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

	addClickEvents() {}
}

window.addEventListener('load', () => {
	// eslint-disable-next-line no-undef
	if (maxiRelations && maxiRelations[0]) {
		// eslint-disable-next-line no-undef
		maxiRelations[0].forEach(relation => new Relation(relation));
	}
});
