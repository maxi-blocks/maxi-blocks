import setCustomFormatsWhenPaste from '@extensions/text/formats/setCustomFormatsWhenPaste';

jest.mock('@wordpress/data', () => ({
	dispatch: jest.fn(() => ({
		__unstableMarkLastChangeAsPersistent: jest.fn(),
	})),
	select: jest.fn(() => ({
		receiveMaxiSelectedStyleCard: jest.fn(() => ({ value: {} })),
	})),
}));
jest.mock('@extensions/styles', () => ({
	getBlockStyle: jest.fn(() => 'light'),
}));
jest.mock('@extensions/style-cards', () => ({
	updateSCOnEditor: jest.fn(),
	getTypographyFromSC: jest.fn(() => ({})),
}));

const strikeThroughObject = {
	formatValue: {
		activeFormats: [
			{
				tagName: 'del',
				type: 'core/strikethrough',
			},
		],
		formats: Array(12).fill(
			[
				{
					type: 'core/strikethrough',
				},
			],
			6,
			11
		),
		replacements: Array(12),
		text: 'Hello world!',
		start: 1,
		end: 1,
	},
	typography: {},
	textLevel: 'p',
	typeOfList: 'ul',
	content: 'Hello <del>world</del>!',
};

const underlineObject = {
	...strikeThroughObject,
	formatValue: {
		...strikeThroughObject.formatValue,
		activeFormats: [
			{
				attributes: {
					style: 'text-decoration: underline',
				},
				type: 'core/underline',
			},
		],
		formats: Array(12).fill(
			[
				{
					attributes: {
						style: 'text-decoration: underline',
					},
					type: 'core/underline',
				},
			],
			6,
			11
		),
	},
	content: 'Hello <span style="text-decoration: underline">world</span>!',
};

const italicObject = {
	...strikeThroughObject,
	formatValue: {
		...strikeThroughObject.formatValue,
		activeFormats: [
			{
				tagName: 'em',
				type: 'core/italic',
			},
		],
		formats: Array(12).fill(
			[
				{
					tagName: 'em',
					type: 'core/italic',
				},
			],
			6,
			11
		),
	},
	content: 'Hello <em>world</em>!',
};

const boldObject = {
	...strikeThroughObject,
	formatValue: {
		...strikeThroughObject.formatValue,
		activeFormats: [
			{
				tagName: 'strong',
				type: 'core/bold',
			},
		],
		formats: Array(12).fill(
			[
				{
					tagName: 'strong',
					type: 'core/bold',
				},
			],
			6,
			11
		),
	},
	content: 'Hello <strong>world</strong>!',
};

const linkObject = {
	...strikeThroughObject,
	formatValue: {
		...strikeThroughObject.formatValue,
		activeFormats: [
			{
				attributes: {
					url: 'http://test.com',
				},
				tagName: 'a',
				type: 'core/link',
			},
		],
		formats: Array(12).fill(
			[
				{
					attributes: {
						url: 'http://test.com',
					},
					tagName: 'a',
					type: 'core/link',
				},
			],
			6,
			11
		),
	},
	content: 'Hello <a href="http://test.com">world</a>!',
};

const subscriptObject = {
	...strikeThroughObject,
	formatValue: {
		...strikeThroughObject.formatValue,
		activeFormats: [
			{
				tagName: 'sub',
				type: 'core/subscript',
			},
		],
		formats: Array(12).fill(
			[
				{
					tagName: 'sub',
					type: 'core/subscript',
				},
			],
			6,
			11
		),
	},
	content: 'Hello <sub>world</sub>!',
};

const superscriptObject = {
	...strikeThroughObject,
	formatValue: {
		...strikeThroughObject.formatValue,
		activeFormats: [
			{
				tagName: 'sup',
				type: 'core/superscript',
			},
		],
		formats: Array(12).fill(
			[
				{
					tagName: 'sup',
					type: 'core/superscript',
				},
			],
			6,
			11
		),
	},
	content: 'Hello <sup>world</sup>!',
};

const removeUndefined = obj => {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => value !== undefined)
	);
};

describe('setCustomFormatsWhenPaste', () => {
	it('Should update custom formats when pasting text with core/strikethrough', () => {
		const result = setCustomFormatsWhenPaste(strikeThroughObject);

		expect(removeUndefined(result)).toMatchSnapshot();
	});

	it('Should update custom formats when pasting text with core/underline', () => {
		const result = setCustomFormatsWhenPaste(underlineObject);
		expect(removeUndefined(result)).toMatchSnapshot();
	});

	it('Should update custom formats when pasting text with core/italic', () => {
		const result = setCustomFormatsWhenPaste(italicObject);
		expect(removeUndefined(result)).toMatchSnapshot();
	});

	it('Should update custom formats when pasting text with core/bold', () => {
		const result = setCustomFormatsWhenPaste(boldObject);
		expect(removeUndefined(result)).toMatchSnapshot();
	});

	it('Should update custom formats when pasting text with core/link', () => {
		const result = setCustomFormatsWhenPaste(linkObject);
		expect(removeUndefined(result)).toMatchSnapshot();
	});

	it('Should update custom formats when pasting text with core/subscript', () => {
		const result = setCustomFormatsWhenPaste(subscriptObject);
		expect(removeUndefined(result)).toMatchSnapshot();
	});

	it('Should update custom formats when pasting text with core/superscript', () => {
		const result = setCustomFormatsWhenPaste(superscriptObject);
		expect(removeUndefined(result)).toMatchSnapshot();
	});
});
