import standardSC from '@maxi-core/defaults/defaultSC.json';
import {
	exportStyleCard,
	getActiveColourFromSC,
	processSCAttribute,
	processSCAttributes,
	showHideHamburgerNavigation,
	removeNavigationHoverUnderline,
} from '@editor/style-cards/utils';
import {
	getIsSiteEditor,
	getSiteEditorIframeBody,
	getSiteEditorIframe,
} from '@extensions/fse';
import downloadTextFile from '@editor/style-cards/downloadTextFile';
import getDefaultSCAttribute from '@editor/style-cards/getDefaultSCAttribute';

jest.mock('@editor/style-cards/downloadTextFile');
jest.mock('@editor/style-cards/getDefaultSCAttribute');
jest.mock('@extensions/fse', () => {
	return {
		getIsSiteEditor: jest.fn(),
		getSiteEditorIframeBody: jest.fn(),
		getSiteEditorIframe: jest.fn(),
	};
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

describe('utils', () => {
	describe('exportStyleCard', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			window.URL.createObjectURL = jest.fn(() => '');
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('Should export only the differences from standard style card', () => {
			const testData = {
				...standardSC.sc_maxi,
				someNewProperty: 'new value',
				existingProperty: 'changed value',
			};
			const fileName = 'test-style-card.json';

			exportStyleCard(testData, fileName);

			// The diff should only contain the changed/new properties
			const expectedDiff = {
				someNewProperty: 'new value',
				existingProperty: 'changed value',
			};

			expect(downloadTextFile).toHaveBeenCalledWith(
				expectedDiff,
				fileName
			);
		});

		it('Should handle empty data', () => {
			const emptyData = {};
			const fileName = 'empty-style-card.json';

			exportStyleCard(emptyData, fileName);

			// When comparing empty data with standard SC, diff should return the inverse of standard SC
			const diffResult = downloadTextFile.mock.calls[0][0];
			expect(downloadTextFile).toHaveBeenCalledWith(diffResult, fileName);
			expect(diffResult).toMatchSnapshot();
		});

		it('Should handle data identical to standard style card', () => {
			const identicalData = { ...standardSC.sc_maxi };
			const fileName = 'identical-style-card.json';

			exportStyleCard(identicalData, fileName);

			// When data is identical, diff should return an empty object
			expect(downloadTextFile).toHaveBeenCalledWith({}, fileName);
		});
	});

	describe('processSCAttribute', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should return style card value when it exists', () => {
			const SC = {
				styleCard: {
					typography: {
						'font-size': '18px',
					},
				},
			};

			const result = processSCAttribute(SC, 'font-size', 'typography');
			expect(result).toBe('18px');
		});

		it('should return default value when style card value does not exist', () => {
			const SC = {
				styleCard: {
					typography: {},
				},
				defaultStyleCard: {
					typography: {
						'font-size': '16px',
					},
				},
			};

			getDefaultSCAttribute.mockReturnValue('16px');

			const result = processSCAttribute(SC, 'font-size', 'typography');
			expect(result).toBe('16px');
			expect(getDefaultSCAttribute).toHaveBeenCalledWith(
				SC,
				'font-size',
				'typography'
			);
		});

		it('should return null when SC is empty', () => {
			const result = processSCAttribute({}, 'font-size', 'typography');
			expect(result).toBeNull();
		});
	});

	describe('processSCAttributes', () => {
		beforeEach(() => {
			// Reset mocks before each test
			jest.clearAllMocks();
		});

		it('should return all attributes that match the given substring', () => {
			const SC = {
				styleCard: {
					typography: {
						'font-size': '18px',
						'font-family': 'Arial',
						'line-height': '1.5',
					},
				},
			};

			const result = processSCAttributes(SC, 'font', 'typography');
			expect(result).toEqual({
				'font-size': '18px',
				'font-family': 'Arial',
			});
		});

		it('should return empty object when no attributes match', () => {
			const SC = {
				styleCard: {
					typography: {
						'line-height': '1.5',
					},
				},
			};

			const result = processSCAttributes(SC, 'font', 'typography');
			expect(result).toEqual({});
		});

		it('should return empty object when SC is empty', () => {
			const result = processSCAttributes({}, 'font', 'typography');
			expect(result).toEqual({});
		});
	});

	describe('getActiveColourFromSC', () => {
		it('should return color from value.light.styleCard when it exists', () => {
			const sc = {
				value: {
					light: {
						styleCard: {
							color: {
								1: 'rgb(255, 0, 0)',
							},
						},
					},
				},
			};

			const result = getActiveColourFromSC(sc, 1);
			expect(result).toBe('rgb(255, 0, 0)');
		});

		it('should return color from value.light.defaultStyleCard when styleCard color does not exist', () => {
			const sc = {
				value: {
					light: {
						defaultStyleCard: {
							color: {
								1: 'rgb(0, 255, 0)',
							},
						},
					},
				},
			};

			const result = getActiveColourFromSC(sc, 1);
			expect(result).toBe('rgb(0, 255, 0)');
		});

		it('should return color from light.styleCard when value does not exist', () => {
			const sc = {
				light: {
					styleCard: {
						color: {
							1: 'rgb(0, 0, 255)',
						},
					},
				},
			};

			const result = getActiveColourFromSC(sc, 1);
			expect(result).toBe('rgb(0, 0, 255)');
		});

		it('should return default color when no color is found', () => {
			const sc = {};
			const result = getActiveColourFromSC(sc, 1);
			expect(result).toBe('0,0,0');
		});
	});

	describe('showHideHamburgerNavigation', () => {
		let mockEditor;
		let mockHamburgerNavigation;
		let mockMenuNavigation;
		let cleanup;
		let originalConsoleError;

		// Mock ResizeObserver for each test
		const mockObserve = jest.fn();
		const mockUnobserve = jest.fn();
		const mockResizeObserver = {
			observe: mockObserve,
			unobserve: mockUnobserve,
			disconnect: jest.fn(),
		};

		beforeAll(() => {
			// Suppress console errors during tests
			originalConsoleError = console.error;
			console.error = jest.fn();

			// Mock ResizeObserver implementation
			global.ResizeObserver = jest.fn(() => mockResizeObserver);
		});

		afterAll(() => {
			// Restore console.error
			console.error = originalConsoleError;
		});

		beforeEach(() => {
			// Clear previous mocks
			jest.clearAllMocks();

			// Create mock DOM structure
			mockEditor = document.createElement('div');
			mockEditor.className = 'edit-post-visual-editor';
			mockEditor.style.width = '1000px';
			// Create a getter for clientWidth instead of redefining property
			Object.defineProperty(mockEditor, 'clientWidth', {
				get() {
					return this._clientWidth || 1000;
				},
				set(value) {
					this._clientWidth = value;
				},
				configurable: true,
			});

			const mockContainer = document.createElement('div');
			mockContainer.className = 'maxi-container-block';

			mockHamburgerNavigation = document.createElement('button');
			mockHamburgerNavigation.className =
				'wp-block-navigation__responsive-container-open';

			mockMenuNavigation = document.createElement('div');
			mockMenuNavigation.className =
				'wp-block-navigation__responsive-container';

			mockContainer.appendChild(mockHamburgerNavigation);
			mockContainer.appendChild(mockMenuNavigation);
			mockEditor.appendChild(mockContainer);

			document.body.appendChild(mockEditor);

			// Mock getIsSiteEditor to return false so we use the mockEditor
			getIsSiteEditor.mockReturnValue(false);

			// Setup document.querySelector to return our mockEditor
			document.querySelector = jest.fn().mockImplementation(selector => {
				if (selector === '.edit-post-visual-editor') return mockEditor;
				return null;
			});

			// Setup querySelectorAll to return our mockHamburgerNavigation
			mockEditor.querySelectorAll = jest
				.fn()
				.mockReturnValue([mockHamburgerNavigation]);
		});

		afterEach(() => {
			// Clean up the DOM
			if (document.body.contains(mockEditor)) {
				document.body.removeChild(mockEditor);
			}

			// Remove any added style elements
			const styleElement = document.getElementById(
				'maxi-blocks-hide-navigation'
			);
			if (styleElement) {
				styleElement.remove();
			}

			// Call cleanup function if it exists
			if (cleanup) {
				cleanup();
				cleanup = null;
			}
		});

		it('should show hamburger navigation when type is "show"', () => {
			// Setup mockHamburgerNavigation.nextElementSibling
			Object.defineProperty(
				mockHamburgerNavigation,
				'nextElementSibling',
				{
					value: mockMenuNavigation,
					configurable: true,
				}
			);

			cleanup = showHideHamburgerNavigation('show');

			expect(
				mockHamburgerNavigation.classList.contains('always-shown')
			).toBe(true);
			expect(
				mockMenuNavigation.classList.contains('hidden-by-default')
			).toBe(true);

			// Check if style element was added
			const styleElement = document.getElementById(
				'maxi-blocks-hide-navigation'
			);
			expect(styleElement).not.toBeNull();
		});

		it('should hide hamburger navigation when type is "hide"', () => {
			// Add classes that should be removed
			mockHamburgerNavigation.classList.add('always-shown');
			mockMenuNavigation.classList.add('hidden-by-default');

			// Create style element to be removed
			const styleElement = document.createElement('style');
			styleElement.id = 'maxi-blocks-hide-navigation';
			document.head.appendChild(styleElement);

			// Setup mockHamburgerNavigation.nextElementSibling
			Object.defineProperty(
				mockHamburgerNavigation,
				'nextElementSibling',
				{
					value: mockMenuNavigation,
					configurable: true,
				}
			);

			cleanup = showHideHamburgerNavigation('hide');

			expect(
				mockHamburgerNavigation.classList.contains('always-shown')
			).toBe(false);
			expect(
				mockMenuNavigation.classList.contains('hidden-by-default')
			).toBe(false);

			// Check if style element was removed
			const remainingStyleElement = document.getElementById(
				'maxi-blocks-hide-navigation'
			);
			expect(remainingStyleElement).toBeNull();
		});

		it('should show hamburger navigation when screen width is below the specified number', () => {
			// Set editor width to be less than threshold
			mockEditor._clientWidth = 600;

			// Setup mockHamburgerNavigation.nextElementSibling
			Object.defineProperty(
				mockHamburgerNavigation,
				'nextElementSibling',
				{
					value: mockMenuNavigation,
					configurable: true,
				}
			);

			cleanup = showHideHamburgerNavigation(768); // Threshold of 768px

			expect(
				mockHamburgerNavigation.classList.contains('always-shown')
			).toBe(true);
			expect(
				mockMenuNavigation.classList.contains('hidden-by-default')
			).toBe(true);
		});

		it('should hide hamburger navigation when screen width is above the specified number', () => {
			// Set editor width to be more than threshold
			mockEditor._clientWidth = 1000;

			// Add classes that should be removed
			mockHamburgerNavigation.classList.add('always-shown');
			mockMenuNavigation.classList.add('hidden-by-default');

			// Setup mockHamburgerNavigation.nextElementSibling
			Object.defineProperty(
				mockHamburgerNavigation,
				'nextElementSibling',
				{
					value: mockMenuNavigation,
					configurable: true,
				}
			);

			cleanup = showHideHamburgerNavigation(768); // Threshold of 768px

			expect(
				mockHamburgerNavigation.classList.contains('always-shown')
			).toBe(false);
			expect(
				mockMenuNavigation.classList.contains('hidden-by-default')
			).toBe(false);
		});

		it('should use site editor when getIsSiteEditor returns true', () => {
			// Reset mocks to ensure clean state
			jest.clearAllMocks();

			// Mock site editor setup
			const mockSiteEditor = document.createElement('div');
			mockSiteEditor.className = 'edit-site';

			// Set up mock functions BEFORE calling the function
			getIsSiteEditor.mockReturnValue(true);
			getSiteEditorIframeBody.mockReturnValue(mockSiteEditor);

			// Setup querySelectorAll for site editor
			mockSiteEditor.querySelectorAll = jest.fn().mockReturnValue([]);

			// Now call the function
			showHideHamburgerNavigation('show');

			// Verify the functions were called
			expect(getIsSiteEditor).toHaveBeenCalled();
			expect(getSiteEditorIframeBody).toHaveBeenCalled();
		});

		it('should set up and clean up ResizeObserver correctly', () => {
			// Setup mockHamburgerNavigation.nextElementSibling
			Object.defineProperty(
				mockHamburgerNavigation,
				'nextElementSibling',
				{
					value: mockMenuNavigation,
					configurable: true,
				}
			);

			// Clear mock calls
			mockObserve.mockClear();
			mockUnobserve.mockClear();

			cleanup = showHideHamburgerNavigation('show');

			// Check if ResizeObserver was created
			expect(global.ResizeObserver).toHaveBeenCalled();
			// Check if observe was called
			expect(mockObserve).toHaveBeenCalledWith(mockEditor);

			// Call cleanup function
			cleanup();

			// Check if unobserve was called
			expect(mockUnobserve).toHaveBeenCalledWith(mockEditor);
		});
	});

	describe('removeNavigationHoverUnderline', () => {
		// Store original document methods references
		let originalGetElementById;
		let originalCreateElement;
		let originalCreateTextNode;
		let originalHeadAppendChild;

		// Mocks for document methods
		let headAppendChildMock;
		let getElementByIdMock;
		let createElementMock;
		let createTextNodeMock;

		beforeEach(() => {
			// Clear previous mocks
			jest.clearAllMocks();

			// Store original methods before mocking
			originalGetElementById = document.getElementById;
			originalCreateElement = document.createElement;
			originalCreateTextNode = document.createTextNode;
			originalHeadAppendChild = document.head.appendChild;

			// Create mocks
			getElementByIdMock = jest.fn();
			createElementMock = jest.fn();
			createTextNodeMock = jest.fn();
			headAppendChildMock = jest.fn();

			// Set up mocks
			document.getElementById = getElementByIdMock;
			document.createElement = createElementMock;
			document.createTextNode = createTextNodeMock;

			// Mock head.appendChild without replacing head
			Object.defineProperty(document.head, 'appendChild', {
				configurable: true,
				value: headAppendChildMock,
			});

			// Default to regular editor, not site editor
			getIsSiteEditor.mockReturnValue(false);
		});

		// Restore original methods after each test
		afterEach(() => {
			document.getElementById = originalGetElementById;
			document.createElement = originalCreateElement;
			document.createTextNode = originalCreateTextNode;

			// Restore head.appendChild
			Object.defineProperty(document.head, 'appendChild', {
				configurable: true,
				value: originalHeadAppendChild,
			});
		});

		it('should add style element when remove is true', () => {
			// Style doesn't exist yet
			getElementByIdMock.mockReturnValue(null);

			// Create mock style element
			const mockStyleElement = {
				appendChild: jest.fn(),
				type: null,
				id: null,
			};
			createElementMock.mockReturnValue(mockStyleElement);

			removeNavigationHoverUnderline(true);

			expect(getElementByIdMock).toHaveBeenCalledWith(
				'maxi-blocks-remove-hover-underline-navigation'
			);
			expect(createElementMock).toHaveBeenCalledWith('style');
			expect(createTextNodeMock).toHaveBeenCalledWith(
				'.maxi-blocks--active .maxi-container-block .wp-block-navigation a:hover { text-decoration: none; }'
			);
			expect(headAppendChildMock).toHaveBeenCalled();
			expect(mockStyleElement.type).toBe('text/css');
			expect(mockStyleElement.id).toBe(
				'maxi-blocks-remove-hover-underline-navigation'
			);
		});

		it('should not add style element if it already exists', () => {
			// Style already exists
			const existingStyleElement = {
				appendChild: jest.fn(),
				type: 'text/css',
				id: 'maxi-blocks-remove-hover-underline-navigation',
			};
			getElementByIdMock.mockReturnValue(existingStyleElement);

			removeNavigationHoverUnderline(true);

			expect(getElementByIdMock).toHaveBeenCalledWith(
				'maxi-blocks-remove-hover-underline-navigation'
			);
			expect(createElementMock).not.toHaveBeenCalled();
			expect(headAppendChildMock).not.toHaveBeenCalled();
		});

		it('should remove style element when remove is false', () => {
			// Style exists
			const mockStyleElement = {
				remove: jest.fn(),
			};
			getElementByIdMock.mockReturnValue(mockStyleElement);

			removeNavigationHoverUnderline(false);

			expect(getElementByIdMock).toHaveBeenCalledWith(
				'maxi-blocks-remove-hover-underline-navigation'
			);
			expect(mockStyleElement.remove).toHaveBeenCalled();
		});

		it('should do nothing when remove is false and no style element exists', () => {
			// No style element
			getElementByIdMock.mockReturnValue(null);

			removeNavigationHoverUnderline(false);

			expect(getElementByIdMock).toHaveBeenCalledWith(
				'maxi-blocks-remove-hover-underline-navigation'
			);
			// No further actions should be taken
			expect(createElementMock).not.toHaveBeenCalled();
		});

		it('should use site editor document when in site editor', () => {
			// Set up the iframe document mock
			const mockIframe = {
				getElementById: jest.fn().mockReturnValue(null),
				createElement: jest.fn().mockReturnValue({
					appendChild: jest.fn(),
					type: null,
					id: null,
				}),
				createTextNode: jest.fn(),
				head: { appendChild: jest.fn() },
			};

			// In site editor
			getIsSiteEditor.mockReturnValue(true);
			getSiteEditorIframe.mockReturnValue(mockIframe);

			removeNavigationHoverUnderline(true);

			// Verify that the mocks were called
			expect(getIsSiteEditor).toHaveBeenCalled();
			expect(getSiteEditorIframe).toHaveBeenCalled();
		});
	});
});
