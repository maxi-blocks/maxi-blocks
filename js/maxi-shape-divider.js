// Shape Divider Effects
const shapeDivider = () => {
	// eslint-disable-next-line no-undef
	if (!maxiShapeDivider?.[0]) return;

	const shapeDividerElements = document.querySelectorAll('.maxi-sd-effect');
	shapeDividerElements.forEach(elem => {
		// eslint-disable-next-line no-undef

		const shapeID = elem.id;

		// eslint-disable-next-line no-undef
		const shapeData = JSON.parse(maxiShapeDivider[0][shapeID]);

		if (!shapeData) return;

		// Shape Divider
		if (
			shapeData['shape-divider-top-effects-status'] &&
			shapeData['shape-divider-top-status']
		) {
			const shapeDividerTopHeight = shapeData['shape-divider-top-height'];
			const shapeDividerTopHeightUnit =
				shapeData['shape-divider-top-height-unit'];
			const target = document.querySelector(
				`#${shapeID} > .maxi-shape-divider.maxi-shape-divider__top`
			);

			window.addEventListener('scroll', () => {
				if (target.getBoundingClientRect().top < 100) {
					target.style.height = 0;
				} else {
					target.style.height = `${shapeDividerTopHeight}${shapeDividerTopHeightUnit}`;
				}
			});
		}

		if (
			shapeData['shape-divider-bottom-effects-status'] &&
			shapeData['shape-divider-bottom-status']
		) {
			const shapeDividerBottomHeight =
				shapeData['shape-divider-bottom-height'];
			const shapeDividerBottomHeightUnit =
				shapeData['shape-divider-bottom-height-unit'];
			const target = document.querySelector(
				`#${shapeID} > .maxi-shape-divider.maxi-shape-divider__bottom`
			);

			window.addEventListener('scroll', () => {
				if (target.getBoundingClientRect().top < 100) {
					target.style.height = 0;
				} else {
					target.style.height = `${shapeDividerBottomHeight}${shapeDividerBottomHeightUnit}`;
				}
			});
		}
	});
};

window.addEventListener('DOMContentLoaded', shapeDivider);
