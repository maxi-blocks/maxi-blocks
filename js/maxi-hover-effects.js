/* eslint-disable @wordpress/no-global-event-listener */

// Hover Effects
const hovers = () => {
	const hoverElements = document.querySelectorAll('.maxi-hover-effect');
	hoverElements.forEach(elem => {
		// eslint-disable-next-line no-undef
		if (!maxiHoverEffects) return;

		const hoverID = elem.id;

		const hoverData =
			// eslint-disable-next-line no-undef
			maxiHoverEffects[0][hoverID] !== undefined
				? // eslint-disable-next-line no-undef
				  maxiHoverEffects[0][hoverID]
				: null;

		if (hoverData !== null) {
			// Hover
			if ('h_bet' in hoverData && 'h_tety' in hoverData) {
				const hoverElem =
					document.querySelector(
						`#${hoverID} .maxi-image-block-wrapper .maxi-image-block__image`
					) ||
					document.querySelector(
						`#${hoverID} .maxi-image-block-wrapper svg`
					);

				if (
					hoverData.h_bet === 'zoom-in' ||
					hoverData.h_bet === 'zoom-out' ||
					hoverData.h_bet === 'slide' ||
					hoverData.h_bet === 'rotate' ||
					hoverData.h_bet === 'blur' ||
					hoverData.h_bet === 'sepia' ||
					hoverData.h_bet === 'clear-sepia' ||
					hoverData.h_bet === 'grey-scale' ||
					hoverData.h_bet === 'clear-grey-scale'
				) {
					hoverElem.style.transitionDuration = `${hoverData.h_tdu}s`;
					hoverElem.style.transitionTimingFunction = `
					${
						hoverData.h_te !== 'cubic-bezier'
							? hoverData.h_te
							: hoverData.h_tecb
							? `cubic-bezier(${hoverData.h_tecb.join()})`
							: 'easing'
					}
					`;
				}

				hoverElem.addEventListener('mouseenter', e => {
					if (hoverData.h_ty === 'basic') {
						if (hoverData.h_bet === 'zoom-in')
							e.target.style.transform = `scale(${hoverData.h_bziv})`;
						else if (hoverData.h_bet === 'rotate')
							e.target.style.transform = `rotate(${hoverData.h_brv}deg)`;
						else if (hoverData.h_bet === 'zoom-out')
							e.target.style.transform = 'scale(1)';
						else if (hoverData.h_bet === 'slide')
							e.target.style.transform = `translateX(${hoverData.h_bsv}%)`;
						else if (hoverData.h_bet === 'blur')
							e.target.style.filter = `blur(${hoverData.h_bbv}px)`;
						else {
							e.target.style.transform = '';
							e.target.style.filter = '';
						}
					}
				});

				hoverElem.addEventListener('mouseleave', e => {
					if (hoverData.h_ty === 'basic') {
						if (hoverData.h_bet === 'zoom-in')
							e.target.style.transform = 'scale(1)';
						else if (hoverData.h_bet === 'rotate')
							e.target.style.transform = 'rotate(0)';
						else if (hoverData.h_bet === 'zoom-out')
							e.target.style.transform = `scale(${hoverData.h_bzov})`;
						else if (hoverData.h_bet === 'slide')
							e.target.style.transform = 'translateX(0%)';
						else if (hoverData.h_bet === 'blur')
							e.target.style.filter = 'blur(0)';
						else {
							e.target.style.transform = '';

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
