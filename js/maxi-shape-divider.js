/* eslint-disable @wordpress/no-global-event-listener */

// Shape Divider Effects
const shapeDivider = () => {
	const shapeDividerElements = document.querySelectorAll('.maxi-sd-effect');
	shapeDividerElements.forEach(elem => {
		// eslint-disable-next-line no-undef
		if (!maxi_custom_data.custom_data) return;

		const motionID = elem.id;

		const motionData =
			// eslint-disable-next-line no-undef
			maxi_custom_data.custom_data[motionID] !== undefined
				? // eslint-disable-next-line no-undef
				  maxi_custom_data.custom_data[motionID]
				: null;

		if (motionData !== null) {
			// Shape Divider
			if (
				motionData['shape-divider-top-effects-status'] &&
				motionData['shape-divider-top-status']
			) {
				const shapeDividerTopHeight =
					motionData['shape-divider-top-height'];
				const shapeDividerTopHeightUnit =
					motionData['shape-divider-top-height-unit'];
				const target = document.querySelector(
					`#${motionID} > .maxi-shape-divider.maxi-shape-divider__top`
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
				motionData['shape-divider-bottom-effects-status'] &&
				motionData['shape-divider-bottom-status']
			) {
				const shapeDividerBottomHeight =
					motionData['shape-divider-bottom-height'];
				const shapeDividerBottomHeightUnit =
					motionData['shape-divider-bottom-height-unit'];
				const target = document.querySelector(
					`#${motionID} > .maxi-shape-divider.maxi-shape-divider__bottom`
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
