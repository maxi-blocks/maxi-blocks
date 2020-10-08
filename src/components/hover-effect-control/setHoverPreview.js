// /* eslint-disable no-undef */
const setHoverPreview = (hoverData, uniqueID) => {
	// const gsap = {};
	// GSAP PLugins
	gsap.registerPlugin(ScrollTrigger);

	// Hover Effect
	if (hoverData !== null) {
		if ('type' in hoverData) {
			const hoverElem = document.querySelector(
				`.maxi-motion-effect-${uniqueID} .maxi-block-hover-wrapper`
			);

			hoverElem.style.overflow = 'hidden';
			hoverElem.style.position = 'relative';
			const hoverElemAct = document.querySelector(
				`.maxi-motion-effect-${uniqueID} .maxi-block-hover-wrapper > img`
			);
			const hoverElemDetails = document.querySelector(
				`.maxi-motion-effect-${uniqueID} .maxi-block-hover-wrapper > .maxi-hover-details`
			);
			const hoverElemHeight = hoverElemAct.clientHeight;
			const hoverElemWidth = hoverElemAct.clientWidth;

			hoverElem.addEventListener('mouseenter', function () {
				doHoverEffect();
			});
			hoverElem.addEventListener('mouseleave', function () {
				doHoverEffect();
			});

			// Tilt
			if (hoverData.effectType === 'tilt') {
				hoverElem.addEventListener('mousemove', function (e) {
					const xPos = e.clientX / window.innerWidth - 0.5;
					const yPos = e.clientY / window.innerHeight - 0.5;

					gsap.to(hoverElem, 0.6, {
						rotationY: 30 * xPos,
						rotationX: 30 * yPos,
						ease: Power1.easeOut,
						transformPerspective: 900,
						transformOrigin: 'center',
					});
				});
				hoverElem.addEventListener('mouseleave', function (e) {
					gsap.to(hoverElem, 0.6, {
						rotationY: 0,
						rotationX: 0,
					});
				});
			}

			const hoverTl = gsap.timeline();

			if (hoverData.type === 'text') {
				switch (hoverData.effectType) {
					case 'fade':
						gsap.set(hoverElemDetails, { opacity: 0 });
						hoverTl.to(hoverElemDetails, hoverData.duration, {
							opacity: 1,
						});
						break;
					case 'push-up':
						gsap.set(hoverElemDetails, { y: hoverElemHeight });
						hoverTl
							.to(
								hoverElemAct,
								hoverData.duration,
								{ y: -hoverElemHeight },
								'move'
							)
							.to(
								hoverElemDetails,
								hoverData.duration,
								{ y: 0 },
								'move'
							);
						break;
					case 'push-bottom':
						gsap.set(hoverElemDetails, { y: -hoverElemHeight });
						hoverTl
							.to(
								hoverElemAct,
								hoverData.duration,
								{ y: hoverElemHeight },
								'move'
							)
							.to(
								hoverElemDetails,
								hoverData.duration,
								{ y: 0 },
								'move'
							);
						break;
					case 'push-left':
						gsap.set(hoverElemDetails, { x: hoverElemWidth });
						hoverTl
							.to(
								hoverElemAct,
								hoverData.duration,
								{ x: -hoverElemWidth },
								'move'
							)
							.to(
								hoverElemDetails,
								hoverData.duration,
								{ x: 0 },
								'move'
							);
						break;
					case 'push-right':
						gsap.set(hoverElemDetails, { x: -hoverElemWidth });
						hoverTl
							.to(
								hoverElemAct,
								hoverData.duration,
								{ x: hoverElemWidth },
								'move'
							)
							.to(
								hoverElemDetails,
								hoverData.duration,
								{ x: 0 },
								'move'
							);
						break;
					case 'slide-up':
						gsap.set(hoverElemDetails, { y: hoverElemHeight });
						hoverTl.to(hoverElemDetails, hoverData.duration, {
							y: 0,
						});
						break;
					case 'slide-bottom':
						gsap.set(hoverElemDetails, { y: -hoverElemHeight });
						hoverTl.to(hoverElemDetails, hoverData.duration, {
							y: 0,
						});
						break;
					case 'slide-left':
						gsap.set(hoverElemDetails, { x: hoverElemWidth });
						hoverTl.to(hoverElemDetails, hoverData.duration, {
							x: 0,
						});
						break;
					case 'slide-right':
						gsap.set(hoverElemDetails, { x: -hoverElemWidth });
						hoverTl.to(hoverElemDetails, hoverData.duration, {
							x: 0,
						});
						break;
					default:
						return false;
				}
			}

			if (hoverData.type === 'basic') {
				switch (hoverData.effectType) {
					case 'zoom-in':
						hoverTl.to(hoverElemAct, hoverData.duration, {
							transformOrigin: '50% 50%',
							scale: 1.2,
							ease: Power2.easeInOut,
							force3D: true,
						});
						break;
					case 'zoom-out':
						hoverTl.from(hoverElemAct, hoverData.duration, {
							transformOrigin: '50% 50%',
							scale: 1.2,
							ease: Power2.easeInOut,
							force3D: true,
						});
						break;
					case 'slide':
						gsap.set(hoverElemAct, { scale: 1.3 });
						hoverTl.to(hoverElemAct, hoverData.duration, {
							transformOrigin: '50% 50%',
							x: 70,
							ease: Power2.easeInOut,
							force3D: true,
						});
						break;
					case 'rotate':
						hoverTl.to(hoverElemAct, hoverData.duration, {
							transformOrigin: '50% 50%',
							rotate: 5,
							scale: 1.2,
							ease: Power2.easeInOut,
							force3D: true,
						});
						break;
					case 'greay-scale':
						hoverTl.to(hoverElemAct, hoverData.duration, {
							webkitFilter: 'grayscale(100%)',
							filter: 'grayscale(100%)',
						});
						break;
					case 'clear-greay-scale':
						gsap.set(hoverElemAct, {
							webkitFilter: 'grayscale(100%)',
							filter: 'grayscale(100%)',
						});
						hoverTl.to(hoverElemAct, hoverData.duration, {
							webkitFilter: 'grayscale(0%)',
							filter: 'grayscale(0%)',
						});
						break;
					case 'blur':
						hoverTl.to(hoverElemAct, hoverData.duration, {
							webkitFilter: 'blur(4px)',
							filter: 'blur(4px)',
						});
						break;
					case 'clear-blur':
						gsap.set(hoverElemAct, {
							webkitFilter: 'blur(4px)',
							filter: 'blur(4px)',
						});
						hoverTl.to(hoverElemAct, hoverData.duration, {
							webkitFilter: 'blur(0px)',
							filter: 'blur(0px)',
						});
						break;
					case 'tilt':
						break;
					default:
						return false;
				}
			}

			hoverTl.reversed(true);
			function doHoverEffect() {
				hoverTl.reversed(!hoverTl.reversed());
			}
		}
	}
};
export default setHoverPreview;
