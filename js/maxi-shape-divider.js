/* eslint-disable @wordpress/no-global-event-listener */

// Shape Divider Effects
const shapeDivider = () => {
	const shapeDividerElements = document.querySelectorAll('.maxi-sd-effect');
	shapeDividerElements.forEach(elem => {
		// eslint-disable-next-line no-undef
		if (!maxi_custom_data.custom_data) return;

		const shapeID = elem.id;

		const shapeData =
			// eslint-disable-next-line no-undef
			maxi_custom_data.custom_data[shapeID] !== undefined
				? // eslint-disable-next-line no-undef
				  maxi_custom_data.custom_data[shapeID]
				: null;

		if (shapeData !== null) {
			// Shape Divider
			if (
				shapeData['shape-divider-top-effects-status'] &&
				shapeData['shape-divider-top-status']
			) {
				const shapeDividerTopHeight =
					shapeData['shape-divider-top-height'];
				const shapeDividerTopHeightUnit =
					shapeData['shape-divider-top-height-unit'];
				const target = document.querySelector(
					`#${shapeID} > .maxi-shape-divider.maxi-shape-divider__top`
				);

				// eslint-disable-next-line @wordpress/no-global-event-listener
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
				// eslint-disable-next-line @wordpress/no-global-event-listener
				window.addEventListener('scroll', () => {
					if (target.getBoundingClientRect().top < 100) {
						target.style.height = 0;
					} else {
						target.style.height = `${shapeDividerBottomHeight}${shapeDividerBottomHeightUnit}`;
					}
				});
			}
		}
	});
};

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('load', shapeDivider);
