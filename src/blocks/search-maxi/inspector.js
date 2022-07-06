/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AxisPositionControl,
	SelectControl,
	SettingTabsControl,
	TextControl,
} from '../../components';
import { selectorsSearch, categoriesSearch } from './custom-css';
import { withMaxiInspector } from '../../extensions/inspector';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const {
		'icon-position': buttonPosition,
		skin,
		searchButtonSkin,
	} = attributes;

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			{inspectorTabs.blockSettings({
				props,
			})}
			<SettingTabsControl
				target='sidebar-settings-tabs'
				disablePadding
				deviceType={deviceType}
				depth={0}
				items={[
					{
						label: __('Block', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									...inspectorTabs.border({
										props,
									}),
									...inspectorTabs.boxShadow({
										props,
									}),
									...inspectorTabs.size({
										props,
										block: true,
									}),
									...inspectorTabs.marginPadding({
										props,
									}),
								]}
							/>
						),
					},
					{
						label: __('Button', 'maxi-blocks'),
						content: (
							<AccordionControl
								items={[
									{
										label: __('Skin', 'maxi-blocks'),
										content: (
											<>
												<SelectControl
													label={__(
														'Skin',
														'maxi-blocks'
													)}
													value={skin}
													options={[
														{
															label: __(
																'Boxed',
																'maxi-blocks'
															),
															value: 'boxed',
														},
														{
															label: __(
																'Classic',
																'maxi-blocks'
															),
															value: 'classic',
														},
														{
															label: __(
																'Icon reveal',
																'maxi-blocks'
															),
															value: 'icon-reveal',
														},
													]}
													onChange={skin => {
														if (
															skin === 'classic'
														) {
															maxiSetAttributes({
																'search-input-background-palette-color-general': 2,
															});
														} else if (
															skin === 'boxed'
														) {
															maxiSetAttributes({
																'search-input-background-palette-color-general': 1,
															});
														} else if (
															skin ===
															'icon-reveal'
														) {
															maxiSetAttributes({
																'search-button-border-unit-radius-general':
																	'%',
																'search-button-border-top-left-radius-general': 50,
																'search-button-border-top-right-radius-general': 50,
																'search-button-border-bottom-left-radius-general': 50,
																'search-button-border-bottom-right-radius-general': 50,
																'search-button-margin-left-general':
																	'-20',
															});
														}

														maxiSetAttributes({
															skin,
														});
													}}
												/>
												<TextControl
													label={__(
														'Placeholder text',
														'maxi-blocks'
													)}
													value={
														attributes.placeholder
													}
													onChange={placeholder =>
														maxiSetAttributes({
															placeholder,
														})
													}
												/>
											</>
										),
									},
									{
										label: __('Button', 'maxi-blocks'),
										content: (
											<SelectControl
												className='maxi-search-button-control__skin'
												label={__(
													'Skin',
													'maxi-blocks'
												)}
												value={searchButtonSkin}
												options={[
													{
														label: __(
															'Icon',
															'maxi-blocks'
														),
														value: 'icon',
													},
													{
														label: __(
															'Text',
															'maxi-blocks'
														),
														value: 'text',
													},
												]}
												onChange={searchButtonSkin =>
													maxiSetAttributes({
														searchButtonSkin,
													})
												}
											/>
										),
									},
									...(searchButtonSkin === 'icon'
										? inspectorTabs.icon({
												props,
												type: 'search-icon',
												disableBackground: true,
												disableIconInherit: true,
												disableIconOnly: true,
												disablePadding: true,
												disablePosition: true,
												disableSpacing: true,
										  })
										: inspectorTabs.typography({
												props,
												disableCustomFormats: true,
												hideAlignment: true,
												prefix: 'search-button-',
												inlineTarget:
													' .maxi-search-block__button__content',
										  })),
									...(searchButtonSkin === 'icon' &&
										skin === 'icon-reveal' &&
										inspectorTabs.icon({
											props,
											label: __(
												'Close icon',
												'maxi-blocks'
											),
											type: 'search-icon',
											disableBackground: true,
											disableIconInherit: true,
											disableIconOnly: true,
											disablePadding: true,
											disablePosition: true,
											disableSpacing: true,
											prefix: 'close-',
										})),
									{
										label: __('Position', 'maxi-blocks'),
										content: (
											<AxisPositionControl
												label='Button'
												selected={buttonPosition}
												onChange={val =>
													maxiSetAttributes({
														'icon-position': val,
													})
												}
												breakpoint={deviceType}
												disableY
											/>
										),
									},
									...inspectorTabs.border({
										props,
										prefix: 'search-button-',
										selector: '.maxi-search-block__button',
									}),
									...inspectorTabs.background({
										label: 'Button',
										props,
										prefix: 'search-button-',
										disableImage: true,
										disableVideo: true,
										disableGradient: true,
										disableSVG: true,
										disableNoneStyle: true,
										selector: '.maxi-search-block__button',
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: 'search-button-',
									}),
								]}
							/>
						),
					},
					{
						label: __('Input', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									...inspectorTabs.typography({
										props,
										disableCustomFormats: true,
										hideAlignment: true,
										prefix: 'search-input-',
										inlineTarget:
											' .maxi-search-block__input',
									}),
									...inspectorTabs.border({
										props,
										prefix: 'search-input-',
									}),
									...inspectorTabs.background({
										label: 'Input',
										props,
										prefix: 'search-input-',
										disableImage: true,
										disableVideo: true,
										disableGradient: true,
										disableSVG: true,
										disableNoneStyle: true,
										selector: '.maxi-search-block__input',
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: 'search-input-',
										customLabel: __(
											'Padding',
											'maxi-blocks'
										),
										disableMargin: true,
									}),
								]}
							/>
						),
					},
					{
						label: __('Advanced', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									deviceType === 'general' && {
										...inspectorTabs.customClasses({
											props,
										}),
									},
									deviceType === 'general' && {
										...inspectorTabs.anchor({
											props,
										}),
									},
									...inspectorTabs.customCss({
										props,
										breakpoint: deviceType,
										selectors: selectorsSearch,
										categories: categoriesSearch,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
									}),
									...inspectorTabs.display({
										props,
									}),
									...inspectorTabs.opacity({
										props,
									}),
									...inspectorTabs.position({
										props,
									}),
									deviceType !== 'general' && {
										...inspectorTabs.responsive({
											props,
										}),
									},
									...inspectorTabs.overflow({
										props,
									}),
									...inspectorTabs.flex({
										props,
									}),
									...inspectorTabs.zindex({
										props,
									}),
									...inspectorTabs.relation({
										props,
									}),
								]}
							/>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default withMaxiInspector(Inspector);
