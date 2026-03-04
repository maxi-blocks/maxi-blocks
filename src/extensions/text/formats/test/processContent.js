import processContent from '@extensions/text/formats/processContent';

describe('processContent', () => {
	let onChange;
	let setTypingTimeoutContent;

	beforeEach(() => {
		jest.useFakeTimers();
		onChange = jest.fn();
		setTypingTimeoutContent = jest.fn();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.clearAllMocks();
	});

	it('Should do nothing if rawContent equals attributesContent', () => {
		const content = 'test content';

		processContent(
			content,
			content,
			null,
			onChange,
			setTypingTimeoutContent
		);

		expect(onChange).not.toHaveBeenCalled();
		expect(setTypingTimeoutContent).not.toHaveBeenCalled();
	});

	it('Should replace trailing space with &nbsp; in Firefox', () => {
		const rawContent = 'Hello world ';
		const expectedContent = 'Hello world&nbsp;';

		processContent(rawContent, '', null, onChange, setTypingTimeoutContent);

		jest.runAllTimers();

		expect(onChange).toHaveBeenCalledWith({ content: expectedContent });
	});

	it('Should not replace spaces within HTML tags', () => {
		const rawContent = '<span class="test"> </span>';

		processContent(rawContent, '', null, onChange, setTypingTimeoutContent);

		jest.runAllTimers();

		expect(onChange).toHaveBeenCalledWith({ content: rawContent });
	});

	it('Should clear existing timeout when setting new content', () => {
		const originalClearTimeout = global.clearTimeout;
		global.clearTimeout = jest.fn();

		const existingTimeout = setTimeout(() => {}, 1000);
		const rawContent = 'new content';

		processContent(
			rawContent,
			'',
			existingTimeout,
			onChange,
			setTypingTimeoutContent
		);

		expect(global.clearTimeout).toHaveBeenCalledWith(existingTimeout);

		// Restore original clearTimeout
		global.clearTimeout = originalClearTimeout;
	});

	it('Should incorporate text after link into the link', () => {
		const rawContent = '<a href="https://example.com">Initial Link</a>!';
		const expectedContent =
			'<a href="https://example.com">Initial Link!</a>';

		processContent(rawContent, '', null, onChange, setTypingTimeoutContent);

		jest.runAllTimers();

		expect(onChange).toHaveBeenCalledWith({ content: expectedContent });
	});

	it('Should set typing timeout for non-link content', () => {
		const rawContent = 'regular content';

		processContent(rawContent, '', null, onChange, setTypingTimeoutContent);

		expect(setTypingTimeoutContent).toHaveBeenCalled();

		// Run the timeout callback
		jest.runAllTimers();

		expect(onChange).toHaveBeenCalledWith({ content: rawContent });
	});
});
