import {
	buildContainerMetaAction,
	buildContainerMetaAttributeChanges,
	buildContainerMetaPatch,
	getContainerMetaSidebarTarget,
	validateContainerMetaAction,
} from '../ai/utils/containerMeta';
import { applyPatchToAttributes } from '../ai/editorBridge/applyPatch';

describe('container anchor/aria attributes', () => {
	test('anchor id phrases map to anchor_link action and patch', () => {
		const action = buildContainerMetaAction('Set the anchor ID to hero-section');

		expect(action).toBeTruthy();
		expect(action.property).toBe('anchor_link');
		expect(action.value).toBe('hero-section');
		expect(validateContainerMetaAction(action).ok).toBe(true);

		const changes = buildContainerMetaAttributeChanges(
			action.property,
			action.value,
			{}
		);
		expect(changes).toEqual({ anchorLink: 'hero-section' });

		const patch = buildContainerMetaPatch(action.property, action.value);
		const applied = applyPatchToAttributes({}, patch);
		expect(applied.anchorLink).toBe('hero-section');

		const sidebar = getContainerMetaSidebarTarget(action.property);
		expect(sidebar).toEqual({ tabIndex: 1, accordion: 'add anchor link' });
	});

	test('anchor hash phrases strip # and remain triggerable', () => {
		const action = buildContainerMetaAction('Use #features as the anchor');
		expect(action).toBeTruthy();
		expect(action.property).toBe('anchor_link');
		expect(action.value).toBe('features');
	});

	test('aria label phrases map to aria_label action and patch', () => {
		const action = buildContainerMetaAction(
			'Set accessibility label to \"Primary hero container\"'
		);

		expect(action).toBeTruthy();
		expect(action.property).toBe('aria_label');
		expect(action.value).toBe('Primary hero container');
		expect(validateContainerMetaAction(action).ok).toBe(true);

		const changes = buildContainerMetaAttributeChanges(action.property, action.value, {
			ariaLabels: { button: 'CTA' },
		});
		expect(changes).toEqual({
			ariaLabels: { button: 'CTA', container: 'Primary hero container' },
		});

		const patch = buildContainerMetaPatch(action.property, action.value);
		const applied = applyPatchToAttributes(
			{ ariaLabels: { button: 'CTA' } },
			patch
		);
		expect(applied.ariaLabels).toEqual({
			button: 'CTA',
			container: 'Primary hero container',
		});

		const sidebar = getContainerMetaSidebarTarget(action.property);
		expect(sidebar).toEqual({ tabIndex: 1, accordion: 'aria label' });
	});
});
