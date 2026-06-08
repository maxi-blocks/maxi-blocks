/**
 * Internal dependencies
 */
import Relation from '@extensions/relations/Relation';
import getBlockNameFromUniqueID from '@extensions/attributes/getBlockNameFromUniqueID';
import { getIsSiteEditor, getSiteEditorIframe } from '@extensions/fse';

jest.mock('@extensions/attributes/getBlockNameFromUniqueID', () => jest.fn());
jest.mock('@extensions/fse', () => ({
	getIsSiteEditor: jest.fn(),
	getSiteEditorIframe: jest.fn(),
}));

describe('Relation class', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Spy on document methods
		jest.spyOn(document, 'querySelector').mockImplementation(() => null);
		jest.spyOn(document, 'createElement').mockImplementation(() => ({
			id: '',
			setAttribute: jest.fn(),
			remove: jest.fn(),
			innerText: '',
		}));

		// Spy on window methods
		jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
			getPropertyValue: jest.fn().mockReturnValue('none 0s ease 0s'),
		}));

		// Mock other dependencies
		getBlockNameFromUniqueID.mockReturnValue('test-block');
		getIsSiteEditor.mockReturnValue(false);
		getSiteEditorIframe.mockReturnValue(null);
	});

	afterEach(() => {
		// Restore all mocks
		jest.restoreAllMocks();
	});

	describe('constructor', () => {
		beforeEach(() => {
			// Mock the methods used in the constructor
			jest.spyOn(
				Relation.prototype,
				'generateCssResponsiveObj'
			).mockImplementation(() => {
				return {
					stylesObjs: [{ general: { color: 'red' } }],
					effectsObjs: [{ general: { 'transition-status': true } }],
				};
			});

			jest.spyOn(
				Relation.prototype,
				'generateBreakpointsObj'
			).mockImplementation(() => {
				return { general: '', xl: 1200 };
			});

			jest.spyOn(Relation.prototype, 'getAvoidHover').mockImplementation(
				function () {
					this.avoidHoverArray = [false];
				}
			);

			jest.spyOn(
				Relation.prototype,
				'generateTransitions'
			).mockImplementation(function () {
				this.inTransitionString = 'transition: all 0.3s ease 0s;';
				this.outTransitionString = 'transition: all 0.3s ease 0s;';
			});

			jest.spyOn(Relation.prototype, 'generateStyles').mockImplementation(
				function () {
					this.stylesString = 'color: red;';
				}
			);

			jest.spyOn(
				Relation.prototype,
				'generateStylesEls'
			).mockImplementation(function () {
				this.stylesEl = { id: 'mock-styles-el' };
				this.inTransitionEl = { id: 'mock-in-transition-el' };
				this.outTransitionEl = { id: 'mock-out-transition-el' };
			});
		});

		it('should early return if uniqueID is missing', () => {
			const relation = new Relation({
				css: [{ color: 'red' }],
			});

			expect(relation.uniqueID).toBeUndefined();
			// Check that further initialization wasn't performed
			expect(relation.stylesString).toBeUndefined();
		});

		it('should early return if css is empty', () => {
			const relation = new Relation({
				uniqueID: 'test-unique-id',
				css: [],
			});

			expect(relation.uniqueID).toBe('test-unique-id');
			expect(relation.css).toEqual([]);
			// Check that further initialization wasn't performed
			expect(relation.stylesString).toBeUndefined();
		});

		it('should handle site editor environment correctly', () => {
			// Setup for site editor
			getIsSiteEditor.mockReturnValue(true);
			const mockIframe = {
				contentWindow: { foo: 'bar' },
				querySelector: jest.fn(),
			};
			getSiteEditorIframe.mockReturnValue(mockIframe);

			document.querySelector.mockReturnValue(null);

			const relation = new Relation({
				uniqueID: 'test-unique-id',
				css: [{ color: 'red' }],
			});

			expect(relation.isSiteEditor).toBe(true);
			expect(relation.mainDocument).toBe(mockIframe);
			expect(relation.targetPrefix).toBe(
				'.editor-styles-wrapper[maxi-blocks-responsive] .maxi-block.maxi-block--backend'
			);
		});

		it('should setup correct target elements and selectors', () => {
			// Mock DOM elements
			const mockTriggerEl = {
				contains: jest.fn().mockReturnValue(false),
			};
			const mockTargetEl = {
				contains: jest.fn(),
				closest: jest.fn().mockReturnValue({ contains: jest.fn() }),
			};

			document.querySelector
				.mockReturnValueOnce(mockTriggerEl) // for this.trigger
				.mockReturnValueOnce(mockTargetEl) // for this.blockTarget
				.mockReturnValueOnce(mockTargetEl); // for this.fullTarget

			const item = {
				uniqueID: 'test-unique-id',
				trigger: 'trigger-class',
				target: '.test-target',
				css: [{ color: 'red' }],
				effects: [{ hoverStatus: false }],
				attributes: [{}],
			};

			const relation = new Relation(item);

			expect(relation.trigger).toBe('trigger-class');
			expect(relation.triggerEl).toBe(mockTriggerEl);
			expect(relation.blockTarget).toBe('.test-unique-id');
			expect(relation.blockTargetEl).toBe(mockTargetEl);
			expect(relation.target).toBe('.test-target');
			expect(relation.targetEl).toBe(mockTargetEl);
			expect(relation.fullTarget).toContain(
				'.test-unique-id .test-target'
			);

			// Verify getBlockNameFromUniqueID was called
			expect(getBlockNameFromUniqueID).toHaveBeenCalledWith(
				'test-unique-id'
			);
		});

		it('should early return if triggerEl or targetEl is not found', () => {
			// Mock DOM elements - return null for one of the elements
			document.querySelector
				.mockReturnValueOnce({}) // for this.trigger
				.mockReturnValueOnce({}) // for this.blockTarget
				.mockReturnValueOnce(null); // for this.fullTarget - null

			const item = {
				uniqueID: 'test-unique-id',
				trigger: 'trigger-class',
				target: '.test-target',
				css: [{ color: 'red' }],
			};

			const relation = new Relation(item);

			// Check that further initialization wasn't performed
			expect(relation.stylesString).toBeUndefined();
		});

		it('should process css and effects into stylesObjs and effectsObjs', () => {
			// Setup mock DOM elements
			const mockTriggerEl = {
				contains: jest.fn().mockReturnValue(false),
			};
			const mockTargetEl = {
				contains: jest.fn(),
				closest: jest.fn().mockReturnValue({ contains: jest.fn() }),
			};

			document.querySelector
				.mockReturnValueOnce(mockTriggerEl)
				.mockReturnValueOnce(mockTargetEl)
				.mockReturnValueOnce(mockTargetEl);

			const item = {
				uniqueID: 'test-unique-id',
				trigger: 'trigger-class',
				target: '.test-target',
				css: [
					{
						general: {
							styles: { color: 'red' },
							breakpoint: '',
						},
						xl: {
							styles: { color: 'blue' },
							breakpoint: 1200,
						},
					},
				],
				effects: [
					{
						'transition-status-general': true,
						'transition-duration-general': 0.3,
						'transition-delay-general': 0,
						'easing-general': 'ease',
						hoverStatus: true,
						transitionTarget: ['color'],
						disableTransition: false,
					},
				],
				sid: ['test-sid'],
				attributes: [{}],
			};

			const relation = new Relation(item);

			// Check that stylesObjs and effectsObjs were created
			expect(relation.stylesObjs).toBeDefined();
			expect(relation.stylesObjs.length).toBe(1);
			expect(relation.stylesObjs[0]).toHaveProperty('general');
			expect(relation.stylesObjs[0].general).toEqual({ color: 'red' });

			expect(relation.effectsObjs).toBeDefined();
			expect(relation.effectsObjs.length).toBe(1);

			// Check breakpoints object
			expect(relation.breakpointsObj).toBeDefined();
			expect(relation.breakpointsObj).toHaveProperty('general');
			expect(relation.breakpointsObj).toHaveProperty('xl');
			expect(relation.breakpointsObj.xl).toBe(1200);
		});

		it('should handle special cases for borders', () => {
			// Setup mock DOM elements
			const mockTriggerEl = {
				contains: jest.fn().mockReturnValue(false),
			};
			const mockTargetEl = {
				contains: jest.fn(),
				closest: jest.fn().mockReturnValue({ contains: jest.fn() }),
			};

			document.querySelector
				.mockReturnValueOnce(mockTriggerEl)
				.mockReturnValueOnce(mockTargetEl)
				.mockReturnValueOnce(mockTargetEl);

			const item = {
				uniqueID: 'test-unique-id',
				trigger: 'trigger-class',
				target: '.test-target',
				css: [
					{
						general: {
							styles: { 'border-width': '1px' },
							breakpoint: '',
						},
					},
				],
				effects: [
					{ hoverStatus: false, transitionTarget: ['border-width'] },
				],
				sid: ['border'],
				attributes: [{ 'border-width': '1px' }],
			};

			const relation = new Relation(item);

			// Check that isBorderArray was set correctly
			expect(relation.isBorderArray).toBeDefined();
			expect(relation.isBorderArray[0]).toBe(true);
		});

		it('should handle special cases for icons', () => {
			// Setup mock DOM elements
			const mockTriggerEl = {
				contains: jest.fn().mockReturnValue(false),
			};
			const mockTargetEl = {
				contains: jest.fn(),
				closest: jest.fn().mockReturnValue({ contains: jest.fn() }),
			};

			document.querySelector
				.mockReturnValueOnce(mockTriggerEl)
				.mockReturnValueOnce(mockTargetEl)
				.mockReturnValueOnce(mockTargetEl);

			const item = {
				uniqueID: 'test-unique-id',
				trigger: 'trigger-class',
				target: '.test-target',
				css: [
					{
						general: {
							styles: { color: 'red' },
							breakpoint: '',
						},
					},
				],
				effects: [{ hoverStatus: false }],
				sid: ['ic'], // Icon sid
				attributes: [{}],
			};

			const relation = new Relation(item);

			// Check that isIconArray was set correctly
			expect(relation.isIconArray).toBeDefined();
			expect(relation.isIconArray[0]).toBe(true);
		});

		it('should handle SVG elements correctly', () => {
			// Setup mock DOM elements
			const mockTriggerEl = {
				contains: jest.fn().mockReturnValue(false),
			};
			const mockTargetEl = {
				contains: jest.fn(),
				closest: jest.fn().mockReturnValue({ contains: jest.fn() }),
			};

			// Make fullTarget include 'svg-icon-maxi'
			document.querySelector
				.mockReturnValueOnce(mockTriggerEl)
				.mockReturnValueOnce(mockTargetEl)
				.mockReturnValueOnce(mockTargetEl);

			const item = {
				uniqueID: 'test-unique-id',
				trigger: 'trigger-class',
				target: '.svg-icon-maxi',
				css: [
					{
						general: {
							styles: { fill: 'red' },
							breakpoint: '',
						},
					},
				],
				effects: [{ hoverStatus: false }],
				sid: ['test-sid'],
				attributes: [{}],
			};

			const relation = new Relation(item);

			// Check that isSVG was set correctly
			expect(relation.isSVG).toBe(true);
		});

		it('should handle hover states and containment correctly', () => {
			// Setup mock DOM elements
			const mockTriggerEl = { contains: jest.fn().mockReturnValue(true) }; // trigger contains target
			const mockTargetEl = {
				contains: jest.fn(),
				closest: jest.fn().mockReturnValue({ contains: jest.fn() }),
			};

			document.querySelector
				.mockReturnValueOnce(mockTriggerEl)
				.mockReturnValueOnce(mockTargetEl)
				.mockReturnValueOnce(mockTargetEl);

			const item = {
				uniqueID: 'test-unique-id',
				trigger: 'trigger-class',
				target: '.test-target',
				css: [
					{
						general: {
							styles: { color: 'red' },
							breakpoint: '',
						},
					},
				],
				effects: [{ hoverStatus: true }], // Has hover
				sid: ['test-sid'],
				attributes: [{}],
			};

			const relation = new Relation(item);

			// Check hover and containment properties
			expect(relation.hoverStatus).toBe(true);
			expect(relation.isContained).toBe(true);
			expect(relation.isHoveredContained).toBe(true);
		});
	});

	describe('generateStylesEls', () => {
		let relation;
		let createElementSpy;
		let mockStyleElement;

		beforeEach(() => {
			// Create a mock style element
			mockStyleElement = {
				id: '',
				setAttribute: jest.fn(),
				innerText: '',
			};

			// Spy on document.createElement
			createElementSpy = jest
				.spyOn(document, 'createElement')
				.mockImplementation(() => ({ ...mockStyleElement }));

			// Create a Relation instance with necessary properties
			relation = new Relation({
				id: 'test-id',
				uniqueID: 'test-unique-id',
				css: [{ general: { styles: { color: 'red' } } }],
				trigger: 'test-trigger',
				target: 'test-target',
				action: 'test-action',
				sid: ['test-sid'],
				effects: [],
				attributes: [],
			});

			// Set the required properties for the test
			relation.stylesString = 'test-styles-string';
			relation.inTransitionString = 'test-in-transition-string';
			relation.outTransitionString = 'test-out-transition-string';
			relation.sids = ['test-sid'];
			relation.action = 'test-action';
		});

		it('should create a styles element with correct attributes', () => {
			// Call the method
			relation.generateStylesEls();

			// Verify createElement was called with 'style'
			expect(createElementSpy).toHaveBeenCalledWith('style');

			// Verify the styles element was created with correct attributes
			expect(relation.stylesEl).toBeDefined();
			expect(mockStyleElement.setAttribute).toHaveBeenCalledWith(
				'data-type',
				'test-action'
			);
			expect(mockStyleElement.setAttribute).toHaveBeenCalledWith(
				'data-sids',
				['test-sid']
			);
			expect(relation.stylesEl.innerText).toBe('test-styles-string');
		});

		it('should create an in-transition element when inTransitionString is not empty', () => {
			// Call the method
			relation.generateStylesEls();

			// Verify the in-transition element was created with correct attributes
			expect(relation.inTransitionEl).toBeDefined();
			expect(mockStyleElement.setAttribute).toHaveBeenCalledWith(
				'data-type',
				'test-action'
			);
			expect(mockStyleElement.setAttribute).toHaveBeenCalledWith(
				'data-sids',
				['test-sid']
			);
			expect(relation.inTransitionEl.innerText).toBe(
				'test-in-transition-string'
			);
		});

		it('should create an out-transition element when outTransitionString is not empty', () => {
			// Call the method
			relation.generateStylesEls();

			// Verify the out-transition element was created with correct attributes
			expect(relation.outTransitionEl).toBeDefined();
			expect(mockStyleElement.setAttribute).toHaveBeenCalledWith(
				'data-type',
				'test-action'
			);
			expect(mockStyleElement.setAttribute).toHaveBeenCalledWith(
				'data-sids',
				['test-sid']
			);
			expect(relation.outTransitionEl.innerText).toBe(
				'test-out-transition-string'
			);
		});

		it('should not create in-transition element when inTransitionString is empty', () => {
			// Set inTransitionString to empty
			relation.inTransitionString = '';

			// Call the method
			relation.generateStylesEls();

			// Verify the in-transition element was not created
			expect(relation.inTransitionEl).toBeUndefined();
		});

		it('should not create out-transition element when outTransitionString is empty', () => {
			// Set outTransitionString to empty
			relation.outTransitionString = '';

			// Call the method
			relation.generateStylesEls();

			// Verify the out-transition element was not created
			expect(relation.outTransitionEl).toBeUndefined();
		});

		it('should set correct IDs for all style elements', () => {
			// Call the method
			relation.generateStylesEls();

			// Verify the IDs are set correctly
			expect(relation.stylesEl.id).toBe(
				'relations--test-unique-id-test-id-styles'
			);
			expect(relation.inTransitionEl.id).toBe(
				'relations--test-unique-id-test-id-in-transitions'
			);
			expect(relation.outTransitionEl.id).toBe(
				'relations--test-unique-id-test-id-out-transitions'
			);
		});
	});

	describe('addStyleEl', () => {
		let relation;
		let mockStyleElement;
		let mockInlineStylesEl;
		let mockParentNode;
		let querySpyResults;
		let querySelectorSpy;

		beforeEach(() => {
			// Create mock elements
			mockStyleElement = {
				id: 'test-style-id',
				remove: jest.fn(),
			};

			mockParentNode = {
				insertBefore: jest.fn(),
			};

			mockInlineStylesEl = {
				parentNode: mockParentNode,
			};

			// Setup query spy with different results
			querySpyResults = {
				inlineStyles: mockInlineStylesEl,
				currentEl: null,
			};

			// Spy on document.querySelector
			querySelectorSpy = jest
				.spyOn(document, 'querySelector')
				.mockImplementation(selector => {
					if (selector === 'style[id*=maxi-blocks]') {
						return querySpyResults.inlineStyles;
					}
					if (selector === '#test-style-id') {
						return querySpyResults.currentEl;
					}
					return null;
				});

			// Create relation instance
			relation = new Relation({
				id: 'test-id',
				uniqueID: 'test-unique-id',
				css: [{ general: { styles: { color: 'red' } } }],
				trigger: 'test-trigger',
				target: 'test-target',
				action: 'test-action',
				sid: ['test-sid'],
				effects: [],
				attributes: [],
			});

			// Clear mock history after relation creation to get clean tests
			querySelectorSpy.mockClear();
		});

		it('should early return if styleEl is not provided', () => {
			// Call with no arguments
			relation.addStyleEl();

			// Verify querySelector wasn't called
			expect(document.querySelector).not.toHaveBeenCalled();
		});

		it('should find and set inlineStylesEl if not already set', () => {
			// Call the method
			relation.addStyleEl(mockStyleElement);

			// Verify querySelector was called to find inline styles
			expect(document.querySelector).toHaveBeenCalledWith(
				'style[id*=maxi-blocks]'
			);

			// Verify inlineStylesEl was set
			expect(relation.inlineStylesEl).toBe(mockInlineStylesEl);
		});

		it('should not look for inlineStylesEl if already set', () => {
			// Set inlineStylesEl
			relation.inlineStylesEl = mockInlineStylesEl;

			// Call the method
			relation.addStyleEl(mockStyleElement);

			// Verify querySelector was not called to find inline styles
			expect(document.querySelector).not.toHaveBeenCalledWith(
				'style[id*=maxi-blocks]'
			);
		});

		it('should check for existing element and remove it if found', () => {
			// Set up existing element
			const mockExistingEl = { remove: jest.fn() };
			querySpyResults.currentEl = mockExistingEl;

			// Call the method
			relation.addStyleEl(mockStyleElement);

			// Verify querySelector was called to find existing element
			expect(document.querySelector).toHaveBeenCalledWith(
				'#test-style-id'
			);

			// Verify existing element was removed
			expect(mockExistingEl.remove).toHaveBeenCalled();
		});

		it('should not try to remove if no existing element is found', () => {
			// Ensure no existing element
			querySpyResults.currentEl = null;

			// Call the method
			relation.addStyleEl(mockStyleElement);

			// Verify querySelector was called to find existing element
			expect(document.querySelector).toHaveBeenCalledWith(
				'#test-style-id'
			);

			// No element to remove, so no removal should happen
		});

		it('should insert the style element after inlineStylesEl', () => {
			// Call the method
			relation.addStyleEl(mockStyleElement);

			// Verify insertBefore was called correctly
			expect(mockParentNode.insertBefore).toHaveBeenCalledWith(
				mockStyleElement,
				mockInlineStylesEl.nextSibling
			);
		});
	});

	describe('setIsPreview', () => {
		let relation;
		let scheduledFrames;
		let animationTarget;

		beforeEach(() => {
			scheduledFrames = [];
			animationTarget = {
				animate: jest.fn(() => ({
					cancel: jest.fn(),
				})),
				getBoundingClientRect: jest.fn(() => ({
					left: 0,
					top: 0,
					right: 100,
					bottom: 100,
					width: 100,
					height: 100,
				})),
				getAttribute: jest.fn(() => null),
			};
			relation = new Relation({});
			relation.id = 'test-id';
			relation.uniqueID = 'test-unique-id';
			relation.action = 'hover';
			relation.trigger = 'test-trigger';
			relation.mainDocument = document;
			relation.mainDocument.querySelectorAll = jest.fn(() => [
				animationTarget,
			]);
			relation.stylesEl = {
				id: 'styles',
				innerText:
					'body.maxi-blocks--active .block[data-maxi-relations="true"] { opacity: 0.5; }',
				setAttribute: jest.fn(),
				remove: jest.fn(),
			};
			relation.inTransitionEl = {
				id: 'in-transition',
				innerText:
					'body.maxi-blocks--active .block[data-maxi-relations="true"] { transition: opacity 0.3s ease 0s; }',
				setAttribute: jest.fn(),
				remove: jest.fn(),
			};
			relation.outTransitionEl = {
				id: 'out-transition',
				innerText:
					'body.maxi-blocks--active .block[data-maxi-relations="true"] { transition: opacity 0.2s ease 0s; }',
				setAttribute: jest.fn(),
				remove: jest.fn(),
			};
			relation.mainWindow = {
				requestAnimationFrame: jest.fn(callback => {
					scheduledFrames.push(callback);
					return scheduledFrames.length;
				}),
				cancelAnimationFrame: jest.fn(),
				getComputedStyle: jest.fn(() => ({
					getPropertyValue: prop =>
						({
							opacity: '1',
							transform: 'none',
							transition: 'none 0s ease 0s',
							'transition-duration': '0s',
							'transition-delay': '0s',
						}[prop] || ''),
				})),
			};
			relation.triggerEl = {
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
			};
			relation.blockTargetEl = {
				matches: jest.fn(() => false),
			};
			relation.targetEl = {
				matches: jest.fn(() => false),
			};
			relation.isContained = false;
			relation.addRelationSubscriber = jest.fn();
			relation.removeRelationSubscriber = jest.fn();
			relation.removeAddAttrToBlock = jest.fn();
			relation.addTransition = jest.fn();
			relation.removeTransition = jest.fn();
			relation.removeStyles = jest.fn();
			relation.addDataAttrToBlock = jest.fn();
			relation.addStyles = jest.fn();
			relation.forcePreviewReflow = jest.fn();
			relation.getTransitionTimeout = jest.fn(() => 0);
			relation.getCurrentBreakpoint = jest.fn(() => 'general');
			relation.addStyleEl = jest.fn();
			relation.breakpoints = [
				'general',
				'xxl',
				'xl',
				'l',
				'm',
				's',
				'xs',
			];
			relation.breakpointsObj = { general: '' };
			relation.dataTarget = '.block[data-maxi-relations="true"]';
			relation.target = '';
			relation.stylesObjs = [
				{
					general: {
						opacity: '0.5',
						transform: 'translateX(20px)',
					},
				},
			];
			relation.effectsObjs = [
				{
					general: {
						'transition-status': true,
						'transition-duration': 0.3,
						'transition-delay': 0,
						easing: 'ease',
						split: false,
					},
				},
			];
			relation.effects = [{ disableTransition: false }];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [['']];
		});

		it('uses Web Animations preview without exporting hover end-state CSS', () => {
			relation.setIsPreview(true);

			expect(relation.removeStyles).toHaveBeenCalled();
			expect(relation.removeAddAttrToBlock).toHaveBeenCalled();
			expect(relation.triggerEl.addEventListener).toHaveBeenCalledWith(
				'mouseenter',
				expect.any(Function)
			);
			expect(relation.triggerEl.addEventListener).toHaveBeenCalledWith(
				'mouseleave',
				expect.any(Function)
			);
			expect(relation.addDataAttrToBlock).not.toHaveBeenCalled();
			expect(relation.addStyles).not.toHaveBeenCalled();
			expect(relation.addStyleEl).not.toHaveBeenCalled();
			expect(animationTarget.animate).not.toHaveBeenCalled();
		});

		it('plays a Web Animations preview on mouse enter without toggling the target attribute', () => {
			relation.setIsPreview(true);
			relation.addStyleEl.mockClear();

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			onMouseEnter();

			expect(relation.addDataAttrToBlock).not.toHaveBeenCalled();
			expect(relation.addRelationSubscriber).not.toHaveBeenCalled();
			expect(relation.forcePreviewReflow).toHaveBeenCalled();
			expect(relation.addStyles).not.toHaveBeenCalled();
			expect(
				relation.mainWindow.requestAnimationFrame
			).not.toHaveBeenCalled();
			expect(relation.addStyleEl).not.toHaveBeenCalledWith(
				relation.stylesEl
			);
			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ opacity: '1', transform: 'translateX(0px)' },
					{ opacity: '0.5', transform: 'translateX(20px)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);
		});

		it('does not play the transform out animation when the editor fires mouseleave while the trigger is still hovered', () => {
			relation.stylesObjs = [
				{
					general: {
						transform: 'translateY(30px)',
					},
				},
			];
			relation.triggerEl.matches = jest.fn(selector => {
				return selector === ':hover';
			});
			relation.setIsPreview(true);
			animationTarget.animate.mockClear();

			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];
			onMouseLeave();

			expect(animationTarget.animate).not.toHaveBeenCalled();
			expect(relation.previewHoverLeaveTimeout).toBeFalsy();
		});

		it('debounces transform Web Animations hover leave so a quick re-enter cancels the out animation', () => {
			jest.useFakeTimers();
			relation.stylesObjs = [
				{
					general: {
						transform: 'translateY(30px)',
					},
				},
			];
			relation.setIsPreview(true);
			animationTarget.animate.mockClear();

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];

			onMouseLeave();
			expect(animationTarget.animate).not.toHaveBeenCalled();

			onMouseEnter();
			jest.runOnlyPendingTimers();

			expect(animationTarget.animate).toHaveBeenCalledTimes(1);
			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ transform: 'translateY(0px)' },
					{ transform: 'translateY(30px)' },
				],
				expect.objectContaining({
					duration: 300,
					easing: 'ease',
				})
			);

			jest.useRealTimers();
		});

		it('uses Web Animations preview for SVG transform interactions', () => {
			relation.isSVG = true;
			relation.sids = ['t'];
			relation.stylesEl.innerText =
				'body.maxi-blocks--active .block[data-maxi-relations="true"] { transform: scaleX(1); transform-origin: 50% 50%; }';
			relation.inTransitionEl.innerText =
				'body.maxi-blocks--active .block[data-maxi-relations="true"] { transition: transform 0.3s ease 0s, transform-origin 0.3s ease 0s; }';
			relation.stylesObjs = [
				{
					general: {
						transform: 'scaleX(1) scaleY(1)',
					},
				},
			];
			relation.mainWindow.getComputedStyle = jest.fn(() => ({
				getPropertyValue: prop =>
					({
						transform: 'matrix(0, 0, 0, 0, 0, 0)',
					}[prop] || ''),
			}));

			relation.setIsPreview(true);
			relation.addStyleEl.mockClear();

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			onMouseEnter();

			expect(relation.addDataAttrToBlock).not.toHaveBeenCalled();
			expect(relation.forcePreviewReflow).toHaveBeenCalled();
			expect(relation.supportsWebAnimationPreview()).toBe(true);
			expect(relation.getPreviewMode()).toBe('web-animation');
			expect(relation.previewTransitionType).toBe('web-animation');
			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ transform: 'scaleX(0) scaleY(0)' },
					{ transform: 'scaleX(1) scaleY(1)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);
		});

		it('normalizes zero-matrix scale preview keyframes to compatible transform functions', () => {
			jest.useFakeTimers();
			let computedTransform = 'matrix(0, 0, 0, 0, 0, 0)';
			let computedTransformOrigin = '36px 0px';

			relation.stylesObjs = [
				{
					general: {
						transform:
							'scaleX(1) scaleY(1) translateX(0%) translateY(0px) rotateZ(0deg)',
						'transform-origin': '100% 0%',
					},
				},
			];
			relation.mainWindow.getComputedStyle = jest.fn(() => ({
				getPropertyValue: prop =>
					({
						transform: computedTransform,
						'transform-origin': computedTransformOrigin,
					}[prop] || ''),
			}));

			relation.setIsPreview(true);

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];
			onMouseEnter();

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{
						transform:
							'scaleX(0) scaleY(0) translateX(0%) translateY(0px) rotateZ(0deg)',
						transformOrigin: '36px 0px',
					},
					{
						transform:
							'scaleX(1) scaleY(1) translateX(0%) translateY(0px) rotateZ(0deg)',
						transformOrigin: '100% 0%',
					},
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);

			animationTarget.animate.mockClear();
			computedTransform = 'matrix(1, 0, 0, 1, 0, 0)';
			computedTransformOrigin = '100% 0%';

			onMouseLeave();
			jest.advanceTimersByTime(120);

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{
						transform:
							'scaleX(1) scaleY(1) translateX(0%) translateY(0px) rotateZ(0deg)',
						transformOrigin: '100% 0%',
					},
					{
						transform:
							'scaleX(0) scaleY(0) translateX(0%) translateY(0px) rotateZ(0deg)',
						transformOrigin: '36px 0px',
					},
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);

			jest.useRealTimers();
		});

		it('normalizes zero-matrix non-scale transform previews without injecting scale', () => {
			relation.stylesObjs = [
				{
					general: {
						transform: 'translateX(25%) rotateZ(15deg)',
						'transform-origin': '25% 75%',
					},
				},
			];
			relation.mainWindow.getComputedStyle = jest.fn(() => ({
				getPropertyValue: prop =>
					({
						transform: 'matrix(0, 0, 0, 0, 0, 0)',
						'transform-origin': '50% 50%',
					}[prop] || ''),
			}));

			relation.setIsPreview(true);

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			onMouseEnter();

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{
						transform: 'translateX(0%) rotateZ(0deg)',
						transformOrigin: '50% 50%',
					},
					{
						transform: 'translateX(25%) rotateZ(15deg)',
						transformOrigin: '25% 75%',
					},
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);
		});

		it('normalizes identity and translated matrices to compatible translate preview keyframes', () => {
			jest.useFakeTimers();
			let computedTransform = 'none';

			relation.stylesObjs = [
				{
					general: {
						transform: 'translateX(0%) translateY(30px)',
					},
				},
			];
			relation.mainWindow.getComputedStyle = jest.fn(() => ({
				getPropertyValue: prop =>
					({
						transform: computedTransform,
					}[prop] || ''),
			}));

			relation.setIsPreview(true);

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];

			onMouseEnter();

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ transform: 'translateX(0%) translateY(0px)' },
					{ transform: 'translateX(0%) translateY(30px)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);

			animationTarget.animate.mockClear();
			computedTransform = 'matrix(1, 0, 0, 1, 0, 30)';

			onMouseLeave();
			jest.advanceTimersByTime(120);

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ transform: 'translateX(0%) translateY(30px)' },
					{ transform: 'translateX(0%) translateY(0px)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);

			jest.useRealTimers();
		});

		it('normalizes none and identity matrix rotate previews to compatible rotate keyframes', () => {
			jest.useFakeTimers();
			let computedTransform = 'none';

			relation.stylesObjs = [
				{
					general: {
						transform: 'rotateZ(45deg)',
					},
				},
			];
			relation.mainWindow.getComputedStyle = jest.fn(() => ({
				getPropertyValue: prop =>
					({
						transform: computedTransform,
					}[prop] || ''),
			}));

			relation.setIsPreview(true);

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];

			onMouseEnter();

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ transform: 'rotateZ(0deg)' },
					{ transform: 'rotateZ(45deg)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);

			animationTarget.animate.mockClear();
			computedTransform =
				'matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)';

			onMouseLeave();
			jest.advanceTimersByTime(120);

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ transform: 'rotateZ(45deg)' },
					{ transform: 'rotateZ(0deg)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);

			jest.useRealTimers();
		});

		it('normalizes matrix3d rotate previews to authored rotate keyframes on hover out', () => {
			jest.useFakeTimers();
			let computedTransform =
				'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

			relation.stylesObjs = [
				{
					general: {
						transform: 'rotateX(45deg)',
					},
				},
			];
			relation.mainWindow.getComputedStyle = jest.fn(() => ({
				getPropertyValue: prop =>
					({
						transform: computedTransform,
					}[prop] || ''),
			}));

			relation.setIsPreview(true);

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];

			onMouseEnter();

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ transform: 'rotateX(0deg)' },
					{ transform: 'rotateX(45deg)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);

			animationTarget.animate.mockClear();
			computedTransform =
				'matrix3d(1, 0, 0, 0, 0, 0.707107, 0.707107, 0, 0, -0.707107, 0.707107, 0, 0, 0, 0, 1)';

			onMouseLeave();
			jest.advanceTimersByTime(120);

			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ transform: 'rotateX(45deg)' },
					{ transform: 'rotateX(0deg)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);

			jest.useRealTimers();
		});

		it('keeps SVG canvas transform preview CSS on the block target', () => {
			relation.isSVG = true;
			relation.sids = ['t'];
			relation.dataTarget =
				'.block.svg-icon-maxi-test[data-maxi-relations="true"][data-type="maxi-blocks/svg-icon-maxi"]';
			relation.stylesEl.innerText =
				'body.maxi-blocks--active .block.svg-icon-maxi-test[data-maxi-relations="true"][data-type="maxi-blocks/svg-icon-maxi"] { transform: scale(1.2) translateX(30px) rotateZ(20deg); transform-origin: 50% 50%; }';
			relation.inTransitionEl.innerText =
				'body.maxi-blocks--active .block.svg-icon-maxi-test[data-maxi-relations="true"][data-type="maxi-blocks/svg-icon-maxi"] { transition: transform 0.3s ease 0s, transform-origin 0.3s ease 0s; }';

			const hoverContent = relation.getPreviewHoverContent(
				relation.stylesEl
			);
			const transitionContent = relation.getPreviewHoverContent(
				relation.inTransitionEl
			);

			expect(hoverContent).toContain(
				'body.maxi-blocks--active:has(.test-trigger:hover) .block.svg-icon-maxi-test[data-type="maxi-blocks/svg-icon-maxi"] { transform: scale(1.2) translateX(30px) rotateZ(20deg); transform-origin: 50% 50%; }'
			);
			expect(transitionContent).toContain(
				'body.maxi-blocks--active:has(.test-trigger:hover) .block.svg-icon-maxi-test[data-type="maxi-blocks/svg-icon-maxi"] { transition: transform 0.3s ease 0s, transform-origin 0.3s ease 0s; }'
			);
			expect(hoverContent).not.toContain('.maxi-svg-icon-block__icon');
		});

		it('does not inject a pre-hover SVG transform reset', () => {
			relation.isSVG = true;
			relation.sids = ['t'];
			relation.blockTarget = '.svg-icon-maxi-test';
			relation.dataTarget =
				'.block.svg-icon-maxi-test[data-maxi-relations="true"][data-type="maxi-blocks/svg-icon-maxi"]';

			relation.setIsPreview(true);

			expect(relation.previewSvgStartStylesEl).toBeNull();
			expect(
				relation.addStyleEl.mock.calls.some(([styleEl]) =>
					styleEl?.innerText?.includes('transform: none !important')
				)
			).toBe(false);
		});

		it('includes relation config and animation traces in preview diagnostics', () => {
			relation.isSVG = true;
			relation.sids = ['t'];
			relation.transitionTargetsArray = [['']];
			relation.hasMultipleTargetsArray = [false];

			const details = relation.getPreviewRelationConfigDebugDetails();

			expect(details).toEqual(
				expect.objectContaining({
					previewMode: 'web-animation',
					sids: ['t'],
					isSVG: true,
					hasMultipleTargetsArray: [false],
					transitionTargetsArray: [['']],
					styles: [
						expect.objectContaining({
							index: 0,
							breakpoints: ['general'],
							properties: ['opacity', 'transform'],
						}),
					],
					effects: [
						expect.objectContaining({
							index: 0,
							breakpoints: ['general'],
							current: expect.objectContaining({
								'transition-duration': 0.3,
								easing: 'ease',
							}),
						}),
					],
					animationTargets: [
						expect.objectContaining({
							index: 0,
							selector: '.block ',
							keyframes: [
								{ opacity: '1', transform: 'translateX(0px)' },
								{
									opacity: '0.5',
									transform: 'translateX(20px)',
								},
							],
							options: expect.objectContaining({
								duration: 300,
								easing: 'ease',
							}),
						}),
					],
				})
			);
		});

		it('builds deep preview diagnostics with full CSS and selector matches', () => {
			relation.isSVG = true;
			relation.sids = ['t'];
			relation.blockTarget = '.svg-icon-maxi-test';
			relation.dataTarget =
				'.block.svg-icon-maxi-test[data-maxi-relations="true"][data-type="maxi-blocks/svg-icon-maxi"]';
			relation.stylesEl.innerText =
				'body.maxi-blocks--active .block.svg-icon-maxi-test[data-maxi-relations="true"][data-type="maxi-blocks/svg-icon-maxi"] { transform: scale(1.2); }';
			relation.stylesObjs = [
				{
					general: {
						transform: 'scale(1.2)',
					},
				},
			];

			relation.setIsPreview(true);

			const details = relation.getDeepPreviewDebugDetails('test-stage');

			expect(details.stage).toBe('test-stage');
			expect(details.generated.stylesObjs).toBe(relation.stylesObjs);
			expect(details.styleElements.staticStyles.content).toContain(
				'transform: scale(1.2)'
			);
			expect(details.styleElements.previewStyles).toBeNull();
			expect(details.animationTargets).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						selector:
							'.block.svg-icon-maxi-test[data-type="maxi-blocks/svg-icon-maxi"] ',
						keyframes: [
							{ transform: 'scale(1)' },
							{ transform: 'scale(1.2)' },
						],
					}),
				])
			);
			expect(details.selectors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						selector: expect.stringContaining(
							'.block.svg-icon-maxi-test'
						),
						matchCount: 1,
					}),
				])
			);
		});

		it('reverses the Web Animations preview on mouse leave', () => {
			jest.useFakeTimers();
			relation.setIsPreview(true);
			relation.removeStyles.mockClear();
			relation.removeAddAttrToBlock.mockClear();
			relation.removeRelationSubscriber.mockClear();
			relation.removeTransition.mockClear();
			relation.addTransition.mockClear();
			relation.forcePreviewReflow.mockClear();

			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];
			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			onMouseEnter();
			animationTarget.animate.mockClear();
			onMouseLeave();

			expect(relation.removeTransition).not.toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);

			jest.advanceTimersByTime(120);

			expect(relation.removeTransition).not.toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);
			expect(relation.forcePreviewReflow).toHaveBeenCalled();
			expect(
				relation.mainWindow.requestAnimationFrame
			).not.toHaveBeenCalled();
			expect(relation.removeStyles).not.toHaveBeenCalled();
			expect(relation.removeAddAttrToBlock).not.toHaveBeenCalled();
			expect(relation.removeRelationSubscriber).not.toHaveBeenCalled();
			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ opacity: '1', transform: 'translateX(0px)' },
					{ opacity: '1', transform: 'translateX(0px)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);
			jest.useRealTimers();
		});

		it('includes hit-testing and computed styles in hover diagnostics', () => {
			const elementFromPoint = {
				nodeName: 'DIV',
				id: 'overlay',
				className: 'block-editor-overlay',
				getAttribute: jest.fn(attr =>
					attr === 'data-type' ? 'core/overlay' : null
				),
			};
			const eventTarget = {
				nodeName: 'DIV',
				className: 'trigger-child',
				getAttribute: jest.fn(() => null),
			};

			relation.mainDocument.elementFromPoint = jest.fn(
				() => elementFromPoint
			);
			relation.mainWindow.getComputedStyle = jest.fn(element => ({
				getPropertyValue: prop =>
					({
						transition: 'transform 0.3s ease 0s',
						'transition-duration': '0.3s',
						'transition-delay': '0s',
						transform:
							element === relation.targetEl
								? 'matrix(1, 0, 0, 1, 20, 0)'
								: 'none',
						opacity: element === relation.targetEl ? '0.4' : '1',
					}[prop]),
			}));
			relation.triggerEl.getBoundingClientRect = jest.fn(() => ({
				left: 10,
				top: 20,
				right: 110,
				bottom: 120,
				width: 100,
				height: 100,
			}));
			relation.blockTargetEl = {
				matches: jest.fn(() => false),
				getAttribute: jest.fn(attr =>
					attr === 'data-maxi-relations' ? 'false' : null
				),
				getBoundingClientRect: jest.fn(() => ({
					left: 30,
					top: 40,
					right: 130,
					bottom: 140,
					width: 100,
					height: 100,
				})),
			};
			relation.targetEl = {
				matches: jest.fn(() => false),
				getBoundingClientRect: jest.fn(() => ({
					left: 35,
					top: 45,
					right: 135,
					bottom: 145,
					width: 100,
					height: 100,
				})),
			};

			const details = relation.getPreviewHoverEventDetails({
				clientX: 50,
				clientY: 60,
				target: eventTarget,
				currentTarget: relation.triggerEl,
				relatedTarget: null,
			});

			expect(details).toEqual(
				expect.objectContaining({
					pointer: { x: 50, y: 60 },
					pointerInsideTriggerBounds: true,
					webAnimationPreview: true,
					cssHoverPreview: false,
					blockDataAttr: 'false',
					elementFromPoint: expect.objectContaining({
						id: 'overlay',
						className: 'block-editor-overlay',
						dataType: 'core/overlay',
					}),
					eventTarget: expect.objectContaining({
						className: 'trigger-child',
					}),
					targetComputed: expect.objectContaining({
						transform: 'matrix(1, 0, 0, 1, 20, 0)',
						opacity: '0.4',
					}),
				})
			);
		});

		it('keeps hover preview active when the editor fires mouseleave while the trigger is still hovered', () => {
			relation.setIsPreview(true);
			relation.triggerEl.matches = jest.fn(selector => {
				return selector === ':hover';
			});
			relation.removeTransition.mockClear();
			relation.addTransition.mockClear();
			relation.forcePreviewReflow.mockClear();

			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];
			onMouseLeave();

			expect(relation.removeTransition).not.toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);
			expect(relation.forcePreviewReflow).toHaveBeenCalled();
		});

		it('keeps hover preview active when the editor fires mouseleave while a contained target is still hovered', () => {
			jest.useFakeTimers();
			relation.isContained = true;
			relation.blockTargetEl.matches = jest.fn(selector => {
				return selector === ':hover';
			});
			relation.setIsPreview(true);
			relation.forcePreviewReflow.mockClear();
			relation.removeAddAttrToBlock.mockClear();

			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];
			onMouseLeave();
			jest.runOnlyPendingTimers();

			expect(relation.forcePreviewReflow).toHaveBeenCalled();
			expect(relation.removeAddAttrToBlock).not.toHaveBeenCalled();
			jest.useRealTimers();
		});

		it('debounces hover leave so editor hover flicker can be cancelled by a quick re-enter', () => {
			jest.useFakeTimers();
			relation.setIsPreview(true);
			relation.removeTransition.mockClear();
			relation.addTransition.mockClear();
			relation.forcePreviewReflow.mockClear();

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];

			onMouseLeave();

			expect(relation.removeTransition).not.toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);

			onMouseEnter();
			jest.runOnlyPendingTimers();

			expect(relation.removeTransition).not.toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);

			jest.useRealTimers();
		});

		it('uses a short hover leave debounce even when the transition is longer', () => {
			jest.useFakeTimers();
			relation.getTransitionTimeout = jest.fn(() => 400);
			relation.setIsPreview(true);
			relation.removeTransition.mockClear();
			relation.addTransition.mockClear();
			relation.forcePreviewReflow.mockClear();

			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];

			onMouseLeave();
			jest.advanceTimersByTime(119);

			expect(relation.removeTransition).not.toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);

			jest.advanceTimersByTime(1);

			expect(relation.removeTransition).not.toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);
			expect(relation.removeAddAttrToBlock).toHaveBeenCalled();

			jest.useRealTimers();
		});

		it('keeps hover preview active when editor mouseleave is still inside the trigger bounds', () => {
			jest.useFakeTimers();
			relation.triggerEl.getBoundingClientRect = jest.fn(() => ({
				left: 10,
				top: 20,
				right: 110,
				bottom: 120,
				width: 100,
				height: 100,
			}));
			relation.setIsPreview(true);
			relation.removeTransition.mockClear();
			relation.addTransition.mockClear();
			relation.forcePreviewReflow.mockClear();

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];

			onMouseEnter({ clientX: 50, clientY: 60 });
			relation.forcePreviewReflow.mockClear();
			onMouseLeave({ clientX: 50, clientY: 60 });
			jest.runOnlyPendingTimers();

			expect(relation.removeTransition).not.toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);
			expect(relation.forcePreviewReflow).toHaveBeenCalled();

			jest.useRealTimers();
		});

		it('enables click preview and auto-applies the end state via scheduled demo', () => {
			relation.action = 'click';
			relation.setIsPreview(true);

			expect(relation.triggerEl.addEventListener).toHaveBeenCalledWith(
				'click',
				expect.any(Function)
			);

			expect(
				relation.mainWindow.requestAnimationFrame
			).toHaveBeenCalledWith(expect.any(Function));

			const rAfCallback =
				relation.mainWindow.requestAnimationFrame.mock.calls[0][0];
			rAfCallback();

			expect(relation.forcePreviewReflow).toHaveBeenCalled();
			expect(animationTarget.animate).toHaveBeenCalledWith(
				[
					{ opacity: '1', transform: 'translateX(0px)' },
					{ opacity: '0.5', transform: 'translateX(20px)' },
				],
				expect.objectContaining({
					duration: 300,
					delay: 0,
					easing: 'ease',
					fill: 'forwards',
				})
			);
		});

		it('removes preview event listeners when preview is disabled', () => {
			relation.setIsPreview(true);
			const previewElements = relation.addStyleEl.mock.calls.map(
				([element]) => element
			);

			const onMouseEnter =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseenter'
				)[1];
			const onMouseLeave =
				relation.triggerEl.addEventListener.mock.calls.find(
					([eventName]) => eventName === 'mouseleave'
				)[1];

			relation.setIsPreview(false);

			expect(relation.triggerEl.removeEventListener).toHaveBeenCalledWith(
				'mouseenter',
				onMouseEnter
			);
			expect(relation.triggerEl.removeEventListener).toHaveBeenCalledWith(
				'mouseleave',
				onMouseLeave
			);
			previewElements.forEach(element => {
				expect(element.remove).toHaveBeenCalled();
			});
		});

		it('shows the static end state without scheduling or adding transitions', () => {
			relation.setIsPreview(false, { staticState: 'end' });

			expect(relation.removeTransition).toHaveBeenCalledWith(
				relation.inTransitionEl
			);
			expect(relation.removeTransition).toHaveBeenCalledWith(
				relation.outTransitionEl
			);
			expect(relation.addTransition).not.toHaveBeenCalled();
			expect(relation.addDataAttrToBlock).toHaveBeenCalled();
			expect(relation.addStyles).toHaveBeenCalled();
		});

		it('returns to the static start state without playing the out transition', () => {
			relation.setIsPreview(false, { staticState: 'start' });

			expect(relation.addTransition).not.toHaveBeenCalledWith(
				relation.outTransitionEl
			);
			expect(relation.removeAddAttrToBlock).toHaveBeenCalled();
			expect(relation.removeStyles).toHaveBeenCalled();
			expect(relation.addDataAttrToBlock).not.toHaveBeenCalled();
			expect(relation.addStyles).not.toHaveBeenCalled();
		});
	});

	describe('forcePreviewReflow', () => {
		it('keeps preview diagnostics opt-in even on local hosts', () => {
			const relation = new Relation({});

			relation.mainWindow = {
				maxiIBAllowLocalDebugInTests: true,
				location: {
					hostname: 'localhost',
				},
				navigator: {
					userAgent:
						'Mozilla/5.0 Chrome/148.0.7778.168 Safari/537.36',
				},
			};

			expect(relation.isPreviewDebugEnabled()).toBe(false);

			relation.mainWindow.localStorage = {
				getItem: jest.fn(key =>
					key === 'maxiIBDebug' ? 'true' : null
				),
			};

			expect(relation.isPreviewDebugEnabled()).toBe(true);
		});

		it('keeps preview diagnostics off for non-local hosts by default', () => {
			const relation = new Relation({});

			relation.mainWindow = {
				location: {
					hostname: 'example.com',
				},
				localStorage: {
					getItem: jest.fn(() => null),
				},
				navigator: {
					userAgent:
						'Mozilla/5.0 Chrome/148.0.7778.168 Safari/537.36',
				},
			};

			expect(relation.isPreviewDebugEnabled()).toBe(false);
		});

		it('flushes layout and computed transition styles for preview targets', () => {
			const relation = new Relation({});
			const offsetHeightGetter = jest.fn(() => 10);
			const getBoundingClientRect = jest.fn(() => ({
				width: 10,
				height: 10,
			}));
			const getPropertyValue = jest.fn(() => 'opacity 0.3s ease 0s');
			const targetEl = { getBoundingClientRect };

			Object.defineProperty(targetEl, 'offsetHeight', {
				get: offsetHeightGetter,
			});

			relation.transitionTargetsArray = [[' .target']];
			relation.dataTarget = '.block[data-maxi-relations="true"]';
			relation.mainDocument = {
				querySelectorAll: jest.fn(() => [targetEl]),
			};
			relation.mainWindow = {
				getComputedStyle: jest.fn(() => ({ getPropertyValue })),
			};

			relation.forcePreviewReflow();

			expect(relation.mainDocument.querySelectorAll).toHaveBeenCalledWith(
				'.block[data-maxi-relations="true"] .target'
			);
			expect(getBoundingClientRect).toHaveBeenCalled();
			expect(offsetHeightGetter).toHaveBeenCalled();
			expect(relation.mainWindow.getComputedStyle).toHaveBeenCalledWith(
				targetEl
			);
			expect(getPropertyValue).toHaveBeenCalledWith('transition');
		});

		it('logs target diagnostics as warnings when local debug is enabled', () => {
			const relation = new Relation({});
			const warn = jest.fn();
			jest.spyOn(window.console, 'warn').mockImplementation(jest.fn());
			const targetEl = {
				getBoundingClientRect: jest.fn(() => ({
					width: 10,
					height: 10,
				})),
				offsetHeight: 10,
			};

			relation.id = 3;
			relation.uniqueID = 'text-maxi-test';
			relation.action = 'hover';
			relation.trigger = 'trigger-test';
			relation.target = '';
			relation.transitionTargetsArray = [[' .target']];
			relation.dataTarget =
				'.block[data-maxi-relations="true"][data-type="maxi-blocks/text-maxi"]';
			relation.blockTargetEl = {
				getAttribute: jest.fn(() => 'true'),
			};
			relation.mainDocument = {
				querySelectorAll: jest.fn(() => [targetEl]),
			};
			relation.mainWindow = {
				console: { warn },
				localStorage: {
					getItem: jest.fn(() => 'true'),
				},
				getComputedStyle: jest.fn(() => ({
					getPropertyValue: prop =>
						({
							transition: 'transform 0.3s ease 0s',
							transform: 'matrix(1, 0, 0, 1, 10, 0)',
							opacity: '1',
						}[prop]),
				})),
			};

			relation.forcePreviewReflow();

			expect(warn).toHaveBeenCalledWith(
				'[Maxi IB Preview]',
				'force-reflow',
				expect.objectContaining({
					id: 3,
					uniqueID: 'text-maxi-test',
					action: 'hover',
					targets: [
						expect.objectContaining({
							matchCount: 1,
							blockDataAttr: 'true',
							computed: expect.objectContaining({
								transition: 'transform 0.3s ease 0s',
								transform: 'matrix(1, 0, 0, 1, 10, 0)',
							}),
						}),
					],
				})
			);
		});

		it('logs when a relation cannot find the trigger or target element', () => {
			const warn = jest.fn();

			jest.spyOn(window.console, 'warn').mockImplementation(warn);
			window.maxiIBAllowLocalDebugInTests = true;
			window.maxiIBDebug = true;
			Object.defineProperty(window, 'location', {
				value: { hostname: 'localhost' },
				configurable: true,
			});
			Object.defineProperty(window, 'navigator', {
				value: {
					userAgent:
						'Mozilla/5.0 Chrome/148.0.7778.168 Safari/537.36',
				},
				configurable: true,
			});

			document.querySelector.mockReturnValue(null);

			new Relation({
				id: 9,
				uniqueID: 'missing-target',
				trigger: 'missing-trigger',
				target: '.missing-target',
				css: [{ general: { styles: { opacity: '0' } } }],
			});

			expect(warn).toHaveBeenCalledWith(
				'[Maxi IB Preview]',
				'constructor:missing-elements',
				expect.objectContaining({
					id: 9,
					uniqueID: 'missing-target',
					triggerFound: false,
					targetFound: false,
				})
			);
			delete window.maxiIBAllowLocalDebugInTests;
			delete window.maxiIBDebug;
		});
	});

	describe('getLastUsableBreakpoint', () => {
		let relation;

		beforeEach(() => {
			relation = new Relation({
				id: 'test-id',
				uniqueID: 'test-unique-id',
				css: [{ general: { styles: { color: 'red' } } }],
				trigger: 'test-trigger',
				target: 'test-target',
				action: 'test-action',
				sid: ['test-sid'],
				effects: [],
				attributes: [],
			});

			// Set breakpoints array for testing
			relation.breakpoints = [
				'general',
				'xxl',
				'xl',
				'l',
				'm',
				's',
				'xs',
			];
		});

		it('should return the current breakpoint if callback returns true for it', () => {
			const callback = jest.fn(bp => bp === 'xl');
			const result = relation.getLastUsableBreakpoint('xl', callback);

			expect(result).toBe('xl');
			expect(callback).toHaveBeenCalledWith('xl');
		});

		it('should return a higher breakpoint if callback only returns true for it', () => {
			const callback = jest.fn(bp => bp === 'general');
			const result = relation.getLastUsableBreakpoint('xl', callback);

			expect(result).toBe('general');
			expect(callback).toHaveBeenCalledTimes(3); // general, xxl, xl
		});

		it('should search through all higher breakpoints in reverse order', () => {
			const callback = jest.fn(bp => false);
			relation.getLastUsableBreakpoint('m', callback);

			// Check it called with m, l, xl, xxl, general in that order
			expect(callback.mock.calls).toEqual([
				['m'],
				['l'],
				['xl'],
				['xxl'],
				['general'],
			]);
		});

		it('should return undefined if no breakpoint satisfies the callback', () => {
			const callback = jest.fn(bp => false);
			const result = relation.getLastUsableBreakpoint('l', callback);

			expect(result).toBeUndefined();
		});

		it('should handle the "general" breakpoint correctly', () => {
			const callback = jest.fn(bp => bp === 'general');
			const result = relation.getLastUsableBreakpoint(
				'general',
				callback
			);

			expect(result).toBe('general');
			expect(callback).toHaveBeenCalledTimes(1);
		});
	});

	describe('generateCssResponsiveObj', () => {
		let relation;

		beforeEach(() => {
			// Spy on getLastUsableBreakpoint to simplify testing
			jest.spyOn(
				Relation.prototype,
				'getLastUsableBreakpoint'
			).mockImplementation(
				(currentBreakpoint, callback) => currentBreakpoint
			);

			// Create relation instance with minimal properties
			relation = new Relation({
				id: 'test-id',
				uniqueID: 'test-unique-id',
				css: [],
				trigger: 'test-trigger',
				target: 'test-target',
			});

			// Set required properties
			relation.breakpoints = [
				'general',
				'xxl',
				'xl',
				'l',
				'm',
				's',
				'xs',
			];
			relation.hasMultipleTargetsArray = [];
		});

		it('should handle basic single-target CSS object', () => {
			// Set up test data
			relation.css = [
				{
					general: {
						styles: {
							color: 'var(--maxi-light-p-color,rgba(var(--maxi-light-color-3,155,155,155),0.66))',
						},
						breakpoint: null,
					},
				},
			];

			relation.effects = [
				{
					'transition-status-general': true,
					'transition-duration-general': 0.6,
					'transition-delay-general': 0,
					'easing-general': 'ease',
					disableTransition: false,
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateCssResponsiveObj();

			// Verify basic structure
			expect(result).toHaveProperty('stylesObjs');
			expect(result).toHaveProperty('effectsObjs');

			// Verify content matches expected
			expect(result.stylesObjs[0].general).toEqual({
				color: 'var(--maxi-light-p-color,rgba(var(--maxi-light-color-3,155,155,155),0.66))',
			});
		});

		it('should process effects correctly', () => {
			// Set up test data
			relation.css = [
				{
					general: {
						styles: { color: 'red' },
						breakpoint: null,
					},
				},
			];

			relation.effects = [
				{
					'transition-duration-general': 0.6,
					'transition-delay-general': 0,
					'easing-general': 'ease',
					'transition-status-general': true,
					hoverStatus: false,
					disableTransition: false,
					transitionTarget: [
						' .maxi-text-block__content',
						' .maxi-text-block__content li',
						' .maxi-text-block__content ol',
					],
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateCssResponsiveObj();

			// Verify effects object
			expect(result.effectsObjs[0].general).toHaveProperty(
				'transition-status'
			);
			expect(result.effectsObjs[0].general).toHaveProperty(
				'transition-duration'
			);
			expect(result.effectsObjs[0].general).toHaveProperty(
				'transition-delay'
			);
			expect(result.effectsObjs[0].general).toHaveProperty('easing');
			expect(result.effectsObjs[0].general).toHaveProperty('split');
		});

		it('should clean redundant breakpoint values', () => {
			// Set up test data with duplicate styles across breakpoints
			relation.css = [
				{
					xl: {
						styles: { color: 'red' },
						breakpoint: null,
					},
					l: {
						styles: { color: 'red' }, // Same as general
						breakpoint: 1920,
					},
					m: {
						styles: { color: 'blue' }, // Different
						breakpoint: 1366,
					},
				},
			];

			relation.effects = [
				{
					disableTransition: true, // Disable transitions for simplicity
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateCssResponsiveObj();

			// Verify redundant breakpoint was removed
			expect(result.stylesObjs[0]).toHaveProperty('xl');
			expect(result.stylesObjs[0]).not.toHaveProperty('l'); // Should be removed as duplicate
			expect(result.stylesObjs[0]).toHaveProperty('m');
			expect(result.stylesObjs[0].m).toEqual({ color: 'blue' });
		});

		it('should handle multiple targets CSS', () => {
			// Set up test data with multiple targets
			relation.css = [
				{
					'.target1': {
						general: {
							styles: { color: 'red' },
							breakpoint: null,
						},
					},
					'.target2': {
						general: {
							styles: { background: 'blue' },
							breakpoint: null,
						},
					},
				},
			];

			relation.effects = [
				{
					disableTransition: true, // Disable transitions for simplicity
				},
			];

			relation.hasMultipleTargetsArray = [true];

			// Call the method
			const result = relation.generateCssResponsiveObj();

			// Verify multiple targets structure
			expect(result.stylesObjs[0]).toEqual({
				'.target1': { general: { color: 'red' } },
				'.target2': { general: { background: 'blue' } },
			});
		});

		it('should handle disabled transitions', () => {
			// Set up test data
			relation.css = [
				{
					general: {
						styles: { color: 'red' },
						breakpoint: null,
					},
				},
			];

			relation.effects = [
				{
					disableTransition: true,
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateCssResponsiveObj();

			// Verify effects object is empty or null
			expect(result.effectsObjs[0]).toBeNull();
		});

		it('should process empty CSS objects', () => {
			// Set up test data
			relation.css = [
				{
					general: {
						styles: {},
						breakpoint: null,
					},
				},
			];

			relation.effects = [
				{
					disableTransition: true,
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateCssResponsiveObj();

			// Verify empty styles object
			expect(result.stylesObjs[0]).toEqual({ general: {} });
		});
	});

	describe('generateBreakpointsObj', () => {
		let relation;

		beforeEach(() => {
			// Create relation instance with minimal properties
			relation = new Relation({
				id: 'test-id',
				uniqueID: 'test-unique-id',
				css: [],
				trigger: 'test-trigger',
				target: 'test-target',
			});

			// Set required properties
			relation.breakpoints = [
				'general',
				'xxl',
				'xl',
				'l',
				'm',
				's',
				'xs',
			];
			relation.hasMultipleTargetsArray = [];
		});

		it('should process single breakpoint CSS object', () => {
			// Set up test data with single breakpoint
			relation.css = [
				{
					general: {
						styles: {
							color: 'var(--maxi-light-p-color,rgba(var(--maxi-light-color-3,155,155,155),0.66))',
						},
						breakpoint: null,
					},
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateBreakpointsObj();

			// Verify result
			expect(result).toEqual({
				general: '', // general breakpoint value is set to empty string
			});
		});

		it('should process multiple breakpoints', () => {
			// Set up test data with multiple breakpoints
			relation.css = [
				{
					general: {
						styles: { color: 'red' },
						breakpoint: null,
					},
					xl: {
						styles: { color: 'blue' },
						breakpoint: 1920,
					},
					m: {
						styles: { color: 'green' },
						breakpoint: 1024,
					},
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateBreakpointsObj();

			// Verify result contains all breakpoints with correct values
			expect(result).toEqual({
				general: '',
				xl: 1920,
				m: 1024,
			});
		});

		it('should handle multiple targets CSS', () => {
			// Set up test data with multiple targets
			relation.css = [
				{
					'.target1': {
						general: {
							styles: { color: 'red' },
							breakpoint: null,
						},
						xl: {
							styles: { color: 'blue' },
							breakpoint: 1920,
						},
					},
					'.target2': {
						m: {
							styles: { background: 'green' },
							breakpoint: 1024,
						},
					},
				},
			];

			relation.hasMultipleTargetsArray = [true];

			// Call the method
			const result = relation.generateBreakpointsObj();

			// Verify result includes breakpoints from all targets
			expect(result).toEqual({
				general: '',
				xl: 1920,
				m: 1024,
			});
		});

		it('should skip breakpoints with empty styles', () => {
			// Set up test data with empty styles
			relation.css = [
				{
					general: {
						styles: { color: 'red' },
						breakpoint: null,
					},
					xl: {
						styles: {}, // Empty styles object
						breakpoint: 1920,
					},
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateBreakpointsObj();

			// Verify only breakpoints with styles are included
			expect(result).toEqual({
				general: '',
			});
			expect(result).not.toHaveProperty('xl');
		});

		it('should handle array-style CSS objects', () => {
			// Set up test data with isArray flag
			relation.css = [
				{
					general: {
						styles: { isArray: true, length: 2 }, // Mock array-like object
						breakpoint: null,
					},
				},
			];

			relation.hasMultipleTargetsArray = [false];

			// Call the method
			const result = relation.generateBreakpointsObj();

			// Verify array styles are processed correctly
			expect(result).toEqual({
				general: '',
			});
		});

		it('should handle non-array CSS', () => {
			// Set non-array CSS
			relation.css = {
				general: {
					styles: { color: 'red' },
					breakpoint: null,
				},
			};

			// Call the method
			const result = relation.generateBreakpointsObj();

			// Should return empty object since it only processes array CSS
			expect(result).toEqual({});
		});
	});

	describe('getAvoidHover', () => {
		let relation;
		let mockTargetEl;
		let mockMaxiBlock;
		let mockElements;

		beforeEach(() => {
			// Create mock elements with containment relationships
			mockElements = [
				{ id: 'element1' },
				{ id: 'element2' },
				{ id: 'element3' },
			];

			mockMaxiBlock = { contains: jest.fn() };
			mockTargetEl = {
				contains: jest.fn(),
				closest: jest.fn().mockReturnValue(mockMaxiBlock),
			};

			// Create relation instance with minimal properties
			relation = new Relation({
				id: 'test-id',
				uniqueID: 'test-unique-id',
				css: [],
				trigger: 'test-trigger',
				target: 'test-target',
				effects: [{ hoverStatus: true }],
				attributes: [],
			});

			// Set required properties
			relation.targetEl = mockTargetEl;
			relation.hoverStatus = true;
			relation.transitionTargetsArray = [
				[
					' .maxi-text-block__content',
					' .maxi-text-block__content li',
					' .maxi-text-block__content ol',
				],
			];
			relation.fullTarget =
				'.edit-post-visual-editor[maxi-blocks-responsive] .maxi-block.maxi-block--backend.text-maxi-605db4c7-u p.maxi-text-block__content';
			relation.avoidHoverArray = [];
			relation.mainDocument = document;

			// Mock document.querySelectorAll
			jest.spyOn(document, 'querySelectorAll').mockReturnValue(
				mockElements
			);
		});

		it('should early return if hoverStatus is false', () => {
			// Set hoverStatus to false
			relation.hoverStatus = false;

			// Call the method
			relation.getAvoidHover();

			// Verify avoidHoverArray is empty
			expect(relation.avoidHoverArray).toEqual([]);
			expect(document.querySelectorAll).not.toHaveBeenCalled();
		});

		it('should early return if targetEl is not set', () => {
			// Set targetEl to null
			relation.targetEl = null;

			// Call the method
			relation.getAvoidHover();

			// Verify avoidHoverArray is empty
			expect(relation.avoidHoverArray).toEqual([]);
			expect(document.querySelectorAll).not.toHaveBeenCalled();
		});

		it('should push true when elements are contained within targetEl and maxi-block', () => {
			// Set up mock containment (all elements contained)
			mockMaxiBlock.contains.mockReturnValue(true);
			mockTargetEl.contains.mockReturnValue(true);

			// Call the method
			relation.getAvoidHover();

			// Verify avoidHoverArray contains true
			expect(relation.avoidHoverArray).toEqual([true]);

			// Verify querySelectorAll was called with correct selectors
			expect(document.querySelectorAll).toHaveBeenCalledWith(
				`${relation.fullTarget} ${relation.transitionTargetsArray[0][0]}`
			);
		});

		it('should push false when elements are not contained within targetEl', () => {
			// Set up mock containment (maxi-block contains elements but targetEl doesn't)
			mockMaxiBlock.contains.mockReturnValue(true);
			mockTargetEl.contains.mockReturnValue(false);

			// Call the method
			relation.getAvoidHover();

			// Verify avoidHoverArray contains false
			expect(relation.avoidHoverArray).toEqual([false]);
		});

		it('should push false when elements are not contained within maxi-block', () => {
			// Set up mock containment (maxi-block doesn't contain elements)
			mockMaxiBlock.contains.mockReturnValue(false);

			// Call the method
			relation.getAvoidHover();

			// Verify avoidHoverArray contains false
			expect(relation.avoidHoverArray).toEqual([false]);
		});

		it('should check all transition targets until a match is found', () => {
			// Mock querySelectorAll to return different results for different selectors
			jest.spyOn(document, 'querySelectorAll').mockImplementation(
				selector => {
					if (selector.includes('li')) {
						return mockElements;
					}
					return [];
				}
			);

			// First call returns empty array (no match)
			// Second call returns elements and they're contained
			mockMaxiBlock.contains.mockReturnValue(true);
			mockTargetEl.contains.mockReturnValue(true);

			// Call the method
			relation.getAvoidHover();

			// Verify avoidHoverArray contains true
			expect(relation.avoidHoverArray).toEqual([true]);

			// Verify querySelectorAll was called 2 times and stopped when match was found
			expect(document.querySelectorAll).toHaveBeenCalledTimes(2);
		});

		it('should handle when fullTarget includes the transition target', () => {
			// Setup where fullTarget includes one of the transition targets
			relation.fullTarget = '.some-selector .maxi-text-block__content';

			// Call the method
			relation.getAvoidHover();

			// Verify querySelectorAll was called with correct selector (empty string for that target)
			expect(document.querySelectorAll).toHaveBeenCalledWith(
				`${relation.fullTarget} `
			);
		});
	});

	describe('getTargetForLine', () => {
		let relation;

		beforeEach(() => {
			// Create relation instance with required properties
			relation = new Relation({
				id: 'test-id',
				uniqueID: 'test-unique-id',
				css: [],
				trigger: 'test-trigger',
				target: '.test-target',
			});

			// Set required properties
			relation.target = '.test-target';
			relation.dataTarget = '.maxi-block--backend.test-unique-id';
		});

		it('should append transitionTarget to mainTarget when transitionTarget is not included in mainTarget', () => {
			const transitionTarget = '.transition-target';
			const mainTarget = '.main-target';

			const result = relation.getTargetForLine(
				transitionTarget,
				mainTarget
			);

			expect(result).toBe('.main-target .transition-target');
		});

		it('should return only mainTarget when transitionTarget is already included in mainTarget', () => {
			const transitionTarget = '.transition-target';
			const mainTarget = '.main-target .transition-target';

			const result = relation.getTargetForLine(
				transitionTarget,
				mainTarget
			);

			expect(result).toBe('.main-target .transition-target');
		});

		it('should append this.target to mainTarget when transitionTarget is not provided', () => {
			const mainTarget = '.main-target';

			const result = relation.getTargetForLine(null, mainTarget);

			expect(result).toBe('.main-target .test-target');
		});

		it('should use dataTarget as default for mainTarget', () => {
			const transitionTarget = '.transition-target';

			const result = relation.getTargetForLine(transitionTarget);

			expect(result).toBe(
				'.maxi-block--backend.test-unique-id .transition-target'
			);
		});

		it('should handle empty strings as transitionTarget', () => {
			const transitionTarget = '';
			const mainTarget = '.main-target';

			const result = relation.getTargetForLine(
				transitionTarget,
				mainTarget
			);

			// Empty string is falsy, so should append this.target
			expect(result).toBe('.main-target .test-target');
		});

		it('should handle complex selectors in both mainTarget and transitionTarget', () => {
			const transitionTarget =
				'.parent > .child[data-attr="value"]::after';
			const mainTarget = '.wrapper .container';

			const result = relation.getTargetForLine(
				transitionTarget,
				mainTarget
			);

			expect(result).toBe(
				'.wrapper .container .parent > .child[data-attr="value"]::after'
			);
		});
	});

	describe('generateStyles', () => {
		let relation;

		beforeEach(() => {
			// Create relation instance with minimum required properties
			relation = new Relation({
				id: 'test-id',
				uniqueID: 'test-unique-id',
				css: [
					{
						general: {
							styles: {
								color: 'var(--maxi-light-p-color,rgba(var(--maxi-light-color-3,155,155,155),0.66))',
							},
							breakpoint: null,
						},
					},
				],
				trigger: 'test-trigger',
				target: '.test-target',
			});

			// Mock isBorderArray to be false
			relation.isBorderArray = [false];

			// Reset stylesString before each test
			relation.stylesString = '';
		});

		it('should generate styles for single breakpoint and simple selectors', () => {
			// Set up test data
			relation.stylesObjs = [
				{
					general: {
						color: 'var(--maxi-light-p-color,rgba(var(--maxi-light-color-3,155,155,155),0.66))',
					},
				},
			];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [
				[
					' .maxi-text-block__content',
					' .maxi-text-block__content li',
					' .maxi-text-block__content ol',
				],
			];
			relation.avoidHoverArray = [false];
			relation.isSiteEditor = false;
			relation.isSVG = false;
			relation.isBorderArray = [false];
			relation.breakpointsObj = { general: '' };
			relation.dataTarget =
				'.edit-post-visual-editor[maxi-blocks-responsive] .maxi-block.maxi-block--backend.text-maxi-123[data-maxi-relations="true"][data-type="maxi-blocks/text-maxi"]';

			// Call the method
			relation.generateStyles();

			// Verify styles were generated for each transition target
			expect(relation.stylesString).toContain(
				'.maxi-text-block__content {'
			);
			expect(relation.stylesString).toContain(
				'.maxi-text-block__content li {'
			);
			expect(relation.stylesString).toContain(
				'.maxi-text-block__content ol {'
			);
			expect(relation.stylesString).toContain(
				'color: var(--maxi-light-p-color'
			);
		});

		it('should handle multiple breakpoints correctly', () => {
			// Set up test data with multiple breakpoints
			relation.stylesObjs = [
				{
					general: {
						color: 'red',
					},
					xl: {
						color: 'blue',
					},
				},
			];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [[' .target']];
			relation.avoidHoverArray = [false];
			relation.isSiteEditor = false;
			relation.breakpointsObj = {
				general: '',
				xl: 1200,
			};
			relation.dataTarget =
				'.edit-post-visual-editor[maxi-blocks-responsive] .test-block';

			// Call the method
			relation.generateStyles();

			// Verify general and xl breakpoint styles were generated
			expect(relation.stylesString).toContain(
				'[maxi-blocks-responsive] .test-block .target {'
			);
			expect(relation.stylesString).toContain(
				'[maxi-blocks-responsive="xl"] .test-block .target {'
			);
			expect(relation.stylesString).toContain('color: red');
			expect(relation.stylesString).toContain('color: blue');
		});

		it('should handle multiple target arrays', () => {
			// Set up test data with multiple targets
			relation.stylesObjs = [
				{
					'.target1': {
						general: {
							color: 'red',
						},
					},
					'.target2': {
						general: {
							background: 'blue',
						},
					},
				},
			];
			relation.hasMultipleTargetsArray = [true];
			relation.avoidHoverArray = [false];
			relation.isSiteEditor = false;
			relation.breakpointsObj = { general: '' };
			relation.dataTarget = '.test-block';

			// Call the method
			relation.generateStyles();

			// Verify styles were generated for both targets
			expect(relation.stylesString).toContain('.test-block .target1 {');
			expect(relation.stylesString).toContain('.test-block .target2 {');
			expect(relation.stylesString).toContain('color: red');
			expect(relation.stylesString).toContain('background: blue');
		});

		it('should add !important for divider width/height', () => {
			// Set up test data for divider
			relation.stylesObjs = [
				{
					general: {
						width: '100px',
						color: 'red',
					},
				},
			];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [[' .target']];
			relation.avoidHoverArray = [false];
			relation.isSiteEditor = false;
			relation.isSVG = false;
			relation.breakpointsObj = { general: '' };
			relation.dataTarget = '.maxi-block.divider-maxi';

			// Call the method
			relation.generateStyles();

			// Verify !important was added only to width
			expect(relation.stylesString).toContain('width: 100px !important;');
			expect(relation.stylesString).toContain('color: red;');
			expect(relation.stylesString).not.toContain(
				'color: red !important;'
			);
		});

		it('should handle hover avoidance', () => {
			// Set up test data with avoidHover true
			relation.stylesObjs = [
				{
					general: {
						color: 'red',
					},
				},
			];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [[' .target']];
			relation.avoidHoverArray = [true];
			relation.isSiteEditor = false;
			relation.isSVG = false;
			relation.breakpointsObj = { general: '' };
			relation.dataTarget = '.test-block';

			// Call the method
			relation.generateStyles();

			// Verify :not(:hover) was added to selector
			expect(relation.stylesString).toContain(
				'.test-block .target:not(:hover) {'
			);
		});

		it('should handle button elements correctly', () => {
			// Set up test data for button
			relation.stylesObjs = [
				{
					general: {
						color: 'red',
					},
				},
			];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [[' .maxi-button-block__button']];
			relation.avoidHoverArray = [true];
			relation.isSiteEditor = false;
			relation.isSVG = false;
			relation.breakpointsObj = { general: '' };
			relation.dataTarget = '.test-block';

			// Call the method
			relation.generateStyles();

			// Verify :not(:hover) was added correctly for button
			expect(relation.stylesString).toContain(
				'.test-block .maxi-button-block__button:not(:hover) {'
			);
		});

		it('should handle SVG elements correctly', () => {
			// Set up test data for SVG
			relation.stylesObjs = [
				{
					general: {
						fill: 'red',
					},
				},
			];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [[' .maxi-svg-icon-block__icon']];
			relation.avoidHoverArray = [true];
			relation.isSiteEditor = false;
			relation.isSVG = true;
			relation.breakpointsObj = { general: '' };
			relation.dataTarget = '.test-block';

			// Call the method
			relation.generateStyles();

			// Verify :not(:hover) was added correctly for SVG
			expect(relation.stylesString).toContain(
				'.test-block .maxi-svg-icon-block__icon:not(:hover) {'
			);
		});

		it('should handle button content elements correctly', () => {
			// Set up test data for button content
			relation.stylesObjs = [
				{
					general: {
						color: 'red',
					},
				},
			];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [
				[' .maxi-button-block__content'],
			];
			relation.avoidHoverArray = [true];
			relation.isSiteEditor = false;
			relation.isSVG = false;
			relation.breakpointsObj = { general: '' };
			relation.dataTarget = '.test-block';

			// Call the method
			relation.generateStyles();

			// Verify selector was transformed correctly for button content
			expect(relation.stylesString).toContain(
				'.test-block .maxi-button-block__button:not(:hover) .maxi-button-block__content {'
			);
		});

		it('should handle site editor selectors', () => {
			// Set up test data in site editor mode
			relation.stylesObjs = [
				{
					general: {
						color: 'red',
					},
				},
			];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [[' .target']];
			relation.avoidHoverArray = [false];
			relation.isSiteEditor = true;
			relation.isSVG = false;
			relation.breakpointsObj = { general: '' };
			relation.dataTarget = '.test-block';

			// Call the method
			relation.generateStyles();

			// Verify site editor format (no space after body)
			expect(relation.stylesString).toContain(
				'body.maxi-blocks--active.test-block .target {'
			);
		});
	});

	describe('generateTransitions', () => {
		let relation;

		beforeEach(() => {
			relation = new Relation({});

			relation.stylesObjs = [
				{
					general: {
						color: 'var(--maxi-light-p-color,rgba(var(--maxi-light-color-3,155,155,155),0.66))',
					},
				},
			];
			relation.effectsObjs = [
				{
					general: {
						'transition-status': true,
						'transition-duration': 0.3,
						'transition-delay': 0,
						easing: 'ease',
						split: false,
					},
				},
			];
			relation.effects = [{ disableTransition: false }];
			relation.hasMultipleTargetsArray = [false];
			relation.transitionTargetsArray = [
				[' .maxi-text-block__content'],
				[' .maxi-text-block__content li'],
				[' .maxi-text-block__content ol'],
			];
			relation.isIconArray = [false];
			relation.attributes = {
				'color-general': null,
				'palette-color-general': 3,
				'palette-status-general': true,
				'palette-sc-status-general': false,
				'palette-opacity-general': 0.66,
				'color-xl': null,
				'palette-color-xl': 3,
				'palette-status-xl': true,
				'palette-sc-status-xl': false,
				'palette-opacity-xl': 0.66,
			};
			relation.breakpointsObj = { general: '' };
			relation.dataTarget =
				'.edit-post-visual-editor[maxi-blocks-responsive] .maxi-block.maxi-block--backend.text-maxi-605db4c7-u[data-maxi-relations="true"][data-type="maxi-blocks/text-maxi"]';
			relation.isSiteEditor = false;
			relation.defaultTransition = 'none 0s ease 0s';
			relation.breakpoints = [
				'general',
				'xxl',
				'xl',
				'l',
				'm',
				's',
				'xs',
			];

			// Mock methods
			relation.getTargetForLine = jest.fn(
				target => `${relation.dataTarget}${target || ''}`
			);
			relation.getTransitionString = jest.fn(
				() => 'color 0.3s ease 0s, '
			);
		});

		test('should set inTransitionString and outTransitionString', () => {
			// Act
			relation.generateTransitions();

			// Assert
			expect(relation.inTransitionString).toBeDefined();
			expect(relation.outTransitionString).toBeDefined();
		});

		test('should generate valid transition CSS with correct selectors', () => {
			// Act
			relation.generateTransitions();

			// Assert
			const expectedSelector =
				'body.maxi-blocks--active .edit-post-visual-editor[maxi-blocks-responsive] .maxi-block.maxi-block--backend.text-maxi-605db4c7-u[data-maxi-relations="true"][data-type="maxi-blocks/text-maxi"] .maxi-text-block__content';
			expect(relation.inTransitionString).toContain(
				`${expectedSelector} {`
			);
			expect(relation.inTransitionString).toContain(
				'transition: color 0.3s ease 0s;'
			);
		});

		test('should not generate transitions when disableTransition is true', () => {
			// Arrange
			relation.effects[0].disableTransition = true;

			// Act
			relation.generateTransitions();

			// Assert
			expect(relation.inTransitionString).toBe('');
			expect(relation.outTransitionString).toBe('');
		});

		test('should handle split transitions correctly', () => {
			// Arrange
			relation.effectsObjs[0].general.split = true;
			relation.effectsObjs[0].general.out = {
				'transition-status': true,
				'transition-duration': 0.5,
				'transition-delay': 0.1,
				easing: 'ease-out',
			};
			relation.getTransitionString = jest
				.fn()
				.mockReturnValueOnce('color 0.3s ease 0s, ') // in transition
				.mockReturnValueOnce('color 0.5s ease-out 0.1s, '); // out transition

			// Act
			relation.generateTransitions();

			// Assert
			expect(relation.getTransitionString).toHaveBeenCalledTimes(2);
			expect(relation.inTransitionString).toContain(
				'transition: color 0.3s ease 0s;'
			);
			expect(relation.outTransitionString).toContain(
				'transition: color 0.5s ease-out 0.1s;'
			);
		});

		test('should handle different breakpoints', () => {
			// Arrange
			relation.breakpointsObj = { general: '', xl: '1024px' };
			relation.stylesObjs[0].xl = { color: '#ff0000' };
			relation.effectsObjs[0].xl = {
				'transition-status': true,
				'transition-duration': 0.2,
				'transition-delay': 0,
				easing: 'linear',
				split: false,
			};

			// Act
			relation.generateTransitions();

			// Assert
			expect(relation.inTransitionString).toContain(
				'[maxi-blocks-responsive="xl"]'
			);
		});

		test('should handle site editor mode', () => {
			// Arrange
			relation.isSiteEditor = true;

			// Act
			relation.generateTransitions();

			// Assert
			expect(relation.inTransitionString).toContain(
				'body.maxi-blocks--active.edit-post-visual-editor'
			);
		});
	});

	describe('getTransitionString', () => {
		let relation;

		beforeEach(() => {
			relation = new Relation({});
			relation.defaultTransition = 'none 0s ease 0s';
		});

		test('should generate transition string for standard elements', () => {
			const styleObj = { color: 'red', opacity: '1' };
			const effectsObj = {
				'transition-status': true,
				'transition-duration': 0.3,
				'transition-delay': 0.1,
				easing: 'ease-in-out',
			};

			const result = relation.getTransitionString(
				styleObj,
				effectsObj,
				false
			);
			expect(result).toBe(
				'color 0.3s ease-in-out 0.1s, opacity 0.3s ease-in-out 0.1s, '
			);
		});

		test('should generate transition string for icons', () => {
			const styleObj = { color: 'red', fill: 'blue' };
			const effectsObj = {
				'transition-status': true,
				'transition-duration': 0.5,
				'transition-delay': 0,
				easing: 'linear',
			};

			const result = relation.getTransitionString(
				styleObj,
				effectsObj,
				true
			);
			expect(result).toBe('all 0.5s linear 0s, ');
		});

		test('should generate disabled transition when status is false', () => {
			const styleObj = { color: 'red' };
			const effectsObj = {
				'transition-status': false,
				'transition-duration': 0.3,
				'transition-delay': 0.1,
				easing: 'ease',
			};

			const result = relation.getTransitionString(
				styleObj,
				effectsObj,
				false
			);
			expect(result).toBe('color 0s 0s, ');
		});

		test('should include default transition when not already included', () => {
			relation.defaultTransition = 'transform 0.2s ease 0s';
			const styleObj = { color: 'red' };
			const effectsObj = {
				'transition-status': true,
				'transition-duration': 0.3,
				'transition-delay': 0,
				easing: 'ease',
			};

			const result = relation.getTransitionString(
				styleObj,
				effectsObj,
				false
			);
			expect(result).toBe('transform 0.2s ease 0s, color 0.3s ease 0s, ');
		});

		test('should ignore computed none default transition', () => {
			relation.defaultTransition = 'none';
			const styleObj = { transform: 'scaleX(1)' };
			const effectsObj = {
				'transition-status': true,
				'transition-duration': 0.3,
				'transition-delay': 0,
				easing: 'ease',
			};

			const result = relation.getTransitionString(
				styleObj,
				effectsObj,
				false
			);
			expect(result).toBe('transform 0.3s ease 0s, ');
		});

		test('should not duplicate default transition when already included', () => {
			relation.defaultTransition = 'color 0.3s ease 0s';
			const styleObj = { color: 'red' };
			const effectsObj = {
				'transition-status': true,
				'transition-duration': 0.3,
				'transition-delay': 0,
				easing: 'ease',
			};

			const result = relation.getTransitionString(
				styleObj,
				effectsObj,
				false
			);
			expect(result).toBe('color 0.3s ease 0s, ');
		});
	});

	describe('addRelationSubscriber', () => {
		let relation;
		let mockObserver;
		let mockBlockTargetEl;
		let observerCallback;
		let OriginalObserver;

		beforeEach(() => {
			// Mock MutationObserver
			mockObserver = {
				observe: jest.fn(),
			};

			OriginalObserver = global.MutationObserver;
			global.MutationObserver = jest.fn(callback => {
				observerCallback = callback;
				return mockObserver;
			});

			// Create relation instance with mocked blockTargetEl
			mockBlockTargetEl = {
				dataset: {},
			};

			relation = new Relation({});
			relation.blockTargetEl = mockBlockTargetEl;
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		afterAll(() => {
			global.MutationObserver = OriginalObserver;
		});

		test('should create a MutationObserver', () => {
			relation.addRelationSubscriber();

			expect(global.MutationObserver).toHaveBeenCalled();
			expect(relation.observer).toBe(mockObserver);
		});

		test('should attach observer to blockTargetEl with correct options', () => {
			relation.addRelationSubscriber();

			expect(mockObserver.observe).toHaveBeenCalledWith(
				mockBlockTargetEl,
				{
					attributes: true,
					attributeFilter: ['data-maxi-relations'],
				}
			);
		});

		test('should not attach observer if blockTargetEl is undefined', () => {
			relation.blockTargetEl = undefined;
			relation.addRelationSubscriber();

			expect(mockObserver.observe).not.toHaveBeenCalled();
		});

		test('should force data-maxi-relations to "true" when changed', () => {
			relation.addRelationSubscriber();

			// Simulate mutation event
			const mockMutation = {
				type: 'attributes',
				attributeName: 'data-maxi-relations',
				target: {
					dataset: {
						maxiRelations: 'false',
					},
				},
			};

			// Call observer callback with mock mutations
			observerCallback([mockMutation]);

			// Check that dataset value was changed to 'true'
			expect(mockMutation.target.dataset.maxiRelations).toBe('true');
		});

		test('should only modify data-maxi-relations attribute', () => {
			relation.addRelationSubscriber();

			// Simulate mutation event for different attribute
			const mockMutation = {
				type: 'attributes',
				attributeName: 'data-other-attribute',
				target: {
					dataset: {
						maxiRelations: 'false',
					},
				},
			};

			// Call observer callback with mock mutations
			observerCallback([mockMutation]);

			// Check that dataset value was not changed
			expect(mockMutation.target.dataset.maxiRelations).toBe('false');
		});
	});
});
