const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

jest.mock('@extensions/styles', () => ({
	getLastBreakpointAttribute: jest.fn(
		({ target, breakpoint, attributes, isHover = false }) => {
			const breakpointIndex = breakpoints.indexOf(breakpoint);

			for (let index = breakpointIndex; index >= 0; index -= 1) {
				const value =
					attributes[
						`${target}-${breakpoints[index]}${
							isHover ? '-hover' : ''
						}`
					];

				if (value !== undefined && value !== '') return value;
			}

			if (isHover) {
				for (let index = breakpointIndex; index >= 0; index -= 1) {
					const value = attributes[`${target}-${breakpoints[index]}`];

					if (value !== undefined && value !== '') return value;
				}
			}

			return attributes[target];
		}
	),
}));

import { getImageFilterStyles } from '../utils';

describe('Image Maxi filter styles', () => {
	it('builds a combined CSS filter from non-default image filter controls', () => {
		const styles = getImageFilterStyles({
			'image-filter-blur-general': 4,
			'image-filter-brightness-general': 125,
			'image-filter-contrast-general': 80,
			'image-filter-grayscale-general': 30,
			'image-filter-hue-rotate-general': 45,
			'image-filter-invert-general': 10,
			'image-filter-opacity-general': 90,
			'image-filter-saturate-general': 150,
			'image-filter-sepia-general': 20,
		});

		expect(styles).toEqual({
			filter: {
				general: {
					filter: 'blur(4px) brightness(125%) contrast(80%) grayscale(30%) hue-rotate(45deg) invert(10%) opacity(90%) saturate(150%) sepia(20%)',
				},
			},
		});
	});

	it('adds drop-shadow to the same filter declaration', () => {
		const styles = getImageFilterStyles({
			'image-filter-drop-shadow-horizontal-general': 2,
			'image-filter-drop-shadow-vertical-general': 6,
			'image-filter-drop-shadow-blur-general': 8,
			'image-filter-drop-shadow-color-general': 'rgba(0,0,0,0.35)',
		});

		expect(styles).toEqual({
			filter: {
				general: {
					filter: 'drop-shadow(2px 6px 8px rgba(0,0,0,0.35))',
				},
			},
		});
	});

	it('does not emit neutral filter values', () => {
		const styles = getImageFilterStyles({
			'image-filter-blur-general': 0,
			'image-filter-brightness-general': 100,
			'image-filter-contrast-general': 100,
			'image-filter-grayscale-general': 0,
			'image-filter-hue-rotate-general': 0,
			'image-filter-invert-general': 0,
			'image-filter-opacity-general': 100,
			'image-filter-saturate-general': 100,
			'image-filter-sepia-general': 0,
		});

		expect(styles).toEqual({});
	});

	it('keeps inherited filter functions when a breakpoint changes one value', () => {
		const styles = getImageFilterStyles({
			'image-filter-blur-general': 4,
			'image-filter-brightness-xxl': 125,
		});

		expect(styles.filter.xxl).toEqual({
			filter: 'blur(4px) brightness(125%)',
		});
	});

	it('builds hover filter styles from hover attributes', () => {
		const styles = getImageFilterStyles(
			{
				'image-filter-blur-general': 4,
				'image-filter-blur-general-hover': 8,
				'image-filter-brightness-general-hover': 125,
			},
			true
		);

		expect(styles.filter.general).toEqual({
			filter: 'blur(8px) brightness(125%)',
		});
	});

	it('clears an inherited normal filter when hover is explicitly neutral', () => {
		const styles = getImageFilterStyles(
			{
				'image-filter-blur-general': 4,
				'image-filter-blur-general-hover': 0,
			},
			true
		);

		expect(styles.filter.general).toEqual({ filter: 'none' });
	});
});
