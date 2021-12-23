// Number Counter Effects
const numberCounterEffect = () => {
	const motionElements = document.querySelectorAll('.maxi-nc-effect');
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
			// Number Counter
			if ('number-counter-status' in motionData) {
				const numberCounterElem = document.querySelector(
					`#${motionID} .maxi-number-counter__box`
				);
				const numberCounterElemText = document.querySelector(
					`#${motionID} .maxi-number-counter__box .maxi-number-counter__box__text`
				);
				const numberCounterElemCircle = document.querySelector(
					`#${motionID} .maxi-number-counter__box .maxi-number-counter__box__circle`
				);

				const radius = 90;
				const circumference = 2 * Math.PI * radius;
				const {
					'number-counter-start': motionCounterStart,
					'number-counter-end': motionCounterEnd,
					'number-counter-duration': motionCounterDuration,
					'number-counter-percentage-sign-status': usePercentage,
					'number-counter-start-animation': startAnimation,
				} = motionData;
				const startCountValue = Math.ceil(
					(motionCounterStart * 360) / 100
				);
				const endCountValue = Math.ceil((motionCounterEnd * 360) / 100);

				const frameDuration =
					(1 /
						((endCountValue - startCountValue) /
							motionCounterDuration)) *
					1000;

				let count = startCountValue;

				const startCounter = () => {
					const interval = setInterval(() => {
						count += 1;

						if (count >= endCountValue) {
							count = endCountValue;
							clearInterval(interval);
						}

						let newInnerHTML = `${parseInt((count / 360) * 100)}`;

						if (usePercentage) {
							const percentageNode =
								numberCounterElemText.nodeName === 'SPAN'
									? '<sup>%</sup>'
									: '<tspan baselineShift="super">%</tspan>';

							newInnerHTML += percentageNode;
						}

						numberCounterElemText.innerHTML = newInnerHTML;

						numberCounterElemCircle &&
							numberCounterElemCircle.setAttribute(
								'stroke-dasharray',
								`${parseInt(
									(count / 360) * circumference
								)} ${circumference}`
							);
					}, frameDuration);
				};

				if (startAnimation === 'view-scroll') {
					// eslint-disable-next-line no-unused-vars, no-undef
					const waypoint = new Waypoint({
						element: numberCounterElem,
						handler() {
							startCounter();
						},
						offset: '100%',
					});
				} else {
					startCounter();
				}
			}
		}
	});
};

// eslint-disable-next-line @wordpress/no-global-event-listener
window.addEventListener('load', numberCounterEffect);
