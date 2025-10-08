const validateNumberInput = (event, regex = /[a-zA-Z]/) => {
	// Allow disabling validation by passing a falsy regex
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
