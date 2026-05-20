import {
	debugPreview,
	isLocalPreviewDebugHost,
	isPreviewDeepDebugEnabled,
	isPreviewDebugEnabled,
	stringifyPreviewDebugDetails,
} from '@extensions/relations/debugPreview';

describe('relations preview diagnostics', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('enables diagnostics automatically for local editor hosts', () => {
		const localWindow = {
			location: { hostname: 'localhost' },
			navigator: { userAgent: 'Chrome' },
			localStorage: { getItem: jest.fn(() => null) },
			maxiIBAllowLocalDebugInTests: true,
		};

		expect(isLocalPreviewDebugHost(localWindow)).toBe(true);
		expect(isPreviewDebugEnabled(localWindow)).toBe(true);
	});

	it('keeps diagnostics off for non-local hosts by default', () => {
		const remoteWindow = {
			location: { hostname: 'example.com' },
			navigator: { userAgent: 'Chrome' },
			localStorage: { getItem: jest.fn(() => null) },
		};

		expect(isLocalPreviewDebugHost(remoteWindow)).toBe(false);
		expect(isPreviewDebugEnabled(remoteWindow)).toBe(false);
	});

	it('allows explicit opt-in through localStorage', () => {
		const windowWithOptIn = {
			location: { hostname: 'example.com' },
			navigator: { userAgent: 'Chrome' },
			localStorage: { getItem: jest.fn(() => 'true') },
		};

		expect(isPreviewDebugEnabled(windowWithOptIn)).toBe(true);
	});

	it('keeps deep diagnostics opt-in only', () => {
		const normalDebugWindow = {
			location: { hostname: 'localhost' },
			navigator: { userAgent: 'Chrome' },
			localStorage: { getItem: jest.fn(() => null) },
			maxiIBAllowLocalDebugInTests: true,
		};
		const deepDebugWindow = {
			location: { hostname: 'example.com', search: '' },
			navigator: { userAgent: 'Chrome' },
			localStorage: {
				getItem: jest.fn(key =>
					key === 'maxiIBDebugDeep' ? 'true' : null
				),
			},
		};
		const queryDebugWindow = {
			location: {
				hostname: 'example.com',
				search: '?post=9&maxiIBDebugDeep=1',
			},
			navigator: { userAgent: 'Chrome' },
			localStorage: { getItem: jest.fn(() => null) },
		};

		expect(isPreviewDebugEnabled(normalDebugWindow)).toBe(true);
		expect(isPreviewDeepDebugEnabled(normalDebugWindow)).toBe(false);
		expect(isPreviewDeepDebugEnabled(deepDebugWindow)).toBe(true);
		expect(isPreviewDeepDebugEnabled(queryDebugWindow)).toBe(true);
	});

	it('stringifies deep diagnostics so external logs include expanded values', () => {
		const details = { selector: '.test', nested: { transform: 'none' } };

		expect(stringifyPreviewDebugDetails(details)).toContain(
			'"transform": "none"'
		);
	});

	it('logs warning diagnostics when enabled', () => {
		const warn = jest.fn();
		jest.spyOn(window.console, 'warn').mockImplementation(jest.fn());

		const enabledWindow = {
			console: { warn },
			location: { hostname: 'example.com' },
			navigator: { userAgent: 'Chrome' },
			localStorage: { getItem: jest.fn(() => 'true') },
		};

		debugPreview(
			'relation-control:preview-toggle',
			{ value: true },
			enabledWindow
		);

		expect(warn).toHaveBeenCalledWith(
			'[Maxi IB Preview]',
			'relation-control:preview-toggle',
			{ value: true }
		);
		expect(warn).toHaveBeenCalledWith(
			'[Maxi IB Preview JSON]',
			'relation-control:preview-toggle',
			expect.stringContaining('"value": true')
		);
	});

	it('mirrors iframe diagnostics to the host console', () => {
		const iframeWarn = jest.fn();
		const hostWarn = jest.fn();

		jest.spyOn(window.console, 'warn').mockImplementation(hostWarn);

		const iframeWindow = {
			console: { warn: iframeWarn },
			location: { hostname: 'localhost' },
			navigator: { userAgent: 'Chrome' },
			localStorage: { getItem: jest.fn(() => null) },
			maxiIBAllowLocalDebugInTests: true,
		};

		debugPreview('constructor:ready', { id: 1 }, iframeWindow);

		expect(iframeWarn).toHaveBeenCalledWith(
			'[Maxi IB Preview]',
			'constructor:ready',
			{ id: 1 }
		);
		expect(hostWarn).toHaveBeenCalledWith(
			'[Maxi IB Preview]',
			'constructor:ready',
			{ id: 1 }
		);
	});

	it('logs deep diagnostics as expanded JSON only when deep debug is enabled', () => {
		const warn = jest.fn();
		jest.spyOn(window.console, 'warn').mockImplementation(jest.fn());

		const enabledWindow = {
			console: { warn },
			location: { hostname: 'example.com' },
			navigator: { userAgent: 'Chrome' },
			localStorage: {
				getItem: jest.fn(key =>
					key === 'maxiIBDebugDeep' ? 'true' : null
				),
			},
		};

		debugPreview(
			'preview-styles:exported:deep',
			{ css: { transform: 'scale(1)' } },
			enabledWindow,
			{ deep: true }
		);

		expect(warn).toHaveBeenCalledWith(
			'[Maxi IB Preview Deep]',
			'preview-styles:exported:deep',
			expect.stringContaining('"transform": "scale(1)"')
		);
	});
});
