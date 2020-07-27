// GSAP PLugins
gsap.registerPlugin(ScrollTrigger);

// Motion Effects
const motionElems = document.querySelectorAll(".maxi-motion-effect");
motionElems.forEach(function(elem) {

	const motionID = elem.getAttribute('data-motion-id');
	const motionData = JSON.parse(elem.getAttribute('data-motion'));
	const shapeDividerData = JSON.parse(elem.getAttribute('data-shape-divider'));

	if(shapeDividerData !== null) {
		const motionTimeLine = gsap.timeline({
			scrollTrigger: {
				trigger: ".maxi-motion-effect-"+ motionID +" > .maxi-shape-divider",
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