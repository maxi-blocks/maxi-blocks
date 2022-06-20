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
					(window.innerWidth < obj.breakpoint || !obj.breakpoint)
				) {
					stylesObj = {
						...stylesObj,
						...obj.styles,
					};

					effectsObj = {
						...effectsObj,
						...(effects[`transition-duration-${breakpoint}`] !==
							undefined && {
							'transition-duration':
								effects[`transition-duration-${breakpoint}`],
						}),
						...(effects[`transition-delay-${breakpoint}`] !==
							undefined && {
							'transition-delay':
								effects[`transition-delay-${breakpoint}`],
						}),
						...(effects[`easing-${breakpoint}`] !== undefined && {
							easing: effects[`easing-${breakpoint}`],
						}),
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

	const toggleInlineStyles = (stylesObj, element, remove = false) => {
		if (stylesObj.isTargets) {
			Object.entries(stylesObj).forEach(([target, styles]) => {
				if (target === 'isTargets') return;

				const targetEls = element.querySelectorAll(
					target.includes('>') ? `:scope ${target}` : target
				);

				targetEls.forEach(targetEl => {
					toggleInlineStyles(styles, targetEl, remove);
				});
			});
		} else {
			Object.entries(stylesObj).forEach(([key, value]) => {
				element.style[key] = !remove ? value : '';
			});
		}
	};

	const toggleTransition = (
		transitionString,
		element,
		remove = false,
		targets
	) => {
		if (targets) {
			targets.forEach(target => {
				const targetEls = element.querySelectorAll(
					target.includes('>') ? `:scope ${target}` : target
				);

				targetEls.forEach(targetEl => {
					toggleTransition(transitionString, targetEl, remove);
				});
			});
		} else {
			element.style.transition = !remove ? transitionString : '';
		}
	};

	console.log(maxiRelations[0]);
	maxiRelations[0]?.map(item => {
		if (!item?.uniqueID) return;

		const triggerEl = document.querySelector(`.${item.trigger}`);
		const targetEl = document.querySelector(
			`.${item.uniqueID} ${item.target ?? ''}`
		);

		const { stylesObj, effectsObj } = getCssResponsiveObj(
			item.css,
			item.effects
		);
		console.log(stylesObj, effectsObj);
		const transitionString = `all ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj['easing']}`;
		let timeout;

		const targets = stylesObj.isTargets ? Object.keys(stylesObj) : null;

		switch (item.action) {
			case 'hover': {
				triggerEl.addEventListener('mouseenter', () => {
					clearTimeout(timeout);
					toggleTransition(
						transitionString,
						targetEl,
						false,
						targets
					);

					toggleInlineStyles(stylesObj, targetEl);
				});

				triggerEl.addEventListener('mouseleave', () => {
					toggleInlineStyles(stylesObj, targetEl, true, targets);

					timeout = setTimeout(() => {
						// Removing transition after transition-duration + 1s to make sure it's done
						toggleTransition(
							transitionString,
							targetEl,
							true,
							targets
						);
					}, item.effects['transition-duration-general'] * 1000 + 1000);
				});
			}
			case 'click': {
				triggerEl.addEventListener('click', () => {
					toggleTransition(transitionString, targetEl);

					toggleInlineStyles(stylesObj, targetEl);
				});
			}
		}
	});
};

window.addEventListener('load', relations);
