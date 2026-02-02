import {
	buildMetaAGroupAction,
	buildMetaAGroupAttributeChanges,
	getMetaSidebarTarget,
	resolveMetaTargetKey,
} from '../ai/utils/metaAGroup';

describe('meta A attributes', () => {
	test('anchor/aria phrases map to meta actions', () => {
		const anchorAction = buildMetaAGroupAction('Set the anchor ID to hero-section', {
			scope: 'selection',
			targetBlock: 'container',
		});
		expect(anchorAction).toBeTruthy();
		expect(anchorAction.property).toBe('anchor_link');
		expect(anchorAction.value).toBe('hero-section');

		const ariaAction = buildMetaAGroupAction(
			'Set accessibility label to "Primary hero container"',
			{ scope: 'selection', targetBlock: 'container' }
		);
		expect(ariaAction).toBeTruthy();
		expect(ariaAction.property).toBe('aria_label');
		expect(ariaAction.value).toBe('Primary hero container');
	});

	test('relations and hierarchy phrases map to meta actions', () => {
		const relationsAction = buildMetaAGroupAction(
			'Set relations to [{"source":"button","target":"form"}]',
			{ scope: 'selection', targetBlock: 'container' }
		);
		expect(relationsAction).toBeTruthy();
		expect(relationsAction.property).toBe('relations');
		expect(relationsAction.value).toEqual([
			{ source: 'button', target: 'form' },
		]);

		const clearRelationsAction = buildMetaAGroupAction('Clear relations', {
			scope: 'selection',
			targetBlock: 'container',
		});
		expect(clearRelationsAction).toBeTruthy();
		expect(clearRelationsAction.property).toBe('relations');
		expect(clearRelationsAction.value).toEqual([]);

		const hierarchyAction = buildMetaAGroupAction('Mark as top level', {
			scope: 'selection',
			targetBlock: 'container',
		});
		expect(hierarchyAction).toBeTruthy();
		expect(hierarchyAction.property).toBe('is_first_on_hierarchy');
		expect(hierarchyAction.value).toBe(true);

		const hierarchyOffAction = buildMetaAGroupAction('Disable top level', {
			scope: 'selection',
			targetBlock: 'container',
		});
		expect(hierarchyOffAction).toBeTruthy();
		expect(hierarchyOffAction.property).toBe('is_first_on_hierarchy');
		expect(hierarchyOffAction.value).toBe(false);
	});

	test('page scope retains target_block on meta action', () => {
		const action = buildMetaAGroupAction('Set anchor to hero', {
			scope: 'page',
			targetBlock: 'button',
		});
		expect(action).toBeTruthy();
		expect(action.target_block).toBe('button');
	});

	test('attribute changes store anchor and aria values', () => {
		const anchorChanges = buildMetaAGroupAttributeChanges('anchor_link', 'hero');
		expect(anchorChanges).toEqual({ anchorLink: 'hero' });

		const ariaChanges = buildMetaAGroupAttributeChanges('aria_label', 'CTA', {
			attributes: { ariaLabels: { icon: 'Decorative' } },
			targetKey: 'button',
		});
		expect(ariaChanges).toEqual({
			ariaLabels: { icon: 'Decorative', button: 'CTA' },
		});

		const relationsChanges = buildMetaAGroupAttributeChanges('relations', [
			{ source: 'button', target: 'form' },
		]);
		expect(relationsChanges).toEqual({
			relations: [{ source: 'button', target: 'form' }],
		});

		const hierarchyChanges = buildMetaAGroupAttributeChanges(
			'is_first_on_hierarchy',
			true
		);
		expect(hierarchyChanges).toEqual({ isFirstOnHierarchy: true });
	});

	test('sidebar target information matches expectations', () => {
		expect(getMetaSidebarTarget('anchor_link')).toEqual({
			tabIndex: 1,
			accordion: 'add anchor link',
		});
		expect(getMetaSidebarTarget('aria_label')).toEqual({
			tabIndex: 1,
			accordion: 'aria label',
		});
		expect(getMetaSidebarTarget('is_first_on_hierarchy')).toEqual({
			tabIndex: 0,
			accordion: 'block settings',
		});
		expect(getMetaSidebarTarget('relations')).toEqual({
			tabIndex: 1,
			accordion: 'interaction builder',
		});
	});

	test('block names resolve to sensible aria keys', () => {
		expect(resolveMetaTargetKey('maxi-blocks/button-maxi')).toBe('button');
		expect(resolveMetaTargetKey('maxi-blocks/text-maxi')).toBe('text');
		expect(resolveMetaTargetKey('maxi-blocks/container-maxi')).toBe('container');
		expect(resolveMetaTargetKey('something-else')).toBe('container');
	});
});
