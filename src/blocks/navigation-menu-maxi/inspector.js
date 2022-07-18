/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { dispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	SettingTabsControl,
	SelectControl,
	MenuItemControl,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import {
	selectorsNavigationMenu,
	categoriesNavigationMenu,
} from './custom-css';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Inspector
 */
const Inspector = props => {
	const { deviceType, maxiSetAttributes, attributes, clientId, blockStyle } =
		props;
	const { selectedMenuId } = attributes;

	const { navigationMenus } = useSelect(select => {
		const { getEntityRecords } = select('core');

		const args = [
			'postType',
			'wp_navigation',
			{ per_page: -1, status: 'publish' },
		];

		return {
			navigationMenus: getEntityRecords(...args),
		};
	});
	console.log(navigationMenus);
	const getMenuSourceItems = navigationMenus => {
		return (
			navigationMenus?.map(({ title, id }) => {
				return {
					label: __(title.rendered, 'maxi-blocks'),
					value: id,
				};
			}) || []
		);
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
														navigationMenus
													),
													{
														label: __(
															'Create new',
															'maxi-blocks'
														),
														value: -1,
													},
												]}
												onChange={val =>
													maxiSetAttributes({
														selectedMenuId: val,
													})
												}
											/>
										),
									},
									{
										label: 'Menu item',
										content: (
											<MenuItemControl
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
												inlineTarget=' .maxi-navigation-link-block a'
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
										selectors: selectorsNavigationMenu,
										categories: categoriesNavigationMenu,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
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
