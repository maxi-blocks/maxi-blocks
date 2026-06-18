import {
	getCSSURL,
	getImageResizerClassName,
	getResponsiveImageFallback,
	getResponsiveImageReplacementStyles,
	getResetResponsiveImageSizeAttributes,
} from '../utils';
import styleGenerator from '@extensions/styles/styleGenerator';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(() => ({
		receiveBaseBreakpoint: jest.fn(() => 'xl'),
		receiveMaxiDeviceType: jest.fn(() => 'l'),
	})),
}));

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

	it('creates responsive image replacement styles without changing saved markup', () => {
		expect(
			getResponsiveImageReplacementStyles({
				mediaURL: 'full.jpg',
				'mediaURL-l': 'large\\".jpg',
				'mediaURL-xs': 'small.jpg',
			})
		).toEqual({
			imageSize: {
				l: {
					content: 'url("large\\\\\\".jpg")',
				},
				xs: {
					content: 'url("small.jpg")',
				},
			},
		});
	});

	it('emits responsive image replacement styles as breakpoint CSS', () => {
		const styles = {
			'image-maxi-test': {
				breakpoints: {},
				content: {
					' .maxi-image-block-wrapper img':
						getResponsiveImageReplacementStyles({
							mediaURL: 'full.jpg',
							'mediaURL-l': 'large\\".jpg',
						}).imageSize,
				},
			},
		};

		const css = styleGenerator(styles);

		expect(css).toContain(
			'body.maxi-blocks--active .edit-post-visual-editor[maxi-blocks-responsive="l"] .maxi-block.maxi-block--backend.image-maxi-test .maxi-image-block-wrapper img'
		);
		expect(css).toContain('content: url("large\\\\\\".jpg");');
	});

	it('escapes CSS url strings before they are emitted in styles', () => {
		expect(getCSSURL('image\\".jpg')).toBe(
			'url("image\\\\\\".jpg")'
		);
		expect(getCSSURL("line\nbreak.jpg")).toBe(
			'url("line\\a break.jpg")'
		);
		expect(getCSSURL('</style><script>')).toBe(
			'url("\\3c /style\\3e \\3c script\\3e ")'
		);
	});

	it('uses canonical media fields before general responsive mirrors', () => {
		expect(
			getResponsiveImageFallback({
				mediaURL: 'new.jpg',
				mediaWidth: 1200,
				mediaHeight: 800,
				'mediaURL-general': 'old.jpg',
				'mediaWidth-general': 300,
				'mediaHeight-general': 200,
			})
		).toEqual({
			mediaURL: 'new.jpg',
			mediaWidth: 1200,
			mediaHeight: 800,
		});
	});

	it('does not emit responsive replacement styles for dynamic images', () => {
		expect(
			getResponsiveImageReplacementStyles({
				'dc-status': true,
				mediaURL: 'dynamic.jpg',
				'mediaURL-l': 'static-large.jpg',
			})
		).toEqual({});
	});

	it('emits explicit fallback selections so smaller breakpoints override larger sources', () => {
		expect(
			getResponsiveImageReplacementStyles({
				mediaURL: 'full.jpg',
				'imageSize-l': 'large',
				'mediaURL-l': 'large.jpg',
				'imageSize-m': 'full',
				'mediaURL-m': 'full.jpg',
			})
		).toEqual({
			imageSize: {
				l: {
					content: 'url("large.jpg")',
				},
				m: {
					content: 'url("full.jpg")',
				},
			},
		});
	});

	it('emits responsive image replacement styles in broad-to-narrow order', () => {
		const styles = getResponsiveImageReplacementStyles({
			mediaURL: 'full.jpg',
			'mediaURL-l': 'large.jpg',
			'mediaURL-m': 'medium.jpg',
			'mediaURL-xs': 'small.jpg',
		});

		expect(Object.keys(styles.imageSize)).toEqual(['l', 'm', 'xs']);
	});

	it('clears breakpoint-specific image size response fields', () => {
		expect(getResetResponsiveImageSizeAttributes()).toEqual({
			'imageSize-xxl': undefined,
			'mediaURL-xxl': undefined,
			'mediaWidth-xxl': undefined,
			'mediaHeight-xxl': undefined,
			'cropOptions-xxl': undefined,
			'imageSize-xl': undefined,
			'mediaURL-xl': undefined,
			'mediaWidth-xl': undefined,
			'mediaHeight-xl': undefined,
			'cropOptions-xl': undefined,
			'imageSize-l': undefined,
			'mediaURL-l': undefined,
			'mediaWidth-l': undefined,
			'mediaHeight-l': undefined,
			'cropOptions-l': undefined,
			'imageSize-m': undefined,
			'mediaURL-m': undefined,
			'mediaWidth-m': undefined,
			'mediaHeight-m': undefined,
			'cropOptions-m': undefined,
			'imageSize-s': undefined,
			'mediaURL-s': undefined,
			'mediaWidth-s': undefined,
			'mediaHeight-s': undefined,
			'cropOptions-s': undefined,
			'imageSize-xs': undefined,
			'mediaURL-xs': undefined,
			'mediaWidth-xs': undefined,
			'mediaHeight-xs': undefined,
			'cropOptions-xs': undefined,
		});
	});
});
