// Relations

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const relations = () => {
	const getCssResponsiveObj = (css, effects) => {
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
			}
		});

		return {
			css: stylesObj,
			effectsObj,
		};
	};

	const toggleInlineStyles = (stylesObj, element, remove = false) => {
		Object.entries(stylesObj).forEach(([key, value]) => {
			element.style[key] = !remove ? value : '';
		});
	};

	const getTransitionString = effectsObj =>
		`all ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj['easing']}`;

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
					const { css, effectsObj } = getCssResponsiveObj(
						item.css,
						item.effects
					);

					targetEl.style.transition = getTransitionString(effectsObj);

					toggleInlineStyles(css, targetEl);
				});

				triggerEl.addEventListener('mouseleave', () => {
					const { css } = getCssResponsiveObj(item.css, item.effects);

					toggleInlineStyles(css, targetEl, true);

					timeout = setTimeout(() => {
						// Removing transition after transition-duration + 1s to make sure it's done
						targetEl.style.transition = '';
					}, item.effects['transition-duration-general'] * 1000 + 1000);
				});
			}
			case 'click': {
				triggerEl.addEventListener('click', () => {
					const { css, effectsObj } = getCssResponsiveObj(
						item.css,
						item.effects
					);

					targetEl.style.transition = getTransitionString(effectsObj);
					toggleInlineStyles(css, targetEl);
				});
			}
		}
	});
};

window.addEventListener('load', relations);
window.addEventListener('resize', relations);
