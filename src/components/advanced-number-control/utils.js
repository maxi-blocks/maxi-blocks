const validateNumberInput = event => {
	// Allow backspace, delete, enter, and navigation keys
	if (/[a-zA-Z]^e/.test(event.key)) event.preventDefault();
};

export default validateNumberInput;
