import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

import MaxiStyleCardsTab, {
	BlockDefaults,
	DarkToneOverrides,
	MaxiStyleCardsAdvancedTab,
} from '../maxiStyleCardsTab';

const mockAccordionControl = jest.fn(() => null);
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
	() => props => mockAccordionControl(props)
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
jest.mock('@components/padding-control', () => () => null);
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
	blockDefaultBlocks: ['row-maxi', 'container-maxi'],
	BLOCK_DEFAULTS_GROUP: 'blockDefaults',
	debugSCBlockDefaults: jest.fn(),
	getBlockDefaultKey: (block, attr) => `${block}-${attr}`,
	getShippedBlockDefault: jest.fn((block, attr, fallback) => fallback),
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

describe('MaxiStyleCardsTab', () => {
	let container;
	let root;

	beforeEach(() => {
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
		expect(mockToggleSwitch).toHaveBeenCalledWith(
			expect.objectContaining({
				className: 'maxi-style-cards__sync-style-settings',
				label: 'Sync style settings between light and dark tones',
				help: 'Fonts, sizes, spacing and other non-colour settings will be shared between both tones. Colours can still be edited separately.',
				selected: true,
			})
		);
	});

	it('moves only Block defaults into the Advanced globals content', () => {
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

		const advancedAccordion = mockAccordionControl.mock.calls
			.map(([props]) => props)
			.find(props =>
				props.items?.some(item => item.label === 'Block defaults')
			);

		expect(advancedAccordion.items.map(item => item.label)).toEqual([
			'Block defaults',
		]);
		expect(
			Array.isArray(advancedAccordion.items[0].content.props.children)
		).toBe(false);
	});

	it('renders each block default group as its own tab', () => {
		act(() => {
			root.render(
				<BlockDefaults
					SC={createStyleCardTone()}
					breakpoint='general'
					onChangeValue={jest.fn()}
				/>
			);
		});

		const blockTabs = mockSettingTabsControl.mock.calls
			.map(([props]) => props)
			.find(
				props =>
					props.className === 'maxi-style-cards-advanced-globals-tabs'
			);

		expect(blockTabs.items.map(item => item.label)).toEqual([
			'Row',
			'Container',
		]);
		expect(blockTabs.disablePadding).toBe(true);
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
});
