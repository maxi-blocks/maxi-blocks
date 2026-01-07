const validateNumberInput = (event, regex = /[a-zA-Z]/) => {
	if (!regex) return;

	if (
		regex.test(event.key) &&
		event.key !== 'e' &&
		event.key.length === 1 &&
		!event.ctrlKey &&
		!event.altKey &&
		!event.metaKey
	)
		event.preventDefault();
};

export default validateNumberInput;
