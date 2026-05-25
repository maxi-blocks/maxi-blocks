import {
	createDividerDebugController,
	getDividerDebugSnapshot,
	isDividerDebugEnabled,
	logDividerDebugSnapshot,
} from '../debug';

describe('divider-maxi debug helpers', () => {
	beforeEach(() => {
		window.localStorage.clear();
		window.history.replaceState({}, '', '/');
		document.head.innerHTML = '';
		document.body.innerHTML = '';
		jest.spyOn(console, 'groupCollapsed').mockImplementation(jest.fn());
		jest.spyOn(console, 'groupEnd').mockImplementation(jest.fn());
		jest.spyOn(console, 'log').mockImplementation(jest.fn());
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('only enables divider diagnostics through the explicit debug gates', () => {
		expect(isDividerDebugEnabled(window)).toBe(false);

		window.localStorage.setItem('maxi-debug-divider', '1');

		expect(isDividerDebugEnabled(window)).toBe(true);

		window.localStorage.removeItem('maxi-debug-divider');
		window.history.replaceState({}, '', '/?maxi-debug-divider=1');

		expect(isDividerDebugEnabled(window)).toBe(true);
	});

	it('automatically enables divider diagnostics for dotted divider blocks', () => {
		expect(
			isDividerDebugEnabled(window, {
				'divider-border-style-general': 'dotted',
			})
		).toBe(true);
	});

	it('captures the divider DOM, responsive attributes, computed styles, and generated style matches', () => {
		const uniqueID = 'divider-maxi-debug-u';
		const style = document.createElement('style');
		style.id = 'maxi-block-styles';
		style.textContent = `.${uniqueID} .maxi-divider-block__divider { border-top-style: dotted; }`;
		document.head.appendChild(style);

		const blockWrapper = document.createElement('div');
		blockWrapper.setAttribute('data-block', 'client-id');
		blockWrapper.className = 'wp-block';

		const root = document.createElement('div');
		root.className = `${uniqueID} maxi-divider-block__resizer maxi-divider-block--horizontal`;
		root.setAttribute('style', 'width: 100%;');

		const divider = document.createElement('hr');
		divider.className = 'maxi-divider-block__divider';
		divider.style.borderTopStyle = 'dotted';
		divider.style.borderTopWidth = '14px';

		root.appendChild(divider);
		blockWrapper.appendChild(root);
		document.body.appendChild(blockWrapper);

		const snapshot = getDividerDebugSnapshot({
			label: 'hover-before',
			root,
			deviceType: 'm',
			attributes: {
				uniqueID,
				lineOrientation: 'vertical',
				'line-orientation-general': 'horizontal',
				'line-orientation-s': 'vertical',
				'divider-border-style-general': 'dotted',
				unrelated: 'ignore-me',
			},
		});

		expect(snapshot.breakpointClasses.isHorizontal).toBe(true);
		expect(snapshot.debugEnabledBy.autoDotted).toBe(true);
		expect(snapshot.attributes).toEqual({
			uniqueID,
			lineOrientation: 'vertical',
			'line-orientation-general': 'horizontal',
			'line-orientation-s': 'vertical',
			'divider-border-style-general': 'dotted',
		});
		expect(snapshot.classes.root).toContain(uniqueID);
		expect(snapshot.inlineStyles.root).toBe('width: 100%;');
		expect(snapshot.computed.divider['border-top-style']).toBe('dotted');
		expect(snapshot.computed.divider['border-top-width']).toBe('14px');
		expect(snapshot.styleTagMatches[0]).toMatchObject({
			id: 'maxi-block-styles',
		});
		expect(snapshot.styleTagMatches[0].snippet).toContain(uniqueID);
	});

	it('does not log diagnostics while the debug gate is disabled', () => {
		const root = document.createElement('div');

		expect(
			logDividerDebugSnapshot({
				label: 'update-after-raf',
				root,
				deviceType: 'm',
				attributes: { uniqueID: 'divider-maxi-debug-u' },
			})
		).toBe(false);
		expect(console.log).not.toHaveBeenCalled();
	});

	it('attaches hover diagnostics only while the controller is active', () => {
		const root = document.createElement('div');
		root.innerHTML = '<hr class="maxi-divider-block__divider" />';

		const controller = createDividerDebugController(() => ({
			root,
			deviceType: 'm',
			attributes: {
				uniqueID: 'divider-maxi-debug-u',
				'divider-border-style-general': 'dotted',
			},
		}));

		controller.attach();
		root.dispatchEvent(new window.Event('pointerenter'));

		expect(console.groupCollapsed).toHaveBeenCalledWith(
			expect.stringContaining('[MaxiBlocks][DividerDebug] hover-before')
		);

		const callCount = console.groupCollapsed.mock.calls.length;
		controller.detach();
		root.dispatchEvent(new window.Event('pointerenter'));

		expect(console.groupCollapsed).toHaveBeenCalledTimes(callCount);
	});
});
