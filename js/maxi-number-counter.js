// Number Counter Effects
const numberCounterEffect = () => {
	const numberElements = document.querySelectorAll('.maxi-nc-effect');
	numberElements.forEach((elem, ind) => {
		// eslint-disable-next-line no-undef
		if (!maxiNumberCounter) return;

		const numberID = elem.id;

		const numberData =
			// eslint-disable-next-line no-undef
			maxiNumberCounter[ind][numberID] !== undefined
				? // eslint-disable-next-line no-undef
				  maxiNumberCounter[ind][numberID]
				: null;

		if (numberData !== null) {
			// Number Counter
			if ('number-counter-status' in numberData) {
				const numberCounterElem = document.querySelector(
					`#${numberID} .maxi-number-counter__box`
				);
				const numberCounterElemText = document.querySelector(
					`#${numberID} .maxi-number-counter__box .maxi-number-counter__box__text`
				);
				const numberCounterElemCircle = document.querySelector(
					`#${numberID} .maxi-number-counter__box .maxi-number-counter__box__circle`
				);

				const radius = 90;
				const circumference = 2 * Math.PI * radius;
				const {
					'number-counter-start': numberCounterStart,
					'number-counter-end': numberCounterEnd,
					'number-counter-duration': numberCounterDuration,
					'number-counter-percentage-sign-status': usePercentage,
					'number-counter-start-animation': startAnimation,
				} = numberData;
				const startCountValue = Math.ceil(
					(numberCounterStart * 360) / 100
				);
				const endCountValue = Math.ceil((numberCounterEnd * 360) / 100);

				const frameDuration =
					(1 /
						((endCountValue - startCountValue) /
							numberCounterDuration)) *
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