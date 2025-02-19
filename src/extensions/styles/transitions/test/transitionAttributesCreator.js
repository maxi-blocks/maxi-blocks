import transitionAttributesCreator from '@extensions/styles/transitions/transitionAttributesCreator';
import createTransitionObj from '@extensions/styles/transitions/createTransitionObj';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';
import getTransformTransitionData from '@extensions/styles/transitions/getTransformTransitionData';
import { cloneDeep } from 'lodash';

jest.mock('@extensions/styles/transitions/createTransitionObj', () =>
	jest.fn()
);
jest.mock('@extensions/styles/transitions/getTransformTransitionData', () =>
	jest.fn()
);

describe('transitionAttributesCreator', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		createTransitionObj.mockReturnValue({
			duration: 0.3,
			delay: 0,
			easing: 'ease',
		});
	});

	it('Creates default transition attributes without selectors', () => {
		const result = transitionAttributesCreator();
		const defaultTransition = cloneDeep(transitionDefault);

		// Check transition object structure
		expect(result).toHaveProperty('transition');
		expect(result.transition.type).toBe('object');

		// Verify transition-selected attributes
		Object.keys(defaultTransition).forEach(type => {
			expect(result).toHaveProperty(`transition-${type}-selected`);
			expect(result[`transition-${type}-selected`]).toEqual({
				type: 'string',
				default: 'none',
			});
		});
	});

	it('Creates transition attributes with custom transition', () => {
		const customTransition = {
			background: {
				color: { title: 'Color' },
				opacity: { title: 'Opacity' },
			},
		};

		const result = transitionAttributesCreator({
			transition: customTransition,
		});

		// Check background transitions
		expect(result.transition.default.background).toHaveProperty('color');
		expect(result.transition.default.background).toHaveProperty('opacity');

		// Verify transition objects have correct structure
		expect(result.transition.default.background.color).toEqual(
			createTransitionObj()
		);
		expect(result.transition.default.background.opacity).toEqual(
			createTransitionObj()
		);
	});

	it('Handles transform transitions with selectors', () => {
		const selectors = ['.test-selector'];
		getTransformTransitionData.mockReturnValue({
			scale: { title: 'Scale' },
			rotate: { title: 'Rotate' },
		});

		const result = transitionAttributesCreator({ selectors });

		// Verify transform transitions were created
		expect(result.transition.default.transform).toBeDefined();
		expect(getTransformTransitionData).toHaveBeenCalledWith(selectors);
	});

	it('Creates transition style objects for each type', () => {
		const customTransition = {
			size: {
				width: { title: 'Width' },
				height: { title: 'Height' },
			},
		};

		const result = transitionAttributesCreator({
			transition: customTransition,
		});

		// Check size transitions
		expect(result.transition.default.size).toHaveProperty('width');
		expect(result.transition.default.size).toHaveProperty('height');

		// Verify transition objects
		expect(result.transition.default.size.width).toEqual(
			createTransitionObj()
		);
		expect(result.transition.default.size.height).toEqual(
			createTransitionObj()
		);
	});
});
