// GSAP PLugins
gsap.registerPlugin(ScrollTrigger);

// Get Width & Height Screen
let vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
);
window.addEventListener("resize", function() {
    vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );
});

// Shape Divider Effects
// ScrollTrigger.matchMedia({
//     "all": function() {
//         ScrollTrigger.batch(".maxi-shape-divider", {
//             start: "-150",
//             onEnter: (batch) => gsap.to(batch, {
//                 height: 0
//             }),
//             onLeave: (batch) => gsap.to(batch, {
//                 height: batch[0].getAttribute('data-height')
//             }),
//             onEnterBack: (batch) => gsap.to(batch, {
//                 height: 0
//             }),
//             onLeaveBack: (batch) => gsap.to(batch, {
//                 height: batch[0].getAttribute('data-height')
//             })
//         });
//     }
// });

// Motion Effects
const motionElems = document.querySelectorAll(".maxi-motion-effect");
motionElems.forEach(function(elem) {

	const motionID = elem.getAttribute('data-motion-id');
	const motionData = JSON.parse(elem.getAttribute('data-motion'));
	const shapeDividerData = JSON.parse(elem.getAttribute('data-shape-divider'));

	const motionTimeLine = gsap.timeline({
		scrollTrigger: {
			trigger: ".maxi-motion-effect-"+ motionID +" > .maxi-shape-divider",
			start: "-150",
			scrub: 1,
			//markers: true,
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

	if("vertical" in motionData) {

		const maxSpeed = 10;
		const currentSpeed = motionData.vertical.speed;
		const direction = motionData.vertical.direction;
		const status = motionData.vertical.status;
		const viewportTop = motionData.vertical.viewportTop;
		const viewportBottom = motionData.vertical.viewportBottom;

		if(!!parseInt(status)) {
			const motionTimeLine = gsap.timeline({
				scrollTrigger: {
					trigger: ".maxi-motion-effect-"+ motionID +"",
					start: "top "+ viewportTop +"%",
					end: "bottom "+ viewportBottom +"%",
					scrub: 1,
					//markers: true,
					onEnter: self => {
						self.trigger = elem;
					},
				}
			});
			motionTimeLine.to(".maxi-motion-effect-"+ motionID +"", {
				y: (direction === 'up') ?
					((currentSpeed * vw) / maxSpeed) :
					-((currentSpeed * vw) / maxSpeed),
				duration: 1,
				ease: "power1.out"
			});
		}
	}

	if("horizontal" in motionData) {

		const maxSpeed = 10;
		const currentSpeed = motionData.horizontal.speed;
		const direction = motionData.horizontal.direction;
		const status = motionData.horizontal.status;
		const viewportTop = motionData.horizontal.viewportTop;
		const viewportBottom = motionData.horizontal.viewportBottom;

		if(!!parseInt(status)) {
			const motionTimeLine = gsap.timeline({
				scrollTrigger: {
					trigger: ".maxi-motion-effect-"+ motionID +"",
					start: "top "+ viewportTop +"%",
					end: "bottom "+ viewportBottom +"%",
					scrub: 1,
					//markers: true,
					onEnter: self => {
						self.trigger = elem;
					},
				}
			});
			motionTimeLine.to(".maxi-motion-effect-"+ motionID +"", {
				x: (direction === 'left') ?
					-((currentSpeed * vw) / maxSpeed) :
					((currentSpeed * vw) / maxSpeed),
				duration: 1,
				ease: "power1.out"
			});
		}
	}

	if("rotate" in motionData) {

		const maxSpeed = 10;
		const currentSpeed = motionData.rotate.speed;
		const direction = motionData.rotate.direction;
		const status = motionData.rotate.status;
		const viewportTop = motionData.rotate.viewportTop;
		const viewportBottom = motionData.rotate.viewportBottom;

		if(!!parseInt(status)) {
			const motionTimeLine = gsap.timeline({
				scrollTrigger: {
					trigger: ".maxi-motion-effect-"+ motionID +"",
					start: "top "+ viewportTop +"%",
					end: "bottom "+ viewportBottom +"%",
					scrub: 1,
					//markers: true,
					onEnter: self => {
						self.trigger = elem;
					},
				}
			});
			motionTimeLine.to(".maxi-motion-effect-"+ motionID +"", {
				rotation: (direction === 'left') ?
					-((currentSpeed * vw) / maxSpeed) :
					((currentSpeed * vw) / maxSpeed),
				duration: 1,
				ease: "power1.out"
			});
		}
	}

	if("scale" in motionData) {

		const currentSpeed = motionData.scale.speed;
		const direction = motionData.scale.direction;
		const status = motionData.scale.status;
		const viewportTop = motionData.scale.viewportTop;
		const viewportBottom = motionData.scale.viewportBottom;

		if(!!parseInt(status)) {
			const motionTimeLine = gsap.timeline({
				scrollTrigger: {
					trigger: ".maxi-motion-effect-"+ motionID +"",
					start: "top "+ viewportTop +"%",
					end: "bottom "+ viewportBottom +"%",
					scrub: 1,
					//markers: true,
					onEnter: self => {
						self.trigger = elem;
					},
				}
			});
			motionTimeLine.to(".maxi-motion-effect-"+ motionID +"", {
				scale: (direction === 'up') ? -currentSpeed : currentSpeed,
				duration: 1,
				ease: "power1.out"
			});
		}
	}

	if("fade" in motionData) {

		const currentSpeed = motionData.fade.speed;
		const direction = motionData.fade.direction;
		const status = motionData.fade.status;
		const viewportTop = motionData.fade.viewportTop;
		const viewportBottom = motionData.fade.viewportBottom;

		if(!!parseInt(status)) {
			const motionTimeLine = gsap.timeline({
				scrollTrigger: {
					trigger: ".maxi-motion-effect-"+ motionID +"",
					start: "top "+ viewportTop +"%",
					end: "bottom "+ viewportBottom +"%",
					scrub: 1,
					//markers: true,
					onEnter: self => {
						self.trigger = elem;
					},
				}
			});
			if((direction === 'in')) {
				motionTimeLine.to(".maxi-motion-effect-"+ motionID +"", {
					opacity: (10 - currentSpeed) / 10,
					duration: 1,
					ease: "power1.out"
				});
			} else {
				motionTimeLine.from(".maxi-motion-effect-"+ motionID +"", {
					opacity: (10 - currentSpeed) / 10,
					duration: 1,
					ease: "power1.out"
				});
			}
		}
	}

	if("blur" in motionData) {

		const currentSpeed = motionData.blur.speed;
		const direction = motionData.blur.direction;
		const status = motionData.blur.status;
		const viewportTop = motionData.blur.viewportTop;
		const viewportBottom = motionData.blur.viewportBottom;

		if(!!parseInt(status)) {
			const motionTimeLine = gsap.timeline({
				scrollTrigger: {
					trigger: ".maxi-motion-effect-"+ motionID +"",
					start: "top "+ viewportTop +"%",
					end: "bottom "+ viewportBottom +"%",
					scrub: 1,
					//markers: true,
					onEnter: self => {
						self.trigger = elem;
					},
				}
			});
			if((direction === 'in')) {
				motionTimeLine.to(".maxi-motion-effect-"+ motionID +"", {
					filter: "-webkit-filter-blur("+ currentSpeed +"px); blur("+ currentSpeed +"px)",
					duration: 1,
					ease: "power1.out"
				});
			} else {
				motionTimeLine.from(".maxi-motion-effect-"+ motionID +"", {
					filter: "blur("+ currentSpeed +"px)",
					duration: 1,
					ease: "power1.out"
				});
			}
		}
	}

});