import {
	__unstableResetGlobalStyleManager,
	addBlockStyles,
} from '@extensions/maxi-block/globalStyleManager';

describe('globalStyleManager', () => {
	let originalRequestAnimationFrame;
	const getConsolidatedStyleElements = () =>
		Array.from(
			document.querySelectorAll('[data-maxi-blocks="consolidated"]')
		);
	const getCombinedStyleContent = () =>
		getConsolidatedStyleElements()
			.map(element => element.textContent)
			.join('\n');

	beforeEach(() => {
		__unstableResetGlobalStyleManager();
		document.head.innerHTML = '';
		originalRequestAnimationFrame = window.requestAnimationFrame;
		window.requestAnimationFrame = jest.fn(callback => {
			callback();
			return 1;
		});
	});

	afterEach(() => {
		window.requestAnimationFrame = originalRequestAnimationFrame;
		__unstableResetGlobalStyleManager();
		document.head.innerHTML = '';
	});

	it('skips duplicate style updates for the same block', () => {
		addBlockStyles('block-1', '.block-1{color:red;}', document);
		addBlockStyles('block-1', '.block-1{color:red;}', document);

		const styleContent = getCombinedStyleContent();

		expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
		expect(getConsolidatedStyleElements()).toHaveLength(1);
		expect(styleContent).toContain('.block-1{color:red;}');
	});

	it('schedules a fresh flush when block styles change', () => {
		addBlockStyles('block-1', '.block-1{color:red;}', document);
		addBlockStyles('block-1', '.block-1{color:blue;}', document);

		const styleContent = getCombinedStyleContent();

		expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
		expect(styleContent).toContain('.block-1{color:blue;}');
		expect(styleContent).not.toContain('.block-1{color:red;}');
	});
});
