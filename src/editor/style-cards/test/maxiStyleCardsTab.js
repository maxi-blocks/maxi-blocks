import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import MaxiStyleCardsTab, {
	DarkToneOverrides,
	MaxiStyleCardsAdvancedTab,
} from '../maxiStyleCardsTab';
import * as utils from '../utils';
import { debugSCBlockDefaults } from '@extensions/style-cards/blockDefaults';

const mockAccordionControl = jest.fn(() => null);
const mockFullSizeControl = jest.fn(() => null);
const mockFlexGapControl = jest.fn(() => null);
const mockFlexWrapControl = jest.fn(() => null);
const mockMarginControl = jest.fn(() => null);
const mockPaddingControl = jest.fn(() => null);
const mockSettingTabsControl = jest.fn(() => null);
const mockToggleSwitch = jest.fn(({ label, help }) => (
	<div className='mock-toggle-switch'>
		<span>{label}</span>
		{help && <p>{help}</p>}
	</div>
));

global.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock('@wordpress/i18n', () => ({
	__: text => text,
	sprintf: (template, value) => template.replace('%s', value),
}));

jest.mock(
	'@components/accordion-control',
	() => props => {
		mockAccordionControl(props);

		return (
			props.items?.map(item => item.content) || null
		);
	}
);
jest.mock(
	'@components/flex-settings-control/flex-gap-control',
	() => props => mockFlexGapControl(props)
);
jest.mock(
	'@components/flex-settings-control/flex-wrap-control',
	() => props => mockFlexWrapControl(props)
);
jest.mock('@components/full-size-control', () => props =>
	mockFullSizeControl(props)
);
jest.mock('@components/advanced-number-control', () => () => null);
jest.mock('@components/button', () => ({ children, onClick }) => (
	<button type='button' onClick={onClick}>
		{children}
	</button>
));
jest.mock('@components/color-control', () => () => null);
jest.mock('@components/color-control/utils', () => ({
	getStandardPaletteColorLabel: (item, fallback) => fallback,
}));
jest.mock('@components/icon', () => () => null);
jest.mock('@components/margin-control', () => props => mockMarginControl(props));
jest.mock('@components/padding-control', () => props =>
	mockPaddingControl(props)
);
jest.mock('@components/responsive-tabs-control', () => ({ children }) => (
	<div>{children}</div>
));
jest.mock('@components/select-control', () => () => null);
jest.mock(
	'@components/setting-tabs-control',
	() => props => mockSettingTabsControl(props)
);
jest.mock('@components/toggle-switch', () => props => mockToggleSwitch(props));
jest.mock('@components/typography-control', () => () => null);

jest.mock('@extensions/style-cards', () => ({
	getDefaultSCValue: jest.fn(() => undefined),
	getTypographyFromSC: jest.fn(() => ({})),
}));
jest.mock('@extensions/style-cards/blockDefaults', () => ({
	blockDefaultBlocks: [
		'accordion-maxi',
		'button-maxi',
		'column-maxi',
		'container-maxi',
		'divider-maxi',
		'group-maxi',
		'image-maxi',
		'list-item-maxi',
		'map-maxi',
		'number-counter-maxi',
		'pane-maxi',
		'row-maxi',
		'search-maxi',
		'slide-maxi',
		'slider-maxi',
		'svg-icon-maxi',
		'text-maxi',
		'video-maxi',
	],
	BLOCK_DEFAULTS_GROUP: 'blockDefaults',
	SC_BLOCK_DEFAULTS_EXCLUDED_ATTRIBUTES:
		'scBlockDefaultsExcludedAttributes',
	debugSCBlockDefaults: jest.fn(),
	getBlockDefaultKey: (block, attr) => `${block}-${attr}`,
	getShippedBlockDefault: jest.fn((block, attr, fallback) => fallback),
	getUnitAttribute: attr => {
		const match = attr.match(/^(.*)-(general|xxl|xl|l|m|s|xs)$/);
		return match && !attr.includes('-unit-')
			? `${match[1]}-unit-${match[2]}`
			: null;
	},
}));
jest.mock('@extensions/style-cards/customColorsUtils', () => jest.fn());
jest.mock('@maxi-icons', () => ({
	reset: 'reset',
}));
jest.mock('../getDefaultSCAttribute', () => jest.fn(() => '255,255,255'));
jest.mock('../utils', () => ({
	processSCAttribute: jest.fn(() => undefined),
	processSCAttributes: jest.fn(() => ({})),
	removeNavigationHoverUnderline: jest.fn(),
	showHideHamburgerNavigation: jest.fn(),
}));

const createStyleCardTone = () => ({
	styleCard: {
		color: {},
	},
	defaultStyleCard: {
		color: {},
	},
});

const createStyleCard = () => ({
	light: createStyleCardTone(),
	dark: createStyleCardTone(),
});

const createStyleCardWithBlockDefaults = ({
	lightBlockDefaults = {},
	darkBlockDefaults = {},
} = {}) => ({
	light: {
		...createStyleCardTone(),
		styleCard: {
			...createStyleCardTone().styleCard,
			blockDefaults: {
				...lightBlockDefaults,
			},
		},
	},
	dark: {
		...createStyleCardTone(),
		styleCard: {
			...createStyleCardTone().styleCard,
			blockDefaults: {
				...darkBlockDefaults,
			},
		},
	},
});

const getLayoutControlGroups = () =>
	mockAccordionControl.mock.calls
		.map(([props]) => props?.items?.map(item => item.label))
		.filter(Boolean)
		.filter(items => items.includes('Height / Width'));

describe('MaxiStyleCardsTab', () => {
	let container;
	let root;

	beforeEach(() => {
		utils.processSCAttribute.mockReturnValue(undefined);
		utils.processSCAttributes.mockReturnValue({});

		window.wp = {
			data: {
				select: jest.fn(() => ({
					receiveMaxiSelectedStyleCardValue: jest.fn(() => []),
				})),
			},
		};

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => {
			root.unmount();
		});
		document.body.removeChild(container);
		jest.clearAllMocks();
	});

	it('keeps the tone globals list as the existing Style Card sections', () => {
		const styleCard = createStyleCard();

		act(() => {
			root.render(
				<MaxiStyleCardsTab
					styleCard={styleCard}
					breakpoint='general'
					onChangeValue={jest.fn()}
					onChangeDarkToneOverride={jest.fn()}
					isStyleSettingsSyncSelected
					onChangeStyleSettingsSyncStatus={jest.fn()}
				/>
			);
		});

		const toneAccordion = mockAccordionControl.mock.calls
			.map(([props]) => props)
			.find(props =>
				props.items?.some(item => item.label === 'Colour palette')
			);

		expect(toneAccordion.items.map(item => item.label)).toEqual([
			'Colour palette',
			'Custom colours (both tones)',
			'Button globals',
			'Paragraph globals',
			'Link globals',
			'Headings globals',
			'Icon globals',
			'Divider globals',
			'Navigation menu globals',
		]);
		expect(toneAccordion.items.map(item => item.label)).not.toContain(
			'Block defaults'
		);

		expect(
			toneAccordion.items[0].content.props.items.map(item => item.label)
		).toEqual(['Light colours', 'Dark colours']);
		const syncToggleProps = mockToggleSwitch.mock.calls.find(
			([props]) =>
				props.className ===
				'maxi-style-cards__sync-style-settings'
		)?.[0];
		const syncHelpText =
			'Fonts, sizes, spacing and other non-colour settings will be shared between both tones. Colours can still be edited separately.';

		expect(syncToggleProps).toEqual(
			expect.objectContaining({
				className: 'maxi-style-cards__sync-style-settings',
				label: 'Sync style settings between light and dark tones',
				selected: true,
			})
		);
		expect(syncToggleProps.help).toBeUndefined();
		expect(container.textContent).not.toContain(syncHelpText);

		const syncInfoButton = container.querySelector(
			'.maxi-style-cards__sync-style-settings-info-button'
		);

		expect(syncInfoButton).toBeTruthy();
		expect(syncInfoButton.getAttribute('aria-expanded')).toBe('false');

		act(() => {
			syncInfoButton.dispatchEvent(
				new MouseEvent('click', { bubbles: true })
			);
		});

		expect(syncInfoButton.getAttribute('aria-expanded')).toBe('true');
		expect(container.textContent).toContain(syncHelpText);
	});

	it('renders only container and row in advanced globals', () => {
		const onChangeDarkToneOverride = jest.fn();
		act(() => {
			root.render(
				<MaxiStyleCardsAdvancedTab
					styleCard={createStyleCard()}
					breakpoint='general'
					onChangeValue={jest.fn()}
					onChangeDarkToneOverride={onChangeDarkToneOverride}
				/>
			);
		});

		const advancedAccordion = mockAccordionControl.mock.calls
			.map(([props]) => props)
			.find(props => props.items?.some(item => item.label === 'Row layout'));

		expect(advancedAccordion.items.map(item => item.label)).toEqual([
			'Container layout',
			'Row layout',
		]);
		expect(advancedAccordion.className).toBe(
			'maxi-style-cards-advanced-globals__blocks'
		);
		expect(
			advancedAccordion.items.map(item => item.label)
		).not.toContain('Button');
		expect(
			advancedAccordion.items.map(item => item.label)
		).not.toContain('Navigation menu globals');
		expect(
			advancedAccordion.items.map(item => item.label)
		).not.toContain('Block defaults');

		expect(
			advancedAccordion.items[0].content.props.blockName
		).toBe('container-maxi');
		expect(mockToggleSwitch).not.toHaveBeenCalledWith(
			expect.objectContaining({
				className: 'maxi-style-cards__dark-tone-overrides-toggle',
			})
		);
	});

	it('uses sectioned height/width and spacing controls in advanced layouts', () => {
		act(() => {
			root.render(
				<MaxiStyleCardsAdvancedTab
					styleCard={createStyleCard()}
					breakpoint='general'
					onChangeValue={jest.fn()}
					onChangeDarkToneOverride={jest.fn()}
				/>
			);
		});

		const layoutControlGroups = getLayoutControlGroups();
		const sectionAccordions = mockAccordionControl.mock.calls
			.map(([props]) => props)
			.filter(
				props =>
					props.className ===
					'maxi-style-cards-advanced-globals__sections'
			);

		expect(layoutControlGroups).toContainEqual([
			'Height / Width',
			'Margin / Padding',
		]);
		expect(sectionAccordions.length).toBeGreaterThan(0);
		expect(layoutControlGroups).toContainEqual([
			'Height / Width',
			'Margin / Padding',
			'Row spacing',
		]);
		expect(mockFullSizeControl).toHaveBeenCalled();
		expect(mockMarginControl).toHaveBeenCalled();
		expect(mockPaddingControl).toHaveBeenCalled();
		expect(mockFlexGapControl).toHaveBeenCalled();
		expect(mockFlexWrapControl).toHaveBeenCalled();
	});

	it('uses the compact dark override wording and hides controls while off', () => {
		const onChange = jest.fn();

		act(() => {
			root.render(
				<DarkToneOverrides enabled={false} onChange={onChange}>
					<div>Dark controls</div>
				</DarkToneOverrides>
			);
		});

		expect(mockToggleSwitch).toHaveBeenCalledWith(
			expect.objectContaining({
				className: 'maxi-style-cards__dark-tone-overrides-toggle',
				label: 'Dark tone overrides',
				help: 'Use different settings for this section in dark mode.',
				selected: false,
				onChange,
			})
		);
		expect(container.textContent).not.toContain('Dark controls');

		act(() => {
			root.render(
				<DarkToneOverrides enabled onChange={onChange}>
					<div>Dark controls</div>
				</DarkToneOverrides>
			);
		});

		expect(container.textContent).toContain('Dark controls');
	});

	it('prefixes advanced block-default updates and strips control metadata', () => {
		const onChangeValue = jest.fn();
		const styleCard = createStyleCardWithBlockDefaults({
			lightBlockDefaults: {
				'container-maxi|width-general': '160',
				'container-maxi|height-general': '200',
				'container-maxi|padding-top-general': '20',
				'container-maxi|padding-bottom-general': '20',
			},
		});

		utils.processSCAttributes.mockImplementation((sourceStyleCard, _target, type) =>
			type === 'blockDefaults'
				? sourceStyleCard?.styleCard?.blockDefaults ?? {}
				: {}
		);

		act(() => {
			root.render(
				<MaxiStyleCardsAdvancedTab
					styleCard={styleCard}
					breakpoint='general'
					onChangeValue={onChangeValue}
					onChangeDarkToneOverride={jest.fn()}
				/>
			);
		});

		const fullSizeProps = mockFullSizeControl.mock.calls.find(
			([props]) => props?.['width-general'] !== undefined
		)?.[0];
		expect(fullSizeProps).toBeTruthy();

		act(() => {
			fullSizeProps.onChange({
				'width-general': '190',
				meta: {
					inline: {
						unit: 'px',
					},
				},
				isReset: true,
				scBlockDefaultsExcludedAttributes: ['full-width-general'],
			});
		});

		expect(onChangeValue).toHaveBeenCalledWith(
			{
				'container-maxi-width-general': '190',
				'container-maxi-width-unit-general': 'px',
			},
			'blockDefaults',
			expect.objectContaining({
				SCStyle: 'light',
				group: 'container-maxi',
				forceSyncedTones: true,
			})
		);
		expect(
			onChangeValue.mock.calls.at(-1)[0]
		).not.toHaveProperty('container-maxi-meta');
		expect(
			onChangeValue.mock.calls.at(-1)[0]
		).not.toHaveProperty('container-maxi-isReset');
		expect(
			onChangeValue.mock.calls.at(-1)[0]
		).not.toHaveProperty(
			'container-maxi-scBlockDefaultsExcludedAttributes'
		);
		expect(debugSCBlockDefaults).toHaveBeenCalledWith(
			'advanced globals change',
			expect.objectContaining({
				blockName: 'container-maxi',
				breakpoint: 'general',
				tone: 'light',
				values: expect.objectContaining({
					'width-general': '190',
				}),
				prefixedValues: {
					'container-maxi-width-general': '190',
					'container-maxi-width-unit-general': 'px',
				},
			})
		);

		const paddingProps = mockPaddingControl.mock.calls.find(
			([props]) => props?.['padding-top-general'] !== undefined
		)?.[0];
		expect(paddingProps).toBeTruthy();

		act(() => {
			paddingProps.onChange({
				'padding-top-general': '100',
				'padding-bottom-general': '100',
				meta: {
					inline: {
						unit: 'px',
					},
				},
			});
		});

		expect(onChangeValue).toHaveBeenLastCalledWith(
			{
				'container-maxi-padding-top-general': '100',
				'container-maxi-padding-top-unit-general': 'px',
				'container-maxi-padding-bottom-general': '100',
				'container-maxi-padding-bottom-unit-general': 'px',
			},
			'blockDefaults',
			expect.objectContaining({
				SCStyle: 'light',
				group: 'container-maxi',
				forceSyncedTones: true,
			})
		);
	});
});
