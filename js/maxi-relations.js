// Relations

const relations = () => {
	const getCssStyles = css => {
		let styles = '';

		Object.entries(css).forEach(([key, value]) => {
			if (!value.breakpoint || window.innerWidth < value.breakpoint) {
				styles += value.content;
			}
		});

		return styles;
	};

	maxiRelations[0]?.map(item => {
		const triggerEl = document.querySelector(`.${item.trigger}`);
		const targetEl = document.querySelector(
			`.${item.uniqueID} ${item.target ?? ''}`
		);

		const css = getCssStyles(item.css);

		switch (item.action) {
			case 'hover': {
				triggerEl.addEventListener('mouseenter', () => {
					targetEl.style = css;
				});

				triggerEl.addEventListener('mouseleave', () => {
					targetEl.style = '';
				});
			}
			case 'click': {
				triggerEl.addEventListener('click', () => {
					targetEl.style = css;
				});
			}
		}
	});
};

window.addEventListener('load', relations);
