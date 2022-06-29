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

	const getTargetEls = (target, element) =>
		target !== ''
			? element.querySelectorAll(
					target.includes('>') ? `:scope ${target}` : target
			  )
			: [element];

	const applyStylesForTarget = (target, element, callback) => {
		if (target === 'isTargets') return;

		const targetEls = getTargetEls(target, element);

		targetEls.forEach(targetEl => {
			callback(targetEl);
		});
	};

	const toggleInlineStyles = (stylesObj, element, remove = false) => {
		if (stylesObj.isTargets) {
			Object.entries(stylesObj).forEach(([target, styles]) => {
				applyStylesForTarget(target, element, targetEl => {
					toggleInlineStyles(styles, targetEl, remove);
				});
			});
		} else {
			Object.entries(stylesObj).forEach(
				([key, value]) => (element.style[key] = !remove ? value : '')
			);
		}
	};

	const toggleTransition = (
		transitionString,
		element,
		stylesObj,
		remove = false
	) => {
		const targets = stylesObj?.isTargets ? Object.keys(stylesObj) : null;

		if (targets) {
			targets.forEach(target => {
				applyStylesForTarget(target, element, targetEl => {
					toggleTransition(transitionString, targetEl, null, remove);
				});
			});
		} else {
			element.style.transition = !remove ? transitionString : '';
		}
	};

	const getTransitionString = effectsObj =>
		effectsObj['transition-status']
			? `all ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj['easing']}`
			: 'all 0s 0s';

	maxiRelations[0]?.forEach(item => {
		if (!item?.uniqueID) return;

		const triggerEl = document.querySelector(`.${item.trigger}`);
		const targetEl = document.querySelector(
			`.${item.uniqueID} ${item.target ?? ''}`
		);

		let timeout;

		switch (item.action) {
			case 'hover': {
				triggerEl.addEventListener('mouseenter', () => {
					clearTimeout(timeout);

					const { stylesObj, effectsObj } = getCssResponsiveObj(
						item.css,
						item.effects
					);

					toggleTransition(
						getTransitionString(effectsObj),
						targetEl,
						stylesObj
					);

					toggleInlineStyles(stylesObj, targetEl);
				});

				triggerEl.addEventListener('mouseleave', () => {
					const { stylesObj, effectsObj } = getCssResponsiveObj(
						item.css,
						item.effects
					);

					toggleInlineStyles(stylesObj, targetEl, true);

					timeout = setTimeout(() => {
						// Removing transition after transition-duration + 1s to make sure it's done
						toggleTransition(
							getTransitionString(effectsObj),
							targetEl,
							stylesObj,
							true
						);
					}, item.effects['transition-duration-general'] * 1000 + 1000);
				});
			}
			case 'click': {
				triggerEl.addEventListener('click', () => {
					const { stylesObj, effectsObj } = getCssResponsiveObj(
						item.css,
						item.effects
					);

					toggleTransition(
						getTransitionString(effectsObj),
						targetEl,
						stylesObj
					);

					toggleInlineStyles(stylesObj, targetEl);
				});
			}
		}
	});
};

window.addEventListener('load', relations);
window.addEventListener('resize', relations);
