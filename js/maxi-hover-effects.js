/* eslint-disable @wordpress/no-global-event-listener */

// Hover Effects
const hovers = () => {
	const hoverElements = document.querySelectorAll('.maxi-hover-effect');
	hoverElements.forEach(elem => {
		// eslint-disable-next-line no-undef
		if (!maxi_custom_data.custom_data) return;

		const hoverID = elem.id;

		const hoverData =
			// eslint-disable-next-line no-undef
			maxi_custom_data.custom_data[hoverID] !== undefined
				? // eslint-disable-next-line no-undef
				  maxi_custom_data.custom_data[hoverID]
				: null;

		if (hoverData !== null) {
			// Hover
			if (
				'hover-basic-effect-type' in hoverData &&
				'hover-text-effect-type' in hoverData
			) {
				const hoverElem =
					document.querySelector(
						`#${hoverID} .maxi-image-block-wrapper .maxi-image-block__image`
					) ||
					document.querySelector(
						`#${hoverID} .maxi-image-block-wrapper svg`
					);

				hoverElem.addEventListener('mouseenter', e => {
					if (
						hoverData['hover-type'] === 'text' ||
						hoverData['hover-basic-effect-type'] === 'zoom-in' ||
						hoverData['hover-basic-effect-type'] === 'zoom-out' ||
						hoverData['hover-basic-effect-type'] === 'slide' ||
						hoverData['hover-basic-effect-type'] === 'rotate' ||
						hoverData['hover-basic-effect-type'] === 'blur' ||
						hoverData['hover-basic-effect-type'] === 'sepia' ||
						hoverData['hover-basic-effect-type'] ===
							'clear-sepia' ||
						hoverData['hover-basic-effect-type'] === 'grey-scale' ||
						hoverData['hover-basic-effect-type'] ===
							'clear-grey-scale'
					) {
						e.target.style.transitionDuration = `${hoverData['hover-transition-duration']}s`;
						e.target.style.transitionTimingFunction = `
					${
						hoverData['hover-transition-easing'] !== 'cubic-bezier'
							? hoverData['hover-transition-easing']
							: hoverData['hover-transition-easing-cubic-bezier']
							? `cubic-bezier(${hoverData[
									'hover-transition-easing-cubic-bezier'
							  ].join()})`
							: 'easing'
					}
					`;
					}

					if (hoverData['hover-type'] === 'basic') {
						if (hoverData['hover-basic-effect-type'] === 'zoom-in')
							e.target.style.transform = `scale(${hoverData['hover-basic-zoom-in-value']})`;
						else if (
							hoverData['hover-basic-effect-type'] === 'rotate'
						)
							e.target.style.transform = `rotate(${hoverData['hover-basic-rotate-value']}deg)`;
						else if (
							hoverData['hover-basic-effect-type'] === 'zoom-out'
						)
							e.target.style.transform = 'scale(1)';
						else if (
							hoverData['hover-basic-effect-type'] === 'slide'
						)
							e.target.style.marginLeft = `${hoverData['hover-basic-slide-value']}px`;
						else if (
							hoverData['hover-basic-effect-type'] === 'blur'
						)
							e.target.style.filter = `blur(${hoverData['hover-basic-blur-value']}px)`;
						else {
							e.target.style.transform = '';
							e.target.style.marginLeft = '';
							e.target.style.filter = '';
						}
					}
				});

				hoverElem.addEventListener('mouseleave', e => {
					if (hoverData['hover-type'] === 'basic') {
						if (hoverData['hover-basic-effect-type'] === 'zoom-in')
							e.target.style.transform = 'scale(1)';
						else if (
							hoverData['hover-basic-effect-type'] === 'rotate'
						)
							e.target.style.transform = 'rotate(0)';
						else if (
							hoverData['hover-basic-effect-type'] === 'zoom-out'
						)
							e.target.style.transform = `scale(${hoverData['hover-basic-zoom-out-value']})`;
						else if (
							hoverData['hover-basic-effect-type'] === 'slide'
						)
							e.target.style.marginLeft = 0;
						else if (
							hoverData['hover-basic-effect-type'] === 'blur'
						)
							e.target.style.filter = 'blur(0)';
						else {
							e.target.style.transform = '';
							e.target.style.marginLeft = '';
							e.target.style.filter = '';
						}
					}
				});
			}
		}
	});
};

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('load', hovers);
