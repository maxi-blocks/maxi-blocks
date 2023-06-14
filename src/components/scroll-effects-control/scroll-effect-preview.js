const setTransform = (el, transform, type) => {
	const oldTransform = el.style.transform;

	if (oldTransform == null) {
		el.style.transform = transform;
		el.style.WebkitTransform = transform;
		return null;
	}

	const oldTransformArray = oldTransform.split(') ');

	oldTransformArray.forEach((transform, key) => {
		if (transform.includes(type)) oldTransformArray.splice(key, 2);
	});

	el.style.transform = oldTransformArray.join(' ') + transform;
	el.style.WebkitTransform = oldTransformArray.join(' ') + transform;

	return null;
};

export const removeEffect = (type, uniqueID) => {
	const el = document.querySelectorAll(
		`[class*='maxi-block'][uniqueID=${uniqueID}]`
	)[0];
	switch (type) {
		case 'rotate':
			setTransform(el, '', 'rotate');
			break;
		case 'fade':
			el.style.opacity = '';
			break;
		case 'scale':
			setTransform(el, '', 'scale');
			break;
		case 'blur':
			el.style.filter = '';
			break;
		case 'vertical':
			setTransform(el, '', 'vertical');
			break;
		case 'horizontal':
			setTransform(el, '', 'horizontal');
			break;
		default:
			break;
	}
};

export const applyEffect = (type, uniqueID, viewport) => {
	removeEffect(type, uniqueID);
	const element = document.querySelectorAll(
		`[class*='maxi-block'][uniqueID=${uniqueID}]`
	)[0];

	const scrollType = element?.getAttribute(
		`data-scroll-effect-${type}-general`
	);

	const effectSettings = data => {
		const response = {};

		const dataScrollArray = data?.trim().split(' ');

		response.speedValue = parseFloat(dataScrollArray[0]) || 200;
		response.delayValue = parseFloat(dataScrollArray[1]) || 0;
		response.easingValue = dataScrollArray[2] || 'ease';
		response.start = parseInt(dataScrollArray[5]);
		response.mid = parseInt(dataScrollArray[6]);
		response.end = parseInt(dataScrollArray[7]);

		return response;
	};

	const { speedValue, easingValue, delayValue, start, mid, end } =
		effectSettings(scrollType);

	const applyStyle = (el, type, value) => {
		switch (type) {
			case 'rotate':
				setTransform(el, `rotate(${value}deg)`, 'rotate');
				break;
			case 'fade':
				el.style.opacity = `${value}%`;
				break;
			case 'scale':
				setTransform(
					el,
					`scale3d(${value}%, ${value}%, ${value}%)`,
					'scale'
				);
				break;
			case 'blur':
				el.style.filter = `blur(${value}px)`;
				break;
			case 'vertical':
				setTransform(el, `translateY(${value}px)`, 'vertical');
				break;
			case 'horizontal':
				setTransform(el, `translateX(${value}px)`, 'horizontal');
				break;
			default:
				break;
		}

		return null;
	};

	let transition = '';

	switch (type) {
		case 'vertical':
			transition = `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
			break;
		case 'horizontal':
			transition = `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
			break;
		case 'rotate':
			transition = `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
			break;
		case 'scale':
			transition = `transform ${speedValue}ms ${easingValue} ${delayValue}ms, `;
			break;
		case 'fade':
			transition = `opacity ${speedValue}ms ${easingValue} ${delayValue}ms, `;
			break;
		case 'blur':
			transition = `filter ${speedValue}ms ${easingValue} ${delayValue}ms, `;
			break;
		default:
			break;
	}

	if (transition !== '')
		element.style.transition = transition.substring(
			0,
			transition.length - 2
		);

	switch (viewport) {
		case 'Start':
			applyStyle(element, type, start);
			break;
		case 'Mid':
			applyStyle(element, type, mid);
			break;
		case 'End':
			applyStyle(element, type, end);
			break;
		default:
			applyStyle(element, type, viewport);
			break;
	}
};
