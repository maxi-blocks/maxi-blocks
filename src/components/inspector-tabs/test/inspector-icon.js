import icon from '../inspector-icon';

jest.mock('@wordpress/i18n', () => ({
	__: text => text,
}));

jest.mock('@components/icon-control', () => 'IconControl');
jest.mock('@components/manage-hover-transitions', () => 'ManageHoverTransitions');
jest.mock('@components/setting-tabs-control', () => 'SettingTabsControl');
jest.mock('@components/toggle-switch', () => 'ToggleSwitch');

jest.mock('@extensions/styles', () => ({
	getIconWithColor: jest.fn(() => '<svg />'),
	getGroupAttributes: (attributes, groups, isHover = false, prefix = '') => {
		const groupKeys = {
			icon: [`${prefix}icon-content`, `${prefix}svgType`],
			iconBackground: [
				`${prefix}icon-background-active-media-general${
					isHover ? '-hover' : ''
				}`,
			],
			iconBackgroundColor: [
				`${prefix}icon-background-palette-color-general${
					isHover ? '-hover' : ''
				}`,
			],
			iconBackgroundGradient: [
				`${prefix}icon-background-gradient-general${
					isHover ? '-hover' : ''
				}`,
			],
			iconBorder: [],
			iconBorderWidth: [],
			iconBorderRadius: [],
			iconPadding: [],
		};

		return (Array.isArray(groups) ? groups : [groups]).reduce(
			(acc, group) => {
				groupKeys[group]?.forEach(key => {
					if (attributes[key] !== undefined) acc[key] = attributes[key];
				});

				return acc;
			},
			{}
		);
	},
}));

describe('inspector icon tab', () => {
	it('passes icon background active media to IconControl', () => {
		const result = icon({
			props: {
				attributes: {
					'icon-content': '<svg />',
					'icon-background-active-media-general': 'color',
				},
				cleanInlineStyles: jest.fn(),
				clientId: 'client-id',
				deviceType: 'general',
				insertInlineStyles: jest.fn(),
				maxiSetAttributes: jest.fn(),
			},
		});

		const normalTab = result.content.props.items[0];

		expect(
			normalTab.content.props['icon-background-active-media-general']
		).toBe('color');
	});
});
