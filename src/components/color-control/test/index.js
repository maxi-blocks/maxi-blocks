/**
 * External dependencies
 */
import TestRenderer from 'react-test-renderer';
import 'jest-canvas-mock';
import { render } from 'enzyme';

/**
 * Internal dependencies
 */
import ColorControl from '..';

describe('ColorControl', () => {
	test('should render ColorControl', () => {
		const color = '#FFF';

		const renderer = TestRenderer.create(
			<ColorControl
				color={color}
				onChangeComplete={() => {}}
				disableAlpha
			/>
		);

		expect(renderer.toJSON()).toMatchSnapshot();
	});

	test('should have the expected label', async () => {
		const color = '#FFF';

		const renderer = render(
			<ColorControl
				color={color}
				onChangeComplete={() => {}}
				disableAlpha
				label='Font'
			/>
		);

		await expect(
			renderer.find('.components-base-control__label').html()
		).toBe('Font Colour');
	});

	test('Javad test', () => {
		// return true/false
		const isNumeric = string => {
			return !Number.isNaN(string);
		};

		expect(isNumeric('Is not going to pass')).toBe(true);
	});
});
