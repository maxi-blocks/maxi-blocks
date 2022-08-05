/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { select, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	SettingTabsControl,
	SelectControl,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import {
	selectorsNavigationMenu,
	categoriesNavigationMenu,
} from './custom-css';
import { getGroupAttributes } from '../../extensions/styles';
import menuItemsToBlocks from '../../extensions/navigation-menu/classic-menu-to-blocks';
import createNewMenu from '../../extensions/navigation-menu/create-new-menu';
import { createBlock, parse } from '@wordpress/blocks';
import MenuItemControl from './components/menu-item-control';

/**
 * Inspector
 */
const Inspector = props => {
	const { deviceType, maxiSetAttributes, attributes, clientId, blockStyle } =
		props;
	const { selectedMenuId } = attributes;

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

	// TODO: move to separate file and REFACTOR.
	const convertBlockMenuToMaxi = async menuId => {
		const menu = select('core').getEntityRecord(
			'postType',
			'wp_navigation',
			menuId
		);
		const content = menu.content.raw;

		const blocks = parse(content);

		if (
			blocks.some(block =>
				['core/navigation-link', 'core/navigation-submenu'].includes(
					block.name
				)
			)
		) {
			const convertBlocks = blocks => {
				const res = [];

				blocks.forEach(block => {
					if (block.name === 'core/navigation-link') {
						res.push(
							createBlock(
								'maxi-blocks/navigation-link-maxi',
								block.attributes,
								block.innerBlocks
							)
						);
					} else if (block.name === 'core/navigation-submenu') {
						res.push(
							createBlock(
								'maxi-blocks/navigation-submenu-maxi',
								block.attributes,
								convertBlocks(block.innerBlocks)
							)
						);
					} else {
						res.push(block);
					}
				});

				return res;
			};

			const convertedBlocks = convertBlocks(blocks);
			const newMenuId = await createNewMenu(convertedBlocks);

			return newMenuId;
		}

		return menuId;
	};

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

	const convertClassicMenuToBlocks = async menuId => {
		const { getMenuItems, hasFinishedResolution } = select('core');

		const args = {
			menus: menuId,
			per_page: -1,
			context: 'view',
		};
		const menuItems = getMenuItems(args);
		// const itemsLoaded = hasFinishedResolution('getMenuItems', [args]);

		const innerBlocks = menuItemsToBlocks(menuItems);
		const newMenuId = await createNewMenu(innerBlocks);

		return newMenuId;
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
																+val
															);
														maxiSetAttributes({
															selectedMenuId:
																newMenuId,
														});
														return;
													}
													const newId =
														await convertBlockMenuToMaxi(
															+val
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
										selectors: selectorsNavigationMenu,
										categories: categoriesNavigationMenu,
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
