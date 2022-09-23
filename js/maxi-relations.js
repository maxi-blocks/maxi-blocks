/* eslint-disable no-console */
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

		this.transitionTrigger = this.effects.transitionTrigger;
		this.transitionTriggerEl = this.transitionTrigger
			? this.blockTargetEl.querySelector(this.transitionTrigger)
			: this.targetEl;
		this.transitionTarget =
			typeof this.effects.transitionTarget === 'string'
				? [this.effects.transitionTarget]
				: this.effects.transitionTarget;

		this.transitionString = '';
		this.generateTransitions();

		this.stylesString = '';
		this.generateStyles();

		this.stylesEl = null;
		this.transitionEl = null;
		this.generateStylesEls();

		this.isIcon =
			item.settings === 'Icon colour' || item.settings === 'Button icon';
		this.isNestedHoverTransition = false;
		this.isSVG = this.fullTarget.includes('svg-icon-maxi');

		// Prevents removing the IB transitions before they end when mouse leave the IB trigger
		this.transitionTimeout = null;
		// Prevents IB transitions overwrite native hover ones (when is contained) when mouse
		// leave the hover transition trigger
		this.contentTimeout = null;

		this.init();
	}

	/**
	 * Creates a single style wrapper element under the '#maxi-blocks-inline-css' to
	 * ensure it overwrites the default block styles. Also allows nesting more than one
	 * style element that can deal easier with more than one interaction coming from
	 * different triggers.
	 */
	generateStylesEls() {
		this.stylesEl = document.createElement('style');
		this.stylesEl.id = `relations--${this.uniqueID}-styles`;
		this.stylesEl.innerText = this.stylesString;

		this.transitionEl = document.createElement('style');
		this.transitionEl.id = `relations--${this.uniqueID}-transitions`;
		this.transitionEl.innerText = this.transitionString;
	}

	addStyleEl(styleEl) {
		const inlineStylesEl = document.querySelector(
			'#maxi-blocks-inline-css'
		);

		inlineStylesEl.parentNode.insertBefore(
			styleEl,
			inlineStylesEl.nextSibling
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

	getAvoidHover(transitionTarget) {
		if (!this.hoverStatus || !this.targetEl) return;

		const transitionTargets =
			typeof transitionTarget === 'string'
				? [transitionTarget]
				: transitionTarget;

		// eslint-disable-next-line consistent-return
		return !!Array.from(
			document.querySelectorAll(
				transitionTargets.map(currentTarget =>
					currentTarget === '' ? this.fullTarget : currentTarget
				)
			)
		).find(
			element =>
				this.targetEl.closest('.maxi-block').contains(element) &&
				this.targetEl.contains(element)
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

	generateStyles() {
		const getStylesLine = (stylesObj, target) => {
			// Checks if the element needs special CSS to be avoided in case the element is hovered
			const avoidHover = this.getAvoidHover(
				this.transitionTarget ? this.transitionTarget[0] : ''
			); // !!!

			const avoidHoverString = avoidHover ? ':not(:hover)' : '';

			const selector = `body.maxi-blocks--active ${
				this.isSVG
					? target.replace(
							'maxi-svg-icon-block__icon',
							match => `${match}${avoidHoverString}`
					  )
					: `${target}${avoidHoverString}`
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
				this.getTargetForLine(this.transitionTarget?.[0])
			);
	}

	addStyles() {
		this.addStyleEl(this.stylesEl);
	}

	removeStyles() {
		this.stylesEl.remove();
	}

	generateTransitions() {
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
				const avoidHover = this.getAvoidHover(this.transitionTarget[0]);

				const svgTarget = `${this.dataTarget} ${
					avoidHover
						? this.transitionTarget[0].replace(
								'maxi-svg-icon-block__icon',
								match => `${match}:not(:hover)`
						  )
						: this.transitionTarget[0]
				}`;

				getLine(this.stylesObj, svgTarget);
			}
		}

		getLine(
			this.stylesObj,
			this.getTargetForLine(this.transitionTarget?.[0])
		);
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
				console.log('Entering hover target');
				// Remove transitions to let the original ones be applied
				this.removeTransition();

				this.isNestedHoverTransition = true;
				clearTimeout(this.contentTimeout);
			});

			// const transitionDuration =
			// 	['transition-duration', 'transition-delay'].reduce(
			// 		(sum, prop) =>
			// 			sum +
			// 			parseFloat(
			// 				getComputedStyle()
			// 					.getPropertyValue(prop)
			// 					.replace('s', '')
			// 			),
			// 		0
			// 	) * 1000;

			const transitionDuration = 5000; // !!

			this.transitionTriggerEl.addEventListener('mouseleave', () => {
				console.log('Leaving hover target');
				this.contentTimeout = setTimeout(() => {
					// Set the transitions back waiting the original to be done
					this.addTransition();

					this.isNestedHoverTransition = false;
				}, transitionDuration);
			});
		}
	}

	onMouseEnter() {
		console.log('IB is active');
		clearTimeout(this.transitionTimeout);

		this.addDataAttrToBlock();
		!this.isNestedHoverTransition && this.addTransition();
		this.addStyles();
	}

	onMouseLeave() {
		console.log('IB is inactive');
		if (this.isContained) this.addTransition();
		// if (this.isContained && !this.isNestedHoverTransition)
		// 	this.addTransition();

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
// this.transitionTarget.forEach(rawTransitionTarget => {
// 	// This part is not really solid, but it works for now
// 	const transitionTarget = rawTransitionTarget?.endsWith('> *')
// 		? rawTransitionTarget.slice(0, -3)
// 		: rawTransitionTarget;

// 	let transitionTargetEls =
// 		transitionTarget &&
// 		Array.from(
// 			this.targetEl.querySelectorAll(transitionTarget)
// 		);

// 	if (transitionTargetEls.length > 1)
// 		transitionTargetEls = transitionTargetEls.filter(
// 			el => !transitionTargetEls.some(el2 => el2.contains(el))
// 		);

// 	if (transitionTargetEls?.length === 0)
// 		transitionTargetEls = [this.targetEl];

// 	transitionTargetEls.forEach(transitionTargetEl => {
// 		const transitionDuration =
// 			['transition-duration', 'transition-delay'].reduce(
// 				(sum, prop) =>
// 					sum +
// 					parseFloat(
// 						getComputedStyle(transitionTargetEl)
// 							.getPropertyValue(prop)
// 							.replace('s', '')
// 					),
// 				0
// 			) * 1000;

// 		transitionTargetEl.addEventListener('mouseenter', () => {
// 			console.log('Entering hover target');
// 			// Remove transitions to let the original ones be applied
// 			this.removeTransition();

// 			this.isNestedHoverTransition = true;
// 			clearTimeout(this.contentTimeout);
// 		});

// 		transitionTargetEl.addEventListener('mouseleave', () => {
// 			console.log('Leaving hover target');
// 			this.contentTimeout = setTimeout(() => {
// 				// Set the transitions back waiting the original to be done
// 				this.addTransition();

// 				this.isNestedHoverTransition = false;
// 			}, transitionDuration);
// 		});
// 	});
// });
