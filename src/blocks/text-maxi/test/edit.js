/**
 * External dependencies
 */
import TestRenderer from 'react-test-renderer';
import 'jest-canvas-mock';

/**
 * Internal dependencies
 */
import TextMaxi from '../edit';

describe('TextMaxi', () => {
	it('renders without crashing', () => {
		const renderer = TestRenderer.create(<TextMaxi />);

		expect(renderer.toJSON()).toBeTruthy();
	});
});
