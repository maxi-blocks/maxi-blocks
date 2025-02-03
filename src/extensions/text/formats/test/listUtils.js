/**
 * Internal dependencies
 */
import { fromListToText, fromTextToList } from '../listUtils';

describe('listUtils', () => {
	describe('fromListToText', () => {
		it('Converts list HTML to plain text with line breaks', () => {
			const input =
				'<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
			const expected = '<br>Item 1<br>Item 2<br>Item 3';

			expect(fromListToText(input)).toBe(expected);
		});

		it('Handles ordered lists', () => {
			const input =
				'<ol><li>First</li><li>Second</li><li>Third</li></ol>';
			const expected = '<br>First<br>Second<br>Third';

			expect(fromListToText(input)).toBe(expected);
		});

		it('Handles mixed case tags', () => {
			const input = '<UL><LI>Test 1</Li><li>Test 2</LI></ul>';
			const expected = '<br>Test 1<br>Test 2';

			expect(fromListToText(input)).toBe(expected);
		});

		it('Handles empty list', () => {
			const input = '<ul></ul>';
			const expected = '<br>';

			expect(fromListToText(input)).toBe(expected);
		});
	});

	describe('fromTextToList', () => {
		it('Converts line breaks to list items', () => {
			const input = 'Item 1<br>Item 2<br>Item 3';
			const expected = '<li>Item 1</li><li>Item 2</li><li>Item 3</li>';

			expect(fromTextToList(input)).toBe(expected);
		});

		it('Handles text without line breaks', () => {
			const input = 'Single item';
			const expected = '<li>Single item</li>';

			expect(fromTextToList(input)).toBe(expected);
		});

		it('Handles mixed case br tags', () => {
			const input = 'Test 1<BR>Test 2<Br>Test 3';
			const expected = '<li>Test 1</li><li>Test 2</li><li>Test 3</li>';

			expect(fromTextToList(input)).toBe(expected);
		});

		it('Handles empty string', () => {
			const input = '';
			const expected = '<li></li>';

			expect(fromTextToList(input)).toBe(expected);
		});
	});
});
