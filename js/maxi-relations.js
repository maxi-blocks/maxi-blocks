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
						`(${escapeRegExp(selector)}.*?) ${key}:.*?;`
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

	const toggleTransition = (
		target,
		stylesObj,
		effectsObj,
		isIcon = false,
		remove = false
	) => {
		const targets =
			stylesObj?.isTargets && !target.includes('svg-icon') // svg-icon is a special case; avoid disco effect 🪩
				? Object.keys(stylesObj)
				: null;
		if (targets) {
			targets.forEach(targetSelector => {
				targetSelector !== 'isTargets' &&
					toggleTransition(
						`${target} ${targetSelector}`,
						stylesObj[targetSelector],
						effectsObj,
						isIcon,
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
				? `all ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj['easing']}`
				: `all 0s 0s, `;
		else
			return Object.keys(styleObj).reduce(
				(transitionString, style) =>
					effectsObj['transition-status']
						? `${transitionString}${style} ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj['easing']}, `
						: `${transitionString}${style} 0s 0s, `,
				''
			);
	};

	maxiRelations[0]?.forEach(item => {
		if (!item?.uniqueID) return;

		const triggerEl = document.querySelector(`.${item.trigger}`);
		const target = `#${item.uniqueID} ${item.target ?? ''}`;

		let timeout;

		switch (item.action) {
			case 'hover':
				{
					triggerEl.addEventListener('mouseenter', () => {
						clearTimeout(timeout);

						document
							.querySelector(target)
							.setAttribute('data-maxi-relations', 'true');

						const { stylesObj, effectsObj } = getCssResponsiveObj(
							item.css,
							item.effects
						);

						toggleTransition(
							target,
							stylesObj,
							effectsObj,
							item.settings === 'Icon colour' ||
								item.settings === 'Button icon'
						);

						toggleInlineStyles(
							stylesObj,
							`${target.trim()}[data-maxi-relations="true"]`
						);
					});

					triggerEl.addEventListener('mouseleave', () => {
						document
							.querySelector(target)
							.setAttribute('data-maxi-relations', 'false');

						const { stylesObj, effectsObj } = getCssResponsiveObj(
							item.css,
							item.effects
						);

						toggleInlineStyles(
							stylesObj,
							`${target.trim()}[data-maxi-relations="false"]`,
							true
						);

						timeout = setTimeout(() => {
							// Removing transition after transition-duration + 1s to make sure it's done
							toggleTransition(
								target,
								stylesObj,
								effectsObj,
								false,
								true
							);
						}, item.effects['transition-duration-general'] * 1000 + 1000);
					});
				}
				break;
			case 'click':
				{
					triggerEl.addEventListener('click', () => {
						document
							.querySelector(target)
							.setAttribute('data-maxi-relations', 'true');

						const { stylesObj, effectsObj } = getCssResponsiveObj(
							item.css,
							item.effects
						);

						toggleTransition(
							target,
							stylesObj,
							effectsObj,
							item.settings === 'Icon colour' ||
								item.settings === 'Button icon'
						);

						toggleInlineStyles(
							stylesObj,
							`${target.trim()}[data-maxi-relations="true"]`
						);
					});
				}
				break;
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
