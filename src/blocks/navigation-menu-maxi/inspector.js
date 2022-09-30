/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	SettingTabsControl,
	SelectControl,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { getGroupAttributes } from '../../extensions/styles';
import MenuItemControl from './components/menu-item-control';
import MenuItemEffectControl from './components/menu-item-effect-control';
import {
	convertClassicMenuToBlocks,
	convertGutenbergMenuToMaxi,
} from '../../extensions/navigation-menu';
import { customCss } from './data';

/**
 * Inspector
 */
const Inspector = props => {
	const { deviceType, maxiSetAttributes, attributes, clientId } = props;
	const { selectedMenuId, blockStyle } = attributes;

	const { navigationMenus, classicMenus } = useSelect(select => {
		const { getEntityRecords, getMenuItems } = select('core');

		const args = [
			'postType',
			'wp_navigation',
			{ per_page: -1, status: 'publish' },
		];
		getMenuItems({ per_page: -1, context: 'view' });
		return {
			navigationMenus: getEntityRecords(...args),
			classicMenus: getEntityRecords('root', 'menu', {
				per_page: -1,
				context: 'view',
			}),
		};
	});

	const getMenuSourceItems = (navigationMenus, classicMenus) => {
		return [
			...(navigationMenus?.map(({ title, id }) => {
				return {
					label: __(title.rendered, 'maxi-blocks'),
					value: id,
				};
			}) || []),
			...(classicMenus?.map(({ name, id }) => {
				return {
					label: __(name, 'maxi-blocks'),
					value: id,
				};
			}) || []),
		];
	};

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
						label: __('Settings', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									{
										label: 'Menu source',
										content: (
											<SelectControl
												label={__(
													'Choose menu',
													'maxi-blocks'
												)}
												className='menu-source-selector'
												value={selectedMenuId}
												options={[
													...getMenuSourceItems(
														navigationMenus,
														classicMenus
													),
													{
														label: __(
															'Create new',
															'maxi-blocks'
														),
														value: -1,
													},
												]}
												onChange={async val => {
													if (
														classicMenus.find(
															menu =>
																menu.id === +val
														)
													) {
														const newMenuId =
															convertClassicMenuToBlocks(
																val
															);
														maxiSetAttributes({
															selectedMenuId:
																newMenuId,
														});
														return;
													}
													const newId =
														await convertGutenbergMenuToMaxi(
															val
														);

													maxiSetAttributes({
														selectedMenuId: `${newId}`,
													});
												}}
											/>
										),
									},
									{
										label: 'Menu item',
										content: (
											<MenuItemControl
												typography={{
													...getGroupAttributes(
														attributes,
														'menuItem'
													),
												}}
												{...getGroupAttributes(
													attributes,
													'menuItem'
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												clientId={clientId}
												breakpoint={deviceType}
												hideAlignment
												disableCustomFormats
												blockStyle={blockStyle}
												textLevel='p'
												inlineTarget=' .maxi-navigation-link-block .maxi-navigation-link-block__content'
												globalProps={{
													target: '',
													type: 'p',
												}}
												hoverGlobalProps={{
													target: 'hover',
													type: 'p',
												}}
											/>
										),
									},
									{
										label: 'Menu item effect',
										content: (
											<MenuItemEffectControl
												{...getGroupAttributes(
													attributes,
													'menuItemEffect'
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												clientId={clientId}
												breakpoint={deviceType}
											/>
										),
									},
									...inspectorTabs.border({
										props,
									}),
									...inspectorTabs.boxShadow({
										props,
									}),
									...inspectorTabs.size({
										props,
										block: true,
										hideWidth: true,
									}),
									...inspectorTabs.marginPadding({
										props,
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
										selectors: customCss.selectors,
										categories: customCss.categories,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										selectors: customCss.selectors,
										categories: customCss.categories,
									}),
									...inspectorTabs.transition({
										props,
									}),
									...inspectorTabs.display({
										props,
									}),
									deviceType !== 'general' && {
										...inspectorTabs.responsive({
											props,
										}),
									},
									...inspectorTabs.opacity({
										props,
									}),
									...inspectorTabs.overflow({
										props,
									}),
									...inspectorTabs.flex({
										props,
									}),
									...inspectorTabs.zindex({
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

export default Inspector;
