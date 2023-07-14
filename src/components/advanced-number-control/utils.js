const validateNumberInput = event => {
	// Allow backspace, delete, enter, and navigation keys
	if (!/[0-9]|[\b\t\r\n]|Arrow|e/.test(event.key)) event.preventDefault();
};

export default validateNumberInput;
