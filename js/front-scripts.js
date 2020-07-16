gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.matchMedia({

  "all": function () {
    ScrollTrigger.batch(".maxi-shape-divider", {
      start: "-150",
      onEnter: (batch) => gsap.to(batch, { height: 0 }),
      onLeave: (batch) => gsap.to(batch, { height: batch[0].getAttribute('data-height') }),
      onEnterBack: (batch) => gsap.to(batch, { height: 0 }),
      onLeaveBack: (batch) => gsap.to(batch, { height: batch[0].getAttribute('data-height') })
    });
  }

});