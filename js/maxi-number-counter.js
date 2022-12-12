const checkMediaQuery = numberID => {
	if (!maxiNumberCounter[0][numberID]) return;
	const { breakpoints } = maxiNumberCounter[0][numberID];
	const brkArray = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
	let breakpoint = 'xl';
	const winWIdth = window.innerWidth;
	for (const brpt of brkArray) {
		if (winWIdth <= breakpoints[brpt]) {
			breakpoint = brpt;
			break;
		}
	}
	breakpoint = breakpoint === 'xl' ? 'general' : breakpoint;

	return breakpoint;
};
// Number Counter Effects
const numberCounterEffect = () => {
	const numberElements = document.querySelectorAll('.maxi-nc-effect');
	numberElements.forEach(elem => {
		// eslint-disable-next-line no-undef
		if (!maxiNumberCounter) return;
		const numberID = elem.id;

		const numberData =
			// eslint-disable-next-line no-undef
			maxiNumberCounter[0][numberID] !== undefined
				? // eslint-disable-next-line no-undef
				  maxiNumberCounter[0][numberID]
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
					'number-counter-start-animation-offset':
						startAnimationOffset,
				} = numberData;
				const startCountValue = +numberCounterStart;
				const endCountValue = +numberCounterEnd;

				const frameDuration =
					(1 /
						((endCountValue - startCountValue) /
							numberCounterDuration)) *
					1000;

				let count = startCountValue;
				let startTime;
				let hasAnimated = false;

				const animate = () => {
					const newCount =
						startCountValue +
						parseInt((Date.now() - startTime) / frameDuration);

					if (newCount === count) {
						requestAnimationFrame(animate);
						return;
					}
					count = newCount > endCountValue ? endCountValue : newCount;

					let newInnerHTML = `${count}`;

					if (usePercentage) {
						const percentageNode =
							numberCounterElemText.nodeName === 'SPAN'
								? '<sup>%</sup>'
								: '<tspan baseline-shift="super">%</tspan>';

						newInnerHTML += percentageNode;
					}

					numberCounterElemText.innerHTML = newInnerHTML;

					numberCounterElemCircle &&
						numberCounterElemCircle.setAttribute(
							'stroke-dasharray',
							`${Math.ceil(
								(count / 100) * circumference
							)} ${circumference}`
						);
					if (count < endCountValue) requestAnimationFrame(animate);
				};

				const startCounter = () => {
					startTime = Date.now();
					requestAnimationFrame(animate);
				};

				const breakpoint = checkMediaQuery(numberID);
				setNewDyAttribute(
					numberCounterElemText,
					numberData,
					breakpoint
				);

				if (startAnimation === 'view-scroll') {
					// eslint-disable-next-line no-unused-vars, no-undef
					const waypoint = new Waypoint({
						element: numberCounterElem,
						handler() {
							if (!hasAnimated) {
								hasAnimated = true;
								startCounter();
							}
						},

						offset: `${startAnimationOffset || 100}%`,
					});
				} else {
					startCounter();
				}
				window.addEventListener('resize', () => {
					const breakpoint = checkMediaQuery(numberID);
					setNewDyAttribute(
						numberCounterElemText,
						numberData,
						breakpoint
					);
				});
			}
		}
	});
};

// eslint-disable-next-line @wordpress/no-global-event-listener
const setNewDyAttribute = (elem, numberData, breakpoint) => {
	const fontSize = getTitleFontSize(numberData, breakpoint);
	elem.setAttribute(
		'dy',
		`${Math.round((fontSize / 4 + Number.EPSILON) * 100) / 100}px`
	);
};

const getTitleFontSize = (numberData, breakpoint) => {
	const breakpoints = ['xs', 's', 'm', 'l', 'general', 'xxl'];
	if (numberData[`number-counter-title-font-size-${breakpoint}`]) {
		return numberData[`number-counter-title-font-size-${breakpoint}`];
	}
	const winIndex = breakpoints.indexOf(breakpoint);
	return getTitleFontSize(numberData, breakpoints[winIndex + 1]);
};

window.addEventListener('load', numberCounterEffect);
