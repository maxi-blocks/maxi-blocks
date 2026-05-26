import { getImageResizerClassName } from '../utils';

describe('image maxi utils', () => {
	it('marks the resizer when captions are enabled', () => {
		expect(getImageResizerClassName('custom')).toContain(
			'maxi-image-block__resizer--has-caption'
		);
	});

	it('does not mark the resizer when captions are disabled', () => {
		expect(getImageResizerClassName('none')).not.toContain(
			'maxi-image-block__resizer--has-caption'
		);
	});

	it('does not mark the resizer when caption type is missing', () => {
		expect(getImageResizerClassName()).toBe('maxi-image-block__resizer');
	});
});
