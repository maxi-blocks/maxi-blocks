import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildAdvancedCssAGroupAction,
	buildAdvancedCssAGroupAttributeChanges,
	getAdvancedCssSidebarTarget,
} from '../ai/utils/advancedCssAGroup';

const textAttributes = rawAttributes.blocks['text-maxi'] || [];
const advancedCssAttributes = textAttributes.filter(attr =>
	attr.startsWith('advanced-css-')
);

const getBreakpoint = attribute => attribute.split('-').pop();

describe('advanced css A-group attributes', () => {
	test('advanced css prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Add custom CSS to the button: .maxi-button-block{color:red;}',
				property: 'advanced_css',
				value: '.maxi-button-block{color:red;}',
				targetBlock: 'button',
			},
			{
				phrase: 'On mobile, add custom CSS: .cta{color:red;}',
				property: 'advanced_css',
				value: { value: '.cta{color:red;}', breakpoint: 'xs' },
				targetBlock: 'text',
			},
		];

		samples.forEach(sample => {
			const action = buildAdvancedCssAGroupAction(sample.phrase, {
				scope: 'selection',
				targetBlock: sample.targetBlock,
			});
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			expect(action.value).toEqual(sample.value);
		});
	});

	test('page scope keeps target_block when provided', () => {
		const action = buildAdvancedCssAGroupAction(
			'Add custom CSS: .hero{color:red;}',
			{ scope: 'page', targetBlock: 'button' }
		);
		expect(action).toBeTruthy();
		expect(action.target_block).toBe('button');
	});

	test('each advanced-css attribute can be updated via mapping', () => {
		const missing = [];

		advancedCssAttributes.forEach(attribute => {
			const breakpoint = getBreakpoint(attribute);
			const cssValue = '.cta{color:red;}';
			const changes = buildAdvancedCssAGroupAttributeChanges('advanced_css', {
				value: cssValue,
				breakpoint,
			});

			if (!changes || !(attribute in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[attribute]).toBe(cssValue);
		});

		expect(missing).toEqual([]);
	});

	test('breakpoint prompts update attribute and sidebar targets', () => {
		const phrase = 'On mobile, add custom CSS: .cta{color:red;}';
		const action = buildAdvancedCssAGroupAction(phrase, {
			scope: 'selection',
			targetBlock: 'button',
		});

		expect(action).toBeTruthy();
		const changes = buildAdvancedCssAGroupAttributeChanges(
			action.property,
			action.value
		);
		expect(changes['advanced-css-xs']).toBe('.cta{color:red;}');

		const buttonSidebar = getAdvancedCssSidebarTarget(
			action.property,
			'maxi-blocks/button-maxi'
		);
		expect(buttonSidebar).toEqual({ tabIndex: 2, accordion: 'advanced css' });

		const containerSidebar = getAdvancedCssSidebarTarget(
			action.property,
			'maxi-blocks/container-maxi'
		);
		expect(containerSidebar).toEqual({
			tabIndex: 1,
			accordion: 'advanced css',
		});

		const textSidebar = getAdvancedCssSidebarTarget(
			action.property,
			'maxi-blocks/text-maxi'
		);
		expect(textSidebar).toEqual({ tabIndex: 1, accordion: 'advanced css' });
	});
});
