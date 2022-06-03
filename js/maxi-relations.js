// Relations

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const relations = () => {
	const getCssResponsiveObj = (css, effects) => {
		let stylesObj = {};
		let effectsObj = {};

		Object.entries(css).forEach(([breakpoint, obj]) => {
			console.log(breakpoint, breakpoints.includes(breakpoint), obj);
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
					...(effects[`transition-duration-${breakpoint}`] && {
						'transition-duration':
							effects[`transition-duration-${breakpoint}`],
					}),
					...(effects[`transition-delay-${breakpoint}`] && {
						'transition-delay':
							effects[`transition-delay-${breakpoint}`],
					}),
					...(effects[`transition-timing-function-${breakpoint}`] && {
						'transition-timing-function':
							effects[`transition-timing-function-${breakpoint}`],
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
		const triggerEl = document.querySelector(`.${item.trigger}`);
		const targetEl = document.querySelector(
			`.${item.uniqueID} ${item.target ?? ''}`
		);

		const { css, effectsObj } = getCssResponsiveObj(item.css, item.effects);

		const transitionString = `all ${effectsObj['transition-duration']}s ${effectsObj['transition-delay']}s ${effectsObj['transition-timing-function']}`;

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
						targetEl.style.transition = '';
					}, item.effects['transition-duration-general'] * 1000 + 10);
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
