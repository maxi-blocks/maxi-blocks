/* eslint-disable no-undef */
const checkMediaQuery = numberID => {
	const data = maxiNumberCounter[0][numberID];
	if (!data) return;

	let breakpoints;
	if (typeof data === 'string') {
		try {
			breakpoints = JSON.parse(data).breakpoints;
		} catch (e) {
			console.error('Invalid JSON string', e);
			return;
		}
	} else if (typeof data === 'object' && data !== null) {
		breakpoints = data.breakpoints;
	}

	const brkArray = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
	const winWidth = window.innerWidth;
	const matchedBreakpoint = brkArray.find(
		brpt => winWidth <= breakpoints[brpt]
	);
	// eslint-disable-next-line consistent-return
	return matchedBreakpoint || 'general';
};

const getTitleFontSize = (numberData, breakpoint) => {
	const breakpoints = ['xs', 's', 'm', 'l', 'general', 'xxl'];
	if (numberData[`number-counter-title-font-size-${breakpoint}`]) {
		return numberData[`number-counter-title-font-size-${breakpoint}`];
	}
	const nextIndex = breakpoints.indexOf(breakpoint) + 1;
	if (nextIndex < breakpoints.length) {
		return getTitleFontSize(numberData, breakpoints[nextIndex]);
	}
	return null;
};

const setNewDyAttribute = (elem, numberData, breakpoint) => {
	const fontSize = getTitleFontSize(numberData, breakpoint);
	if (fontSize) {
		elem.setAttribute(
			'dy',
			`${Math.round((fontSize / 4 + Number.EPSILON) * 100) / 100}px`
		);
	}
};

const startCounterAnimation = (
	elemText,
	numberData,
	startCountValue,
	endCountValue,
	frameDuration,
	elemCircle,
	circumference
) => {
	let count = startCountValue;
	let startTime;

	const animate = () => {
		const elapsed = Date.now() - startTime;
		const newCount = startCountValue + Math.floor(elapsed / frameDuration);
		count = Math.min(newCount, endCountValue);
		elemText.innerHTML = `${count}${
			numberData['number-counter-percentage-sign-status']
				? numberData['number-counter-percentage-sign-position-status']
					? '%'
					: '<sup>%</sup>'
				: ''
		}`;
		if (elemCircle) {
			elemCircle.setAttribute(
				'stroke-dasharray',
				`${Math.ceil((count / 100) * circumference)} ${circumference}`
			);
		}
		if (count < endCountValue) requestAnimationFrame(animate);
	};

	startTime = Date.now();
	requestAnimationFrame(animate);
};

const initializeWaypoint = (element, handler, offset) => {
	return new Waypoint({
		element,
		handler,
		offset: `${offset}%`,
	});
};

const numberCounterEffect = () => {
	const numberElements = document.querySelectorAll('.maxi-nc-effect');

	numberElements.forEach(elem => {
		const numberID = elem.id;
		const numberDataRaw = maxiNumberCounter[0][numberID];

		if (!numberDataRaw) return;

		let numberData;
		if (typeof numberDataRaw === 'string') {
			try {
				numberData = JSON.parse(numberDataRaw);
			} catch (e) {
				console.error('Invalid JSON string', e);
				return;
			}
		} else if (
			typeof numberDataRaw === 'object' &&
			numberDataRaw !== null
		) {
			numberData = numberDataRaw;
		} else {
			return;
		}

		const numberCounterElems = elem.querySelectorAll(
			'.maxi-number-counter__box'
		);
		const numberCounterElemTexts = elem.querySelectorAll(
			'.maxi-number-counter__box__text'
		);
		const numberCounterElemCircles = elem.querySelectorAll(
			'.maxi-number-counter__box__circle'
		);

		numberCounterElems.forEach((numberCounterElem, index) => {
			const numberCounterElemText = numberCounterElemTexts[index];
			const numberCounterElemCircle = numberCounterElemCircles[index];

			const start = parseFloat(numberData['number-counter-start']);
			const end = parseFloat(numberData['number-counter-end']);
			const duration = parseFloat(numberData['number-counter-duration']);

			if (
				Number.isNaN(start) ||
				Number.isNaN(end) ||
				Number.isNaN(duration)
			) {
				console.error('Invalid number data', numberData);
				return;
			}

			const frameDuration = (1 / ((end - start) / duration)) * 1000;
			const radius = 90;
			const circumference = 2 * Math.PI * radius;

			const breakpoint = checkMediaQuery(numberID);
			setNewDyAttribute(numberCounterElemText, numberData, breakpoint);

			if (
				numberData['number-counter-start-animation'] === 'view-scroll'
			) {
				initializeWaypoint(
					numberCounterElem,
					() =>
						startCounterAnimation(
							numberCounterElemText,
							numberData,
							start,
							end,
							frameDuration,
							numberCounterElemCircle,
							circumference
						),
					numberData['number-counter-start-animation-offset'] || 100
				);
			} else {
				startCounterAnimation(
					numberCounterElemText,
					numberData,
					start,
					end,
					frameDuration,
					numberCounterElemCircle,
					circumference
				);
			}

			window.addEventListener('resize', () => {
				const newBreakpoint = checkMediaQuery(numberID);
				setNewDyAttribute(
					numberCounterElemText,
					numberData,
					newBreakpoint
				);
			});
		});
	});
};

window.addEventListener('load', numberCounterEffect);
