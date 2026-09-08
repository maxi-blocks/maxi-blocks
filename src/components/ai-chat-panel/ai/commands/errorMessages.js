export const errorMessages = {
	unknownCommand: () => 'Command not recognized.',
	unknownAttribute: query => `Unknown attribute: ${query}`,
	ambiguousAttribute: query =>
		`Multiple attributes match "${query}". Please be more specific.`,
	invalidValue: (path, value) =>
		`Invalid value "${value}" for attribute "${path}".`,
	unsupportedOperation: op => `Operation "${op}" is not supported.`,
};

export default errorMessages;
