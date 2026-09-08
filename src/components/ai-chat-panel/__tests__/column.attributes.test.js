import {
	COLUMN_PATTERNS,
	handleColumnUpdate,
	getColumnSidebarTarget,
} from '../ai/blocks/column';

const matchPattern = message =>
	COLUMN_PATTERNS.find(pattern => pattern.regex.test(message));

const columnBlock = {
	name: 'maxi-blocks/column-maxi',
	attributes: {},
};

describe('column prompt patterns', () => {
	test.each([
		[
			'Set column to fit content',
			{ property: 'column_fit_content', value: true },
		],
		[
			'Disable fit content for this column',
			{ property: 'column_fit_content', value: false },
		],
		[
			'Set column width to 40%',
			{ property: 'column_size', value: 'use_prompt' },
		],
	])('matches "%s"', (message, expected) => {
		const pattern = matchPattern(message);
		expect(pattern).toBeTruthy();
		expect(pattern.property).toBe(expected.property);
		expect(pattern.value).toBe(expected.value);
	});
});

describe('column prompt to attributes', () => {
	test('maps column size to attributes', () => {
		const changes = handleColumnUpdate(columnBlock, 'column_size', 40, '');
		expect(changes).toEqual({
			'column-size-general': 40,
			'column-fit-content-general': false,
		});
	});

	test('maps column size from percent string', () => {
		const changes = handleColumnUpdate(
			columnBlock,
			'column_size',
			'25%',
			''
		);
		expect(changes).toEqual({
			'column-size-general': 25,
			'column-fit-content-general': false,
		});
	});

	test('maps fit content toggle', () => {
		const changes = handleColumnUpdate(
			columnBlock,
			'column_fit_content',
			true,
			''
		);
		expect(changes).toEqual({
			'column-fit-content-general': true,
		});
	});
});

describe('column sidebar targets', () => {
	test.each([
		['column_size', { tabIndex: 0, accordion: 'column settings' }],
		['column_fit_content', { tabIndex: 0, accordion: 'column settings' }],
		['columnSize', { tabIndex: 0, accordion: 'column settings' }],
		['columnFitContent', { tabIndex: 0, accordion: 'column settings' }],
	])('maps %s', (property, expected) => {
		const sidebar = getColumnSidebarTarget(property);
		expect(sidebar).toEqual(expected);
	});
});
