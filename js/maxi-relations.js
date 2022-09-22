/* eslint-disable class-methods-use-this */
// Relations

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const relations = () => {
	const getCssResponsiveObj = (css, effects) => {
		const getCssObjForEachTarget = (css, effects) => {
			let stylesObj = {};
			let effectsObj = {};

			Object.entries(css).forEach(([breakpoint, obj]) => {
				if (
					breakpoints.includes(breakpoint) &&
					(window.innerWidth <= obj.breakpoint || !obj.breakpoint)
				) {
					stylesObj = {
						...stylesObj,
						...obj.styles,
					};

					const getLastEffectsBreakpointAttribute = target =>
						effects[`${target}-${breakpoint}`] !== undefined
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

		const { stylesObj, effectsObj } = getCssObjForEachTarget(css, effects);

		return {
			stylesObj,
			effectsObj,
		};
	};

	const escapeRegExp = string => {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	};

	const getAvoidHover = (hoverStatus, targetEl, target, transitionTarget) => {
		if (
			!hoverStatus ||
			!targetEl ||
			(!transitionTarget?.length && transitionTarget !== '')
		)
			return;

		const transitionTargets =
			typeof transitionTarget === 'string'
				? [transitionTarget]
				: transitionTarget;

		return !!Array.from(
			document.querySelectorAll(
				transitionTargets.map(currentTarget =>
					currentTarget === '' ? target : currentTarget
				)
			)
		).find(
			element =>
				targetEl.closest('.maxi-block').contains(element) &&
				targetEl.contains(element)
		);
	};

	const toggleInlineStyles = ({
		stylesObj,
		target,
		remove = false,
		hoverStatus,
		transitionTarget,
	}) => {
		if (stylesObj.isTargets) {
			Object.entries(stylesObj).forEach(([targetSelector, styles]) => {
				targetSelector !== 'isTargets' &&
					toggleInlineStyles({
						stylesObj: styles,
						target: `${target}${
							targetSelector !== '' ? ` ${targetSelector}` : ''
						}`,
						remove,
						hoverStatus,
						transitionTarget,
					});
			});
		} else {
			const interactionStyle = document.querySelector(
				'#maxi-blocks-interaction-css'
			);

			const targetEl = document.querySelector(target);

			// Checks if the element needs special CSS to be avoided in case the element is hovered
			const avoidHover = getAvoidHover(
				hoverStatus,
				targetEl,
				target,
				transitionTarget
			);

			const isSVG = target.includes('svg-icon-maxi');
			const avoidHoverString = avoidHover ? ':not(:hover)' : '';

			const selector = `body.maxi-blocks--active ${
				isSVG
					? target.replace(
							'maxi-svg-icon-block__icon',
							match => `${match}${avoidHoverString}`
					  )
					: `${target}${avoidHoverString}`
			} {`.replace(/\s{2,}/g, ' ');

			Object.entries(stylesObj).forEach(([key, value]) => {
				if (remove) {
					const styleRegExp = new RegExp(
						`(${escapeRegExp(
							selector.replace(
								'data-maxi-relations="false"',
								'data-maxi-relations="true"'
							)
						)}.*?) ${key}:.*?;`
					);

					interactionStyle.textContent =
						interactionStyle.textContent.replace(styleRegExp, '$1');
				} else {
					const selectorRegExp = new RegExp(
						`(${escapeRegExp(selector)})`
					);
					if (!interactionStyle.textContent.match(selectorRegExp))
						interactionStyle.textContent += `${selector}}`;

					interactionStyle.textContent =
						interactionStyle.textContent.replace(
							selectorRegExp,
							`$1 ${key}: ${value};`
						);
				}
			});
		}
	};

	const toggleTransition = ({
		target,
		stylesObj,
		transitionTarget,
		effectsObj,
		isIcon = false,
		remove = false,
		hoverStatus = false,
	}) => {
		const isSVG = target.includes('svg-icon-maxi');
		const targets = stylesObj?.isTargets ? Object.keys(stylesObj) : null;

		if (targets) {
			if (!isSVG)
				targets.forEach(targetSelector => {
					targetSelector !== 'isTargets' &&
						toggleTransition({
							target: `${target} ${targetSelector}`,
							stylesObj: stylesObj[targetSelector],
							transitionTarget,
							effectsObj,
							isIcon,
							remove,
							hoverStatus,
						});
				});
			else {
				const targetEl = document.querySelector(target);

				// Checks if the element needs special CSS to be avoided in case the element is hovered
				const avoidHover = getAvoidHover(
					hoverStatus,
					targetEl,
					target,
					transitionTarget
				);
				const avoidHoverString = avoidHover ? ':not(:hover)' : '';

				const transitionTargets =
					typeof transitionTarget === 'string'
						? [transitionTarget]
						: transitionTarget;

				transitionTargets?.forEach(currentTransitionTarget => {
					const svgTarget = `${target} ${currentTransitionTarget.replace(
						'maxi-svg-icon-block__icon',
						match => `${match}${avoidHoverString}`
					)}`;

					toggleTransition({
						target: svgTarget,
						transitionTarget: currentTransitionTarget,
						effectsObj,
						isIcon: isIcon || isSVG,
						remove,
						hoverStatus,
					});
				});
			}
		} else {
			const interactionStyle = document.querySelector(
				'#maxi-blocks-interaction-css'
			);
			const selector = `body.maxi-blocks--active ${target} {`.replace(
				/\s{2,}/g,
				' '
			);
			const transitionString = getTransitionString(
				stylesObj,
				effectsObj,
				isIcon
			);

			if (remove) {
				const styleRegExp = new RegExp(
					`(${escapeRegExp(selector)}.*?) transition:.*?;`
				);
				interactionStyle.textContent =
					interactionStyle.textContent.replace(styleRegExp, '$1');
			} else {
				const selectorRegExp = new RegExp(
					`(${escapeRegExp(selector)})`
				);
				if (!interactionStyle.textContent.match(selectorRegExp))
					interactionStyle.textContent += `${selector}}`;

				const transitionExistsRegExp = new RegExp(
					`(${escapeRegExp(selector)}[^{]*transition:)`
				);
				if (!transitionString) return;

				if (
					interactionStyle.textContent.match(transitionExistsRegExp)
				) {
					!isIcon &&
						(interactionStyle.textContent =
							interactionStyle.textContent.replace(
								transitionExistsRegExp,
								`$1 ${transitionString}`
							));
				} else {
					interactionStyle.textContent =
						interactionStyle.textContent.replace(
							selectorRegExp,
							`$1 transition: ${transitionString.replace(
								/, $/,
								''
							)};`
						);
				}
			}
		}
	};

	const getTransitionString = (styleObj, effectsObj, isIcon) => {
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
	};

	maxiRelations[0]?.forEach(item => {
		if (!item?.uniqueID || item?.css?.length === 0) return;

		const triggerEl = document.querySelector(`.${item.trigger}`);
		const target = `#${item.uniqueID} ${item.target ?? ''}`;
		const targetEl = document.querySelector(target);

		if (!triggerEl || !targetEl) return;

		let timeout;
		let contentTimeout;
		let dataTimeout;

		let isNestedHoverTransition = false;

		switch (item.action) {
			case 'hover':
				{
					triggerEl.addEventListener('mouseenter', () => {
						clearTimeout(timeout);
						clearTimeout(dataTimeout);

						targetEl.setAttribute('data-maxi-relations', 'true');

						const { stylesObj, effectsObj } = getCssResponsiveObj(
							item.css,
							item.effects
						);

						const { hoverStatus, transitionTarget } = item.effects;

						/**
						 * In case the target element is nested inside the trigger element, we need to ensure the original hover transition
						 * works correctly on hovering. It means, we need to remove the transitions added by the trigger when hovering the target
						 * to ensure it has the selected effects
						 */
						if (hoverStatus && triggerEl.contains(targetEl)) {
							const transitionTargets =
								typeof transitionTarget === 'string'
									? [transitionTarget]
									: transitionTarget;

							transitionTargets.forEach(rawTransitionTarget => {
								// This part is not really solid, but it works for now
								const transitionTarget =
									rawTransitionTarget?.endsWith('> *')
										? rawTransitionTarget.slice(0, -3)
										: rawTransitionTarget;

								let transitionTargetEls =
									transitionTarget &&
									targetEl.querySelectorAll(transitionTarget);

								if (transitionTargetEls?.length === 0)
									transitionTargetEls = [targetEl];

								Array.from(transitionTargetEls).forEach(
									transitionTargetEl => {
										transitionTargetEl.addEventListener(
											'mouseenter',
											() => {
												isNestedHoverTransition = true;
												clearTimeout(contentTimeout);

												// Remove transitions to let the original ones be applied
												toggleTransition({
													target: `${target.trim()}[data-maxi-relations="true"]`,
													stylesObj,
													transitionTarget,
													effectsObj,
													remove: true,
													hoverStatus,
												});
											}
										);

										transitionTargetEl.addEventListener(
											'mouseleave',
											() => {
												const transitionDuration =
													[
														'transition-duration',
														'transition-delay',
													].reduce(
														(sum, prop) =>
															sum +
															parseFloat(
																getComputedStyle(
																	transitionTargetEl
																)
																	.getPropertyValue(
																		prop
																	)
																	.replace(
																		's',
																		''
																	)
															),
														0
													) * 1000;

												contentTimeout = setTimeout(
													() => {
														// Set the transitions back waiting the original to be done
														toggleTransition({
															target: `${target.trim()}[data-maxi-relations="true"]`,
															stylesObj,
															transitionTarget,
															effectsObj,
															isIcon:
																item.settings ===
																	'Icon colour' ||
																item.settings ===
																	'Button icon',
															hoverStatus,
														});
														isNestedHoverTransition = false;
													},
													transitionDuration
												);
											}
										);
									}
								);
							});
						}

						!isNestedHoverTransition &&
							toggleTransition({
								target: `${target.trim()}[data-maxi-relations="true"]`,
								stylesObj,
								transitionTarget,
								effectsObj,
								isIcon:
									item.settings === 'Icon colour' ||
									item.settings === 'Button icon',
								hoverStatus,
							});

						toggleInlineStyles({
							stylesObj,
							target: `${target.trim()}[data-maxi-relations="true"]`,
							hoverStatus,
							transitionTarget,
						});
					});

					triggerEl.addEventListener('mouseleave', () => {
						const { stylesObj, effectsObj } = getCssResponsiveObj(
							item.css,
							item.effects
						);
						const { hoverStatus, transitionTarget } = item.effects;

						if (
							triggerEl.contains(targetEl) &&
							!isNestedHoverTransition
						)
							toggleTransition({
								target: `${target.trim()}[data-maxi-relations="true"]`,
								stylesObj,
								transitionTarget,
								effectsObj,
								isIcon:
									item.settings === 'Icon colour' ||
									item.settings === 'Button icon',
								hoverStatus,
							});

						dataTimeout = setTimeout(() => {
							targetEl.setAttribute(
								'data-maxi-relations',
								'false'
							);
						}, item.effects['transition-duration-general'] * 1000 + 1000);

						toggleInlineStyles({
							stylesObj,
							target: `${target.trim()}[data-maxi-relations="true"]`,
							remove: true,
							hoverStatus,
							transitionTarget,
						});

						timeout = setTimeout(() => {
							// Removing transition after transition-duration + 1s to make sure it's done
							toggleTransition({
								target: `${target.trim()}[data-maxi-relations="true"]`,
								stylesObj,
								transitionTarget,
								effectsObj,
								remove: true,
								hoverStatus,
							});
						}, item.effects['transition-duration-general'] * 1000 + 1000);
					});
				}
				break;
			case 'click':
				{
					triggerEl.addEventListener('click', () => {
						targetEl.setAttribute('data-maxi-relations', 'true');

						const { stylesObj, effectsObj } = getCssResponsiveObj(
							item.css,
							item.effects
						);

						toggleTransition({
							target,
							stylesObj,
							effectsObj,
							isIcon:
								item.settings === 'Icon colour' ||
								item.settings === 'Button icon',
						});

						const { hoverStatus, transitionTarget } = item.effects;

						toggleInlineStyles({
							stylesObj,
							target: `${target.trim()}[data-maxi-relations="true"]`,
							hoverStatus,
							transitionTarget,
						});
					});
				}
				break;
		}
	});
};

class Relation {
	constructor(item) {
		this.uniqueID = item?.uniqueID;
		this.css = item?.css;

		if (!this.uniqueID || this.css?.length === 0) return;

		this.trigger = item.trigger;
		this.triggerEl = document.querySelector(`.${this.trigger}`);
		this.target = `#${item.uniqueID} ${item.target ?? ''}`;
		this.targetEl = document.querySelector(this.target);

		if (!this.triggerEl || !this.targetEl) return;

		this.action = item.action;
		this.effects = item.effects;

		this.stylesObj;
		this.effectsObj;
		this.generateCssResponsiveObj(this.css, this.effects);

		this.stylesString = '';
		this.generateStyles();

		this.transitionString = '';
		this.generateTransitions();

		this.stylesWrapperEl;
		this.stylesEl;
		this.generateStylesEls();

		this.hoverStatus = this.effects.hoverStatus;
		this.transitionTarget =
			typeof this.effects.transitionTarget === 'string'
				? [this.effects.transitionTarget]
				: this.effects.transitionTarget;
		this.isContained =
			this.hoverStatus && this.triggerEl.contains(this.targetEl);

		this.isIcon =
			item.settings === 'Icon colour' || item.settings === 'Button icon';
		this.timeout;
		this.contentTimeout;
		this.dataTimeout;

		this.isNestedHoverTransition = false;
		this.isSVG = this.target.includes('svg-icon-maxi');

		this.init();
	}

	// Nests the styles of each target el, that way is easier to deal with multiple
	// relations targeting same element
	generateStylesEls() {
		if (!this.stylesWrapperEl || !this.stylesEl)
			if (document.querySelector(`#relations--${this.uniqueID}`)) {
				this.stylesWrapperEl = document.querySelector(
					`#relations--${this.uniqueID}`
				);
				this.stylesEl = this.stylesWrapperEl.querySelector('styles');
			} else {
				this.stylesWrapperEl = document.createElement('div');
				this.stylesWrapperEl.id = `relations--${this.uniqueID}`;

				this.stylesEl = document.createElement('style');

				this.stylesWrapperEl.append(this.stylesEl);

				const inlineStylesEl = document.querySelector(
					'#maxi-blocks-inline-css'
				);

				inlineStylesEl.parentNode.insertBefore(
					this.stylesWrapperEl,
					inlineStylesEl.nextSibling
				);
			}
	}

	generateCssResponsiveObj(css, effects) {
		const getCssObjForEachTarget = (css, effects) => {
			let stylesObj = {};
			let effectsObj = {};

			Object.entries(css).forEach(([breakpoint, obj]) => {
				if (
					breakpoints.includes(breakpoint) &&
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

		const { stylesObj, effectsObj } = getCssObjForEachTarget(css, effects);

		this.stylesObj = stylesObj;
		this.effectsObj = effectsObj;
	}

	escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	getAvoidHover(transitionTarget) {
		return (
			this.hoverStatus &&
			this.targetEl &&
			this.targetEl.contains(
				this.targetEl
					.closest('.maxi-block')
					.querySelector(transitionTarget)
			)
		);
	}

	generateStyles(transitionTarget) {
		const stylesTarget = `${this.target.trim()}[data-maxi-relations="true"]`;

		const getStylesLine = (stylesObj, target) => {
			// Checks if the element needs special CSS to be avoided in case the element is hovered
			const avoidHover = this.getAvoidHover(transitionTarget);

			const avoidHoverString = avoidHover ? ':not(:hover)' : '';

			const selector = `body.maxi-blocks--active ${
				this.isSVG
					? target.replace(
							'maxi-svg-icon-block__icon',
							match => `${match}${avoidHoverString}`
					  )
					: `${this.target}${avoidHoverString}`
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
			this.stylesObj.forEach(
				([targetSelector, styles]) =>
					targetSelector !== 'isTargets' &&
					getStylesLine(styles, `${stylesTarget} ${targetSelector}`)
			);
		else getStylesLine(this.stylesObj, stylesTarget);
	}

	addStyles() {
		this.stylesEl.innerText += this.stylesString;
	}

	removeStyles() {
		this.stylesEl.innerText = this.stylesEl.innerText.replace(
			this.stylesString,
			''
		);
	}

	generateTransitions() {
		const transitionTarget = `${this.target.trim()}[data-maxi-relations="true"]`;

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
							`${transitionTarget} ${targetSelector}`
						);
				});
			else {
				// Checks if the element needs special CSS to be avoided in case the element is hovered
				const avoidHover = this.getAvoidHover(this.transitionTarget[0]);

				const svgTarget = `${transitionTarget} ${
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

		getLine(this.stylesObj, transitionTarget);
	}

	addTransition() {
		this.stylesEl.innerText += this.transitionString;
	}

	removeTransition() {
		this.stylesEl.innerText = this.stylesEl.innerText.replace(
			this.transitionString,
			''
		);
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
	}

	onMouseEnter() {
		clearTimeout(this.timeout);
		clearTimeout(this.dataTimeout);

		this.targetEl.setAttribute('data-maxi-relations', 'true');

		/**
		 * In case the target element is nested inside the trigger element, we need to ensure the original hover transition
		 * works correctly on hovering. It means, we need to remove the transitions added by the trigger when hovering the target
		 * to ensure it has the selected effects
		 */
		if (this.isContained) {
			this.transitionTarget.forEach(rawTransitionTarget => {
				// This part is not really solid, but it works for now
				const transitionTarget = rawTransitionTarget?.endsWith('> *')
					? rawTransitionTarget.slice(0, -3)
					: rawTransitionTarget;

				let transitionTargetEls =
					transitionTarget &&
					Array.from(
						this.targetEl.querySelectorAll(transitionTarget)
					);

				if (transitionTargetEls?.length === 0)
					transitionTargetEls = [this.targetEl];

				transitionTargetEls.forEach(transitionTargetEl => {
					const transitionDuration =
						parseFloat(
							getComputedStyle(transitionTargetEl)
								.getPropertyValue('transition-duration')
								.replace('s', '')
						) * 1000;

					transitionTargetEl.addEventListener('mouseenter', () => {
						this.isNestedHoverTransition = true;
						clearTimeout(this.contentTimeout);

						// Remove transitions to let the original ones be applied
						this.removeTransition();
					});

					transitionTargetEl.addEventListener('mouseleave', () => {
						this.contentTimeout = setTimeout(() => {
							// Set the transitions back waiting the original to be done
							this.addTransition();

							this.isNestedHoverTransition = false;
						}, transitionDuration);
					});
				});
			});
		}
		!this.isNestedHoverTransition && this.addTransition();

		this.addStyles();
	}

	onMouseLeave() {
		if (this.isContained && !this.isNestedHoverTransition)
			this.addTransition();

		this.dataTimeout = setTimeout(() => {
			this.targetEl.setAttribute('data-maxi-relations', 'false');
		}, this.effects['transition-duration-general'] * 1000 + 1000);

		this.removeStyles();

		this.timeout = setTimeout(() => {
			// Removing transition after transition-duration + 1s to make sure it's done
			this.removeTransition();
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

// window.addEventListener('load', relations);
// window.addEventListener('load', () => {
// 	if (maxiRelations[0].length) {
// 		if (!document.querySelector('#maxi-blocks-interaction-css')) {
// 			const inlineStyle = document.querySelector(
// 				'#maxi-blocks-inline-css'
// 			);
// 			if (inlineStyle) {
// 				const interactionStyle = document.createElement('style');
// 				interactionStyle.id = 'maxi-blocks-interaction-css';
// 				inlineStyle.parentNode.insertBefore(
// 					interactionStyle,
// 					inlineStyle.nextSibling
// 				);
// 			}
// 		}
// 	}
// });
