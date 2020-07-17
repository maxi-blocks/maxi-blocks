gsap.registerPlugin(ScrollTrigger);

// Shape Divider Effects
ScrollTrigger.matchMedia({

    "all": function() {
        ScrollTrigger.batch(".maxi-shape-divider", {
            start: "-150",
            onEnter: (batch) => gsap.to(batch, {
                height: 0
            }),
            onLeave: (batch) => gsap.to(batch, {
                height: batch[0].getAttribute('data-height')
            }),
            onEnterBack: (batch) => gsap.to(batch, {
                height: 0
            }),
            onLeaveBack: (batch) => gsap.to(batch, {
                height: batch[0].getAttribute('data-height')
            })
        });
    }

});

// Motion Effects
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

const motionElems = document.querySelectorAll(".maxi-motion-effect");
motionElems.forEach(function(elem) {

	const motionID = elem.getAttribute('data-motion-id');
	const motionData = JSON.parse(elem.getAttribute('data-motion'));
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
				markers: true,
				onEnter: self => {
					self.trigger = elem;
				},
			}
		});
		motionTimeLine.to(".maxi-motion-effect-"+ motionID +"", {
			y: (direction === 'up') ? ((currentSpeed * vw) / maxSpeed) : -((currentSpeed * vw) / maxSpeed),
			duration: 1,
			ease: "power1.out"
		});
	}

});





// const motionElems = document.querySelectorAll(".maxi-motion-effect");
// motionElems.forEach(function(elem) {
// 	const motionID = elem.getAttribute('data-motion-id');
// 	const motionData = JSON.parse(elem.getAttribute('data-motion'));

// 	const maxSpeed = 10;
// 	const currentSpeed = motionData.vertical.speed;
// 	const direction = motionData.vertical.direction;
// 	const status = motionData.vertical.status;
// 	const viewportTop = motionData.vertical.viewportTop;
// 	const viewportBottom = motionData.vertical.viewportBottom;
// 	const motionTimeLine = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: ".maxi-motion-effect-"+ motionID +"",
// 			start: "top "+ viewportTop +"%",
// 			end: "bottom "+ viewportBottom +"%",
// 			scrub: 1,
// 			markers: true,
// 			onEnter: self => {
// 				self.trigger = elem;
// 			},
// 		}
// 	});
// 	motionTimeLine.to(".maxi-motion-effect-"+ motionID +"", {
// 		x: (direction === 'right') ? ((currentSpeed * vw) / maxSpeed) : -((currentSpeed * vw) / maxSpeed),
// 		duration: 1,
// 		ease: "power1.out"
// 	});

// });