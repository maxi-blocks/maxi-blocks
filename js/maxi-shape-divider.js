/* eslint-disable @wordpress/no-global-event-listener */

// Shape Divider Effects
const shapeDivider = () => {
	const shapeDividerElements = document.querySelectorAll('.maxi-sd-effect');
	shapeDividerElements.forEach(elem => {
		// eslint-disable-next-line no-undef
		if (!maxiShapeDivider) return;

		const shapeID = elem.id;

		const shapeData =
			// eslint-disable-next-line no-undef
			maxiShapeDivider[shapeID] !== undefined
				? // eslint-disable-next-line no-undef
				  maxiShapeDivider[shapeID]
				: null;

		if (shapeData !== null) {
			// Shape Divider
			if (shapeData['sdt_ef.s'] && shapeData['sdt.s']) {
				const shapeDividerTopHeight = shapeData.sdt_h;
				const shapeDividerTopHeightUnit = shapeData['sdt_h.u'];
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

			if (shapeData['sdb_ef.s'] && shapeData['sdb.s']) {
				const shapeDividerBottomHeight = shapeData.sdb_h;
				const shapeDividerBottomHeightUnit = shapeData['sdb_h.u'];
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
