/* eslint-disable @wordpress/no-global-event-listener */

// Motion Effects
const hovers = () => {
	const motionElements = document.querySelectorAll('.maxi-hover-effect');
	motionElements.forEach(elem => {
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
			// Hover
			if (
				'hover-basic-effect-type' in motionData &&
				'hover-text-effect-type' in motionData
			) {
				const hoverElem =
					document.querySelector(
						`#${motionID} .maxi-image-block-wrapper .maxi-image-block__image`
					) ||
					document.querySelector(
						`#${motionID} .maxi-image-block-wrapper svg`
					);

				hoverElem.addEventListener('mouseenter', e => {
					if (
						motionData['hover-type'] === 'text' ||
						motionData['hover-basic-effect-type'] === 'zoom-in' ||
						motionData['hover-basic-effect-type'] === 'zoom-out' ||
						motionData['hover-basic-effect-type'] === 'slide' ||
						motionData['hover-basic-effect-type'] === 'rotate' ||
						motionData['hover-basic-effect-type'] === 'blur' ||
						motionData['hover-basic-effect-type'] === 'sepia' ||
						motionData['hover-basic-effect-type'] ===
							'clear-sepia' ||
						motionData['hover-basic-effect-type'] ===
							'grey-scale' ||
						motionData['hover-basic-effect-type'] ===
							'clear-grey-scale'
					) {
						e.target.style.transitionDuration = `${motionData['hover-transition-duration']}s`;
						e.target.style.transitionTimingFunction = `
					${
						motionData['hover-transition-easing'] !== 'cubic-bezier'
							? motionData['hover-transition-easing']
							: motionData['hover-transition-easing-cubic-bezier']
							? `cubic-bezier(${motionData[
									'hover-transition-easing-cubic-bezier'
							  ].join()})`
							: 'easing'
					}
					`;
					}

					if (motionData['hover-type'] === 'basic') {
						if (motionData['hover-basic-effect-type'] === 'zoom-in')
							e.target.style.transform = `scale(${motionData['hover-basic-zoom-in-value']})`;
						else if (
							motionData['hover-basic-effect-type'] === 'rotate'
						)
							e.target.style.transform = `rotate(${motionData['hover-basic-rotate-value']}deg)`;
						else if (
							motionData['hover-basic-effect-type'] === 'zoom-out'
						)
							e.target.style.transform = 'scale(1)';
						else if (
							motionData['hover-basic-effect-type'] === 'slide'
						)
							e.target.style.marginLeft = `${motionData['hover-basic-slide-value']}px`;
						else if (
							motionData['hover-basic-effect-type'] === 'blur'
						)
							e.target.style.filter = `blur(${motionData['hover-basic-blur-value']}px)`;
						else {
							e.target.style.transform = '';
							e.target.style.marginLeft = '';
							e.target.style.filter = '';
						}
					}
				});

				hoverElem.addEventListener('mouseleave', e => {
					if (motionData['hover-type'] === 'basic') {
						if (motionData['hover-basic-effect-type'] === 'zoom-in')
							e.target.style.transform = 'scale(1)';
						else if (
							motionData['hover-basic-effect-type'] === 'rotate'
						)
							e.target.style.transform = 'rotate(0)';
						else if (
							motionData['hover-basic-effect-type'] === 'zoom-out'
						)
							e.target.style.transform = `scale(${motionData['hover-basic-zoom-out-value']})`;
						else if (
							motionData['hover-basic-effect-type'] === 'slide'
						)
							e.target.style.marginLeft = 0;
						else if (
							motionData['hover-basic-effect-type'] === 'blur'
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
