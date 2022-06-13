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

	maxiRelations[0]?.map(item => {
		if (!item?.uniqueID) return;

		const triggerEl = document.querySelector(`.${item.trigger}`);
		const targetEl = document.querySelector(
			`.${item.uniqueID} ${item.target ?? ''}`
		);

		const { css, effectsObj } = getCssResponsiveObj(item.css, item.effects);

		const transitionString = `all ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj['easing']}`;
		let timeout;

		switch (item.action) {
			case 'hover': {
				triggerEl.addEventListener('mouseenter', () => {
					clearTimeout(timeout);
					targetEl.style.transition = transitionString;

					toggleInlineStyles(css, targetEl);
				});

				triggerEl.addEventListener('mouseleave', () => {
					toggleInlineStyles(css, targetEl, true);

					timeout = setTimeout(() => {
						// Removing transition after transition-duration + 1s to make sure it's done
						targetEl.style.transition = '';
					}, item.effects['transition-duration-general'] * 1000 + 1000);
				});
			}
			case 'click': {
				triggerEl.addEventListener('click', () => {
					targetEl.style.transition = transitionString;
					toggleInlineStyles(css, targetEl);
				});
			}
		}
	});
};

window.addEventListener('load', relations);
