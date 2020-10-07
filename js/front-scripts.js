// GSAP PLugins
gsap.registerPlugin(ScrollTrigger);

// Motion Effects
const motionElems = document.querySelectorAll('.maxi-motion-effect');
motionElems.forEach(function (elem) {
	const motionID = elem.getAttribute('data-motion-id');
	const motionData = JSON.parse(elem.getAttribute('data-motion'));
	const shapeDividerData = JSON.parse(
		elem.getAttribute('data-shape-divider')
	);
	const hoverData = JSON.parse(elem.getAttribute('data-hover'));

	// Hover Effect
	if (hoverData !== null) {
		if ('type' in hoverData) {
			const hoverElem = document.querySelector(
				'.maxi-motion-effect-' + motionID + ' .maxi-block-hover-wrapper'
			);

			hoverElem.style.overflow = 'hidden';
			hoverElem.style.position = 'relative';
			const hoverElemAct = document.querySelector(
				'.maxi-motion-effect-' +
					motionID +
					' .maxi-block-hover-wrapper > img'
			);
			const hoverElemDetails = document.querySelector(
				'.maxi-motion-effect-' +
					motionID +
					' .maxi-block-hover-wrapper > .maxi-hover-details'
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
					var xPos = e.clientX / window.innerWidth - 0.5;
					var yPos = e.clientY / window.innerHeight - 0.5;

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
				}
			}

			hoverTl.reversed(true);
			function doHoverEffect() {
				hoverTl.reversed(!hoverTl.reversed());
			}
		}
	}

	// Shape Divider
	if (shapeDividerData !== null) {
		const motionTimeLine = gsap.timeline({
			scrollTrigger: {
				trigger:
					'.maxi-motion-effect-' +
					motionID +
					' > .maxi-container-block__wrapper .maxi-shape-divider',
				start: '-150',
				scrub: true,
				markers: false,
				onEnter: self => {
					self.trigger = elem;
				},
			},
		});
		if (
			'top' in shapeDividerData &&
			!!parseInt(shapeDividerData.top.effects.status)
		) {
			motionTimeLine.to(
				'.maxi-motion-effect-' +
					motionID +
					' > .maxi-shape-divider.maxi-shape-divider__top',
				{
					height: 0,
					duration: 1,
					ease: 'power1.out',
				}
			);
		}
		if (
			'bottom' in shapeDividerData &&
			!!parseInt(shapeDividerData.bottom.effects.status)
		) {
			motionTimeLine.to(
				'.maxi-motion-effect-' +
					motionID +
					' > .maxi-shape-divider.maxi-shape-divider__bottom',
				{
					height: 0,
					duration: 1,
					ease: 'power1.out',
				}
			);
		}
	}

	if (motionData !== null) {
		// Parallax Effect
		if ('parallax' in motionData) {
			const parallaxElem = document.querySelector(
				`.maxi-motion-effect-${motionID} > .maxi-background-displayer > .maxi-background-displayer__images`
			);
			const parallaxStatus = motionData.parallax.status;
			const parallaxSpeed = motionData.parallax.speed;
			const parallaxDirection = motionData.parallax.direction;

			const getBackgroundPosition = () => {
				if (parallaxDirection === 'up')
					return '50% ' + -window.innerHeight / parallaxSpeed + 'px';
				if (parallaxDirection === 'down')
					return '50% ' + -window.innerHeight * parallaxSpeed + 'px';
			};

			if (!!parseInt(parallaxStatus)) {
				gsap.to(parallaxElem, {
					backgroundPosition: getBackgroundPosition(),
					ease: 'none',
					scrollTrigger: {
						trigger: parallaxElem,
						scrub: true,
					},
				});
			}
		}

		// Entrance Animation
		if ('entrance' in motionData) {
			const entranceElem = document.querySelector(
				'.maxi-motion-effect-' + motionID + ''
			);
			const entranceType = motionData.entrance.type;
			const entranceDuration =
				motionData.entrance.duration === ''
					? 1
					: motionData.entrance.duration;
			const entranceDelay =
				motionData.entrance.delay === ''
					? 1
					: motionData.entrance.delay;

			if (entranceType !== '') {
				entranceElem.style.opacity = '0';

				var waypoint = new Waypoint({
					element: entranceElem,
					handler: function () {
						entranceElem.style.opacity = '1';
						entranceElem.style.setProperty(
							'--animate-duration',
							'' + entranceDuration + 's'
						);
						entranceElem.style.setProperty(
							'animation-delay',
							'' + entranceDelay + 's'
						);
						entranceElem.classList.add(
							'animate__animated',
							'animate__' + entranceType + ''
						);
					},
					offset: '100%',
				});
			}
		}

		// Vertical Effect
		if ('vertical' in motionData) {
			const direction = motionData.vertical.direction;
			const status = motionData.vertical.status;
			const viewport = motionData.vertical.viewport;
			const amounts =
				typeof motionData.vertical.amounts === 'string'
					? JSON.parse(motionData.vertical.amounts)
					: motionData.vertical.amounts;

			if (!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'top ' + viewport[2] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'center ' + viewport[1] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'bottom ' + viewport[0] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				if (direction === 'down') {
					if (parseFloat(amounts[0]) !== 0 && amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								y: amounts[0],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[1]) !== 0 && amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								y: amounts[1],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[2]) !== 0 && amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								y: amounts[2],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
				if (direction === 'up') {
					if (parseFloat(amounts[0]) !== 0 && amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								y: -amounts[0],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[1]) !== 0 && amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								y: -amounts[1],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[2]) !== 0 && amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								y: -amounts[2],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
			}
		}

		// Horizontal Effect
		if ('horizontal' in motionData) {
			const direction = motionData.horizontal.direction;
			const status = motionData.horizontal.status;
			const viewport = motionData.horizontal.viewport;
			const amounts =
				typeof motionData.horizontal.amounts === 'string'
					? JSON.parse(motionData.horizontal.amounts)
					: motionData.horizontal.amounts;

			if (!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'top ' + viewport[2] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'center ' + viewport[1] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'bottom ' + viewport[0] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				if (direction === 'left') {
					if (parseFloat(amounts[0]) !== 0 && amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								x: amounts[0],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[1]) !== 0 && amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								x: amounts[1],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[2]) !== 0 && amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								x: amounts[2],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
				if (direction === 'right') {
					if (parseFloat(amounts[0]) !== 0 && amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								x: -amounts[0],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[1]) !== 0 && amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								x: -amounts[1],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[2]) !== 0 && amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								x: -amounts[2],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
			}
		}

		// Rotation Effect
		if ('rotate' in motionData) {
			const direction = motionData.rotate.direction;
			const status = motionData.rotate.status;
			const viewport = motionData.rotate.viewport;
			const amounts =
				typeof motionData.rotate.amounts === 'string'
					? JSON.parse(motionData.rotate.amounts)
					: motionData.rotate.amounts;

			if (!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'top ' + viewport[2] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'center ' + viewport[1] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'bottom ' + viewport[0] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				if (direction === 'left') {
					if (parseFloat(amounts[0]) !== 0 && amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								rotation: amounts[0],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[1]) !== 0 && amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								rotation: amounts[1],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[2]) !== 0 && amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								rotation: amounts[2],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
				if (direction === 'right') {
					if (parseFloat(amounts[0]) !== 0 && amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								rotation: -amounts[0],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[1]) !== 0 && amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								rotation: -amounts[1],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[2]) !== 0 && amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								rotation: -amounts[2],
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
			}
		}

		// Scale Effect
		if ('scale' in motionData) {
			const direction = motionData.scale.direction;
			const status = motionData.scale.status;
			const viewport = motionData.scale.viewport;
			const amounts =
				typeof motionData.scale.amounts === 'string'
					? JSON.parse(motionData.scale.amounts)
					: motionData.scale.amounts;

			if (!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'top ' + viewport[2] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'center ' + viewport[1] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'bottom ' + viewport[0] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				if (direction === 'down') {
					if (amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								scale: amounts[0] / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								scale: amounts[1] / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								scale: amounts[2] / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
				if (direction === 'up') {
					if (amounts[0] !== '') {
						motionTimeLineTop.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								scale: amounts[0] / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (amounts[1] !== '') {
						motionTimeLineMid.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								scale: amounts[1] / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (amounts[2] !== '') {
						motionTimeLineBottom.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								scale: amounts[2] / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
			}
		}

		// Fade Effect
		if ('fade' in motionData) {
			const direction = motionData.fade.direction;
			const status = motionData.fade.status;
			const viewport = motionData.fade.viewport;
			const amounts =
				typeof motionData.fade.amounts === 'string'
					? JSON.parse(motionData.fade.amounts)
					: motionData.fade.amounts;

			if (!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'top ' + viewport[2] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'center ' + viewport[1] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'bottom ' + viewport[0] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				if (direction === 'out') {
					if (amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								opacity: parseFloat(amounts[0]) / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								opacity: parseFloat(amounts[1]) / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								opacity: parseFloat(amounts[2]) / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
				if (direction === 'in') {
					if (amounts[0] !== '') {
						motionTimeLineTop.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								opacity: parseFloat(amounts[0]) / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (amounts[1] !== '') {
						motionTimeLineMid.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								opacity: parseFloat(amounts[1]) / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (amounts[2] !== '') {
						motionTimeLineBottom.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								opacity: parseFloat(amounts[2]) / 10,
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
			}
		}

		// Blur Effect
		if ('blur' in motionData) {
			const direction = motionData.blur.direction;
			const status = motionData.blur.status;
			const viewport = motionData.blur.viewport;
			const amounts =
				typeof motionData.blur.amounts === 'string'
					? JSON.parse(motionData.blur.amounts)
					: motionData.blur.amounts;

			if (!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'top ' + viewport[2] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'center ' + viewport[1] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: '.maxi-motion-effect-' + motionID + '',
						start: 'bottom ' + viewport[0] + '%',
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					},
				});
				if (direction === 'in') {
					if (parseFloat(amounts[0]) !== 0 && amounts[0] !== '') {
						motionTimeLineTop.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								webkitFilter: 'blur(' + amounts[0] + 'px)',
								filter: 'blur(' + amounts[0] + 'px)',
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[1]) !== 0 && amounts[1] !== '') {
						motionTimeLineMid.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								webkitFilter: 'blur(' + amounts[1] + 'px)',
								filter: 'blur(' + amounts[1] + 'px)',
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[2]) !== 0 && amounts[2] !== '') {
						motionTimeLineBottom.to(
							'.maxi-motion-effect-' + motionID + '',
							{
								webkitFilter: 'blur(' + amounts[2] + 'px)',
								filter: 'blur(' + amounts[2] + 'px)',
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
				if (direction === 'out') {
					if (parseFloat(amounts[0]) !== 0 && amounts[0] !== '') {
						motionTimeLineTop.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								webkitFilter: 'blur(' + amounts[0] + 'px)',
								filter: 'blur(' + amounts[0] + 'px)',
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[1]) !== 0 && amounts[1] !== '') {
						motionTimeLineMid.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								webkitFilter: 'blur(' + amounts[1] + 'px)',
								filter: 'blur(' + amounts[1] + 'px)',
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
					if (parseFloat(amounts[2]) !== 0 && amounts[2] !== '') {
						motionTimeLineBottom.from(
							'.maxi-motion-effect-' + motionID + '',
							{
								webkitFilter: 'blur(' + amounts[2] + 'px)',
								filter: 'blur(' + amounts[2] + 'px)',
								duration: 1,
								ease: 'power1.out',
							}
						);
					}
				}
			}
		}
	}
});

// Background Video Effects
const containerElems = document.querySelectorAll('.maxi-container-block');
motionElems.forEach(function (elem) {
	const videoPlayerElement = elem.querySelector(
		'.maxi-background-displayer__video-player'
	);
	const videoStart = videoPlayerElement.getAttribute('data-start');
	const videoEnd = videoPlayerElement.getAttribute('data-end');

	const videoType = videoPlayerElement.getAttribute('data-type');
	if (videoType === 'vimeo') {
		const vimeoIsMounted = Array.from(window.document.scripts).findIndex(
			script => {
				console.log(script.getAttribute('id'));
				script.getAttribute('id') == 'maxi-gsap-lib-js-js';
			}
		);
		console.log(vimeoIsMounted);
		let script = document.createElement('script');
		script.src = 'https://player.vimeo.com/api/player.js';

		script.id = 'maxi-vimeo-sdk';
		script.async = true;
		script.onload = function () {
			// Cleanup onload handler
			script.onload = null;

			if (videoEnd) {
				const player = new Vimeo.Player(
					videoPlayerElement.querySelector('iframe')
				);
				console.log(videoPlayerElement.querySelector('iframe'));

				player.on('timeupdate', function (data) {
					if (data.seconds > videoEnd) {
						player.pause();
					}
				});
			}
		};

		document.body.appendChild(script);
	}
});
