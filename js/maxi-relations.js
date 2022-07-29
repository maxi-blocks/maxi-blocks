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

	const toggleInlineStyles = (stylesObj, target, remove = false) => {
		if (stylesObj.isTargets) {
			Object.entries(stylesObj).forEach(([targetSelector, styles]) => {
				targetSelector !== 'isTargets' &&
					toggleInlineStyles(
						styles,
						`${target} ${targetSelector}`,
						remove
					);
			});
		} else {
			const interactionStyle = document.querySelector(
				'#maxi-blocks-interaction-css'
			);
			const selector = `body.maxi-blocks--active ${target} {`.replace(
				/\s{2,}/g,
				' '
			);

			Object.entries(stylesObj).forEach(([key, value]) => {
				if (remove) {
					const styleRegExp = new RegExp(
						`(${selector}.*?) ${key}:.*?;`
					);

					interactionStyle.textContent =
						interactionStyle.textContent.replace(styleRegExp, '$1');
				} else {
					const selectorRegExp = new RegExp(`(${selector})`);
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

	const toggleTransition = (
		transitionString,
		target,
		stylesObj,
		remove = false
	) => {
		const targets = stylesObj?.isTargets ? Object.keys(stylesObj) : null;

		if (targets) {
			targets.forEach(targetSelector => {
				targetSelector !== 'isTargets' &&
					toggleTransition(
						transitionString,
						`${target} ${targetSelector}`,
						null,
						remove
					);
			});
		} else {
			const interactionStyle = document.querySelector(
				'#maxi-blocks-interaction-css'
			);

			const selector = `body.maxi-blocks--active ${target} {`.replace(
				/\s{2,}/g,
				' '
			);
			if (remove) {
				const styleRegExp = new RegExp(
					`(${selector}.*?) transition:.*?;`
				);
				interactionStyle.textContent =
					interactionStyle.textContent.replace(styleRegExp, '$1');
			} else {
				const selectorRegExp = new RegExp(`(${selector})`);
				if (!interactionStyle.textContent.match(selectorRegExp))
					interactionStyle.textContent += `${selector}}`;

				interactionStyle.textContent =
					interactionStyle.textContent.replace(
						selectorRegExp,
						`$1 transition: ${transitionString};`
					);
			}
		}
	};

	const getTransitionString = effectsObj =>
		effectsObj['transition-status']
			? `all ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj['easing']}`
			: 'all 0s 0s';

	maxiRelations[0]?.forEach(item => {
		if (!item?.uniqueID) return;

		const triggerEl = document.querySelector(`.${item.trigger}`);
		const target = `#${item.uniqueID} ${item.target ?? ''}`;

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
						target,
						stylesObj
					);

					toggleInlineStyles(stylesObj, target);
				});

				triggerEl.addEventListener('mouseleave', () => {
					const { stylesObj, effectsObj } = getCssResponsiveObj(
						item.css,
						item.effects
					);

					toggleInlineStyles(stylesObj, target, true);

					timeout = setTimeout(() => {
						// Removing transition after transition-duration + 1s to make sure it's done
						toggleTransition(
							getTransitionString(effectsObj),
							target,
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
						target,
						stylesObj
					);

					toggleInlineStyles(stylesObj, target);
				});
			}
		}
	});
};

window.addEventListener('load', relations);
window.addEventListener('load', () => {
	if (maxiRelations[0].length) {
		if (!document.querySelector('#maxi-blocks-interaction-css')) {
			const inlineStyle = document.querySelector(
				'#maxi-blocks-inline-css'
			);
			if (inlineStyle) {
				const interactionStyle = document.createElement('style');
				interactionStyle.id = 'maxi-blocks-interaction-css';
				inlineStyle.parentNode.insertBefore(
					interactionStyle,
					inlineStyle.nextSibling
				);
			}
		}
	}
});
window.addEventListener('resize', relations);
