// GSAP PLugins
gsap.registerPlugin(ScrollTrigger);

// Motion Effects
const motionElems = document.querySelectorAll(".maxi-motion-effect");
motionElems.forEach(function(elem) {

	const motionID = elem.getAttribute('data-motion-id');
	const motionData = JSON.parse(elem.getAttribute('data-motion'));
	const shapeDividerData = JSON.parse(elem.getAttribute('data-shape-divider'));
	const hoverData = JSON.parse(elem.getAttribute('data-hover'));

	// Hover Effect
	if(hoverData !== null) {
		if(("type" in hoverData) && hoverData.type !== 'none') {
			const hoverElem = document.querySelector(".maxi-motion-effect-"+ motionID +"");
			hoverElem.style.overflow = 'hidden';
			const hoverElemAct = document.querySelector(".maxi-motion-effect-"+ motionID +" .maxi-block-hover-element");
			const hoverElemDetails = document.querySelector(".maxi-motion-effect-"+ motionID +" .maxi-hover-details");
			const hoverElemHeight = hoverElemAct.clientHeight;

			hoverElem.addEventListener('mouseenter', function(){ doHoverEffect() });
			hoverElem.addEventListener('mouseleave', function(){ doHoverEffect() });
			const hoverTl = gsap.timeline();

			if(hoverData.type === 'text') {
				switch(hoverData.effectType) {
					case 'fade':
						hoverTl.to(hoverElemDetails, hoverData.duration, {opacity: 1});
						break;
					case 'push-up':
						gsap.set(hoverElemDetails, {opacity: 1, y: hoverElemHeight});
						hoverTl.to(hoverElemAct, hoverData.duration, {y: -hoverElemHeight}, "move")
						  .to(hoverElemDetails, hoverData.duration, {y: 0}, "move");
						break;
					case 'slide-up':
						gsap.set(hoverElemDetails, {opacity: 1, y: hoverElemHeight});
						hoverTl.to(hoverElemDetails, hoverData.duration, {y: 0});
						break;
				}
			}

			if(hoverData.type === 'basic') {
				switch(hoverData.effectType) {
					case 'zoom-in':
						hoverTl.to(hoverElemAct, hoverData.duration, {transformOrigin:'50% 50%', scale: 1.2, ease: Power2.easeInOut, force3D :true});
						break;
					case 'zoom-out':
						hoverTl.from(hoverElemAct, hoverData.duration, {transformOrigin:'50% 50%', scale: 1.2, ease: Power2.easeInOut, force3D :true});
						break;
					case 'slide':
						gsap.set(hoverElemAct, {scale: 1.3});
						hoverTl.to(hoverElemAct, hoverData.duration, {transformOrigin:'50% 50%', x: 70, ease: Power2.easeInOut, force3D :true});
						break;
					case 'rotate':
						hoverTl.to(hoverElemAct, hoverData.duration, {transformOrigin:'50% 50%', rotate: 5, scale: 1.2, ease: Power2.easeInOut, force3D :true});
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
	if(shapeDividerData !== null) {
		const motionTimeLine = gsap.timeline({
			scrollTrigger: {
				trigger: ".maxi-motion-effect-"+ motionID +" > .maxi-container-block__wrapper .maxi-shape-divider",
				start: "-150",
				scrub: true,
				markers: false,
				onEnter: self => {
					self.trigger = elem;
				},
			}
		});
		if(("top" in shapeDividerData) && !!parseInt(shapeDividerData.top.effects.status)) {
			motionTimeLine.to(".maxi-motion-effect-"+ motionID +" > .maxi-shape-divider.maxi-shape-divider__top", {
				height: 0,
				duration: 1,
				ease: "power1.out"
			});
		}
		if(("bottom" in shapeDividerData) && !!parseInt(shapeDividerData.bottom.effects.status)) {
			motionTimeLine.to(".maxi-motion-effect-"+ motionID +" > .maxi-shape-divider.maxi-shape-divider__bottom", {
				height: 0,
				duration: 1,
				ease: "power1.out"
			});
		}
	}

	if(motionData !== null) {

		// Parallax Effect
		if("parallax" in motionData) {

			const parallaxElem = document.querySelector(".maxi-motion-effect-"+ motionID +"");
			const parallaxStatus = motionData.parallax.status;

			if(!!parseInt(parallaxStatus)) {

				gsap.to(parallaxElem, {
					backgroundPosition: "50% "+ -innerHeight / 2 +"px",
					ease: "none",
					scrollTrigger: {
						trigger: parallaxElem,
						scrub: true
					}
				});

			}
		}

		// Entrance Animation
		if("entrance" in motionData) {

			const entranceElem = document.querySelector(".maxi-motion-effect-"+ motionID +"");
			const entranceType = motionData.entrance.type;
			const entranceDuration = (motionData.entrance.duration === '') ? 1 : motionData.entrance.duration;
			const entranceDelay= (motionData.entrance.delay === '') ? 1 : motionData.entrance.delay;

			if(entranceType !== '') {

				entranceElem.style.opacity = "0";

				var waypoint = new Waypoint({
				  element: entranceElem,
				  handler: function () {
					entranceElem.style.opacity = "1";
					entranceElem.style.setProperty("--animate-duration", ""+ entranceDuration +"s");
					entranceElem.style.setProperty("animation-delay", ""+ entranceDelay +"s");
					entranceElem.classList.add("animate__animated", "animate__"+ entranceType +"");
				  },
				  offset: "100%"
				});

			}

		}

		// Vertical Effect
		if("vertical" in motionData) {

			const direction = motionData.vertical.direction;
			const status = motionData.vertical.status;
			const viewport = motionData.vertical.viewport;
			const startValue = motionData.vertical.startValue;
			const midValue = motionData.vertical.midValue;
			const endValue = motionData.vertical.endValue;

			if(!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "top "+ viewport[2] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "center "+ viewport[1] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "bottom "+ viewport[0] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				if(direction === 'up') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							y: startValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							y: midValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							y: endValue,
							duration: 1,
							ease: "power1.out"
						})
					}
				}
				if(direction === 'down') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							y: -(startValue),
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							y: -(midValue),
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							y: -(endValue),
							duration: 1,
							ease: "power1.out"
						})
					}
				}
			}

		}

		// Horizontal Effect
		if("horizontal" in motionData) {

			const direction = motionData.horizontal.direction;
			const status = motionData.horizontal.status;
			const viewport = motionData.horizontal.viewport;
			const startValue = motionData.horizontal.startValue;
			const midValue = motionData.horizontal.midValue;
			const endValue = motionData.horizontal.endValue;

			if(!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "top "+ viewport[2] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "center "+ viewport[1] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "bottom "+ viewport[0] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				if(direction === 'left') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							x: startValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							x: midValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							x: endValue,
							duration: 1,
							ease: "power1.out"
						})
					}
				}
				if(direction === 'right') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							x: -(startValue),
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							x: -(midValue),
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							x: -(endValue),
							duration: 1,
							ease: "power1.out"
						})
					}
				}
			}

		}

		// Rotation Effect
		if("rotate" in motionData) {

			const direction = motionData.rotate.direction;
			const status = motionData.rotate.status;
			const viewport = motionData.rotate.viewport;
			const startValue = motionData.rotate.startValue;
			const midValue = motionData.rotate.midValue;
			const endValue = motionData.rotate.endValue;

			if(!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "top "+ viewport[2] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "center "+ viewport[1] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "bottom "+ viewport[0] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				if(direction === 'left') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							rotation: startValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							rotation: midValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							rotation: endValue,
							duration: 1,
							ease: "power1.out"
						})
					}
				}
				if(direction === 'right') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							rotation: -(startValue),
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							rotation: -(midValue),
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							rotation: -(endValue),
							duration: 1,
							ease: "power1.out"
						})
					}
				}
			}

		}

		// Scale Effect
		if("scale" in motionData) {

			const direction = motionData.scale.direction;
			const status = motionData.scale.status;
			const viewport = motionData.scale.viewport;
			const startValue = motionData.scale.startValue;
			const midValue = motionData.scale.midValue;
			const endValue = motionData.scale.endValue;

			if(!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "top "+ viewport[2] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "center "+ viewport[1] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "bottom "+ viewport[0] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				if(direction === 'up') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							scale: startValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							scale: midValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							scale: endValue,
							duration: 1,
							ease: "power1.out"
						})
					}
				}
				if(direction === 'down') {
					if(startValue !== 0) {
						motionTimeLineTop.from(".maxi-motion-effect-"+ motionID +"", {
							scale: startValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.from(".maxi-motion-effect-"+ motionID +"", {
							scale: midValue,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.from(".maxi-motion-effect-"+ motionID +"", {
							scale: endValue,
							duration: 1,
							ease: "power1.out"
						})
					}
				}
			}

		}

		// Fade Effect
		if("fade" in motionData) {

			const direction = motionData.fade.direction;
			const status = motionData.fade.status;
			const viewport = motionData.fade.viewport;
			const startValue = motionData.fade.startValue;
			const midValue = motionData.fade.midValue;
			const endValue = motionData.fade.endValue;

			if(!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "top "+ viewport[2] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "center "+ viewport[1] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "bottom "+ viewport[0] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				if(direction === 'in') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							opacity: startValue / 10,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							opacity: midValue / 10,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							opacity: endValue / 10,
							duration: 1,
							ease: "power1.out"
						})
					}
				}
				if(direction === 'out') {
					if(startValue !== 0) {
						motionTimeLineTop.from(".maxi-motion-effect-"+ motionID +"", {
							opacity: startValue / 10,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.from(".maxi-motion-effect-"+ motionID +"", {
							opacity: midValue / 10,
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.from(".maxi-motion-effect-"+ motionID +"", {
							opacity: endValue / 10,
							duration: 1,
							ease: "power1.out"
						})
					}
				}
			}

		}

		// Blur Effect
		if("blur" in motionData) {

			const direction = motionData.blur.direction;
			const status = motionData.blur.status;
			const viewport = motionData.blur.viewport;
			const startValue = motionData.blur.startValue;
			const midValue = motionData.blur.midValue;
			const endValue = motionData.blur.endValue;

			if(!!parseInt(status)) {
				const motionTimeLineTop = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "top "+ viewport[2] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineMid = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "center "+ viewport[1] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				const motionTimeLineBottom = gsap.timeline({
					scrollTrigger: {
						trigger: ".maxi-motion-effect-"+ motionID +"",
						start: "bottom "+ viewport[0] +"%",
						scrub: true,
						markers: false,
						onEnter: self => {
							self.trigger = elem;
						},
					}
				});
				if(direction === 'in') {
					if(startValue !== 0) {
						motionTimeLineTop.to(".maxi-motion-effect-"+ motionID +"", {
							webkitFilter: "blur("+ startValue +"px)",
							filter: "blur("+ startValue +"px)",
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.to(".maxi-motion-effect-"+ motionID +"", {
							webkitFilter: "blur("+ midValue +"px)",
							filter: "blur("+ midValue +"px)",
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.to(".maxi-motion-effect-"+ motionID +"", {
							webkitFilter: "blur("+ endValue +"px)",
							filter: "blur("+ endValue +"px)",
							duration: 1,
							ease: "power1.out"
						})
					}
				}
				if(direction === 'out') {
					if(startValue !== 0) {
						motionTimeLineTop.from(".maxi-motion-effect-"+ motionID +"", {
							webkitFilter: "blur("+ startValue +"px)",
							filter: "blur("+ startValue +"px)",
							duration: 1,
							ease: "power1.out"
						})
					}
					if(midValue !== 0) {
						motionTimeLineMid.from(".maxi-motion-effect-"+ motionID +"", {
							webkitFilter: "blur("+ midValue +"px)",
							filter: "blur("+ midValue +"px)",
							duration: 1,
							ease: "power1.out"
						})
					}
					if(endValue !== 0) {
						motionTimeLineBottom.from(".maxi-motion-effect-"+ motionID +"", {
							webkitFilter: "blur("+ endValue +"px)",
							filter: "blur("+ endValue +"px)",
							duration: 1,
							ease: "power1.out"
						})
					}
				}
			}

		}

	}

});