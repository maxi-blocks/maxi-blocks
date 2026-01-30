import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import {
	buildContainerLGroupAction,
	buildContainerLGroupAttributeChanges,
	getContainerLGroupSidebarTarget,
} from '../ai/utils/containerLGroup';

const containerAttributes = rawAttributes.blocks['container-maxi'] || [];
const lAttributes = containerAttributes.filter(attr => /^l/i.test(attr));

const buildExpectedForAttribute = attribute => {
	if (attribute === 'linkSettings') {
		return {
			property: 'link_settings',
			value: { url: 'https://example.com', target: '_self', rel: '' },
			expectedKey: 'linkSettings',
			expectedValue: {
				url: 'https://example.com',
				opensInNewTab: false,
				noFollow: false,
				sponsored: false,
				ugc: false,
			},
			expectedSidebar: { tabIndex: 1, accordion: 'link' },
		};
	}

	return null;
};

describe('container L attributes', () => {
	test('L-group prompt phrases resolve to expected properties', () => {
		const samples = [
			{
				phrase: 'Link this section to https://example.com',
				property: 'link_settings',
				assert: action =>
					action.value &&
					action.value.url === 'https://example.com' &&
					action.value.opensInNewTab === false,
			},
			{
				phrase: 'Open in new tab and make it nofollow https://example.com',
				property: 'link_settings',
				assert: action =>
					action.value &&
					action.value.opensInNewTab === true &&
					action.value.noFollow === true,
			},
			{
				phrase: 'Link to current post',
				property: 'dc_link',
				assert: action => action.value && action.value.target === 'entity',
			},
		];

		samples.forEach(sample => {
			const action = buildContainerLGroupAction(sample.phrase);
			expect(action).toBeTruthy();
			expect(action.property).toBe(sample.property);
			if (sample.assert) {
				expect(sample.assert(action)).toBe(true);
			}
		});
	});

	test('each L attribute can be updated via L-group mapping', () => {
		const missing = [];

		lAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config) {
				missing.push(attribute);
				return;
			}

			const changes = buildContainerLGroupAttributeChanges(
				config.property,
				config.value,
				{ attributes: {} }
			);

			if (!changes) {
				missing.push(attribute);
				return;
			}

			if (!(config.expectedKey in changes)) {
				missing.push(attribute);
				return;
			}

			expect(changes[config.expectedKey]).toMatchObject(config.expectedValue);
		});

		expect(missing).toEqual([]);
	});

	test('L-group properties map to sidebar targets', () => {
		const missing = [];
		lAttributes.forEach(attribute => {
			const config = buildExpectedForAttribute(attribute);
			if (!config || !config.expectedSidebar) {
				missing.push(attribute);
				return;
			}

			const sidebar = getContainerLGroupSidebarTarget(config.property);
			if (!sidebar) {
				missing.push(attribute);
				return;
			}

			expect(sidebar).toEqual(config.expectedSidebar);
		});

		expect(missing).toEqual([]);
	});
});
