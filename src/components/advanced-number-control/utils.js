const validateNumberInput = event => {
	if (
		/[a-zA-Z]/.test(event.key) &&
		event.key !== 'e' &&
		event.key.length === 1 &&
		!event.ctrlKey &&
		!event.altKey &&
		!event.metaKey
	)
		event.preventDefault();
};

export default validateNumberInput;
