const checkMediaQuery = () => {
	let breakpoint = 'general';
	const winWIdth = window.innerWidth;
	if (winWIdth <= 480) breakpoint = 'xs';
	if (winWIdth > 480 && winWIdth <= 768) breakpoint = 's';
	if (winWIdth > 768 && winWIdth <= 1024) breakpoint = 'm';
	if (winWIdth > 1024 && winWIdth <= 1366) breakpoint = 'l';
	if (winWIdth > 1366 && winWIdth <= 1920) breakpoint = 'general';
	if (winWIdth > 1920) breakpoint = 'xxl';
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
									: '<tspan baseline-shift="super">%</tspan>';

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

				const winSize = checkMediaQuery();
				setNewDyAttribute(numberCounterElemText, numberData, winSize);

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
				window.addEventListener('resize', () => {
					const winSize = checkMediaQuery();
					setNewDyAttribute(
						numberCounterElemText,
						numberData,
						winSize
					);
				});
			}
		}
	});
};

// eslint-disable-next-line @wordpress/no-global-event-listener
const setNewDyAttribute = (elem, numberData, winSize) => {
	const fontSize = getTitleFontSize(numberData, winSize);
	elem.setAttribute(
		'dy',
		`${Math.round((fontSize / 4 + Number.EPSILON) * 100) / 100}px`
	);
};

const getTitleFontSize = (numberData, winSize) => {
	const breakpoints = ['xs', 's', 'm', 'l', 'general', 'xxl'];
	if (numberData[`number-counter-title-font-size-${winSize}`]) {
		return numberData[`number-counter-title-font-size-${winSize}`];
	} else {
		const winIndex = breakpoints.indexOf(winSize);
		return getTitleFontSize(numberData, breakpoints[winIndex + 1]);
	}
};

window.addEventListener('load', numberCounterEffect);
