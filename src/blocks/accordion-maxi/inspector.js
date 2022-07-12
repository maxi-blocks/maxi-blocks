/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	SettingTabsControl,
	AccordionControl,
	AccordionSettings,
	ResponsiveTabsControl,
	AccordionLineControl,
	AccordionIconSettings,
	AccordionTitleSettings,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { withMaxiInspector } from '../../extensions/inspector';
import { getGroupAttributes } from '../../extensions/styles';
import { categoriesAccordion, selectorsAccordion } from './custom-css';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		clientId,
		insertInlineStyles,
		cleanInlineStyles,
		inlineStylesTargets,
	} = props;

	const { accrordionLayout, blockStyle } = attributes;

	const onChangePanes = obj => {
		const innerBlocks = select(
			'core/block-editor'
		).getClientIdsOfDescendants([clientId]);

		innerBlocks.forEach(blockClientId => {
			if (
				select('core/block-editor').getBlockRootClientId(
					blockClientId
				) === clientId
			) {
				const blockAttributes =
					select('core/block-editor').getBlockAttributes(
						blockClientId
					);
				maxiSetAttributes(
					obj,
					blockAttributes,
					blockClientId,
					response =>
						dispatch('core/block-editor').updateBlockAttributes(
							blockClientId,
							response
						)
				);
			}
		});
	};

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			{inspectorTabs.blockSettings({
				props: {
					...props,
				},
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
								items={[
									{
										label: __(
											'Accordion settings',
											'maxi-blocks'
										),
										content: (
											<AccordionSettings
												clientId={clientId}
												{...getGroupAttributes(
													attributes,
													'accordion'
												)}
												breakpoint={deviceType}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
											/>
										),
									},
									deviceType === 'general' && {
										label: __('Title', 'maxi-blocks'),
										content: (
											<AccordionTitleSettings
												onChange={obj => {
													onChangePanes(obj);
													maxiSetAttributes(obj);
												}}
												{...getGroupAttributes(
													attributes,
													'accordionTitle'
												)}
											/>
										),
									},
									{
										label: __('Icon', 'maxi-blocks'),
										content: (
											<AccordionIconSettings
												{...getGroupAttributes(
													attributes,
													'accordionIcon'
												)}
												blockStyle={blockStyle}
												onChange={obj => {
													onChangePanes(obj);
													maxiSetAttributes(obj);
												}}
												breakpoint={deviceType}
											/>
										),
									},
									{
										label: __(
											'Line settings',
											'maxi-blocks'
										),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<AccordionLineControl
													{...getGroupAttributes(
														attributes,
														'accordionLine'
													)}
													onChangeInline={obj => {
														insertInlineStyles({
															obj,
															target: inlineStylesTargets.headerLine,
															isMultiplySelector: true,
															pseudoElement:
																'::after',
														});
														if (
															accrordionLayout ===
															'simple'
														)
															insertInlineStyles({
																obj,
																target: inlineStylesTargets.contentLine,
																isMultiplySelector: true,
															});
													}}
													onChange={obj => {
														maxiSetAttributes(obj);
														onChangePanes(obj);
														cleanInlineStyles(
															inlineStylesTargets.headerLine,
															'::after'
														);
														if (
															accrordionLayout ===
															'simple'
														)
															cleanInlineStyles(
																inlineStylesTargets.contentLine,
																'::after'
															);
													}}
													breakpoint={deviceType}
													clientId={clientId}
												/>
											</ResponsiveTabsControl>
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
											props: {
												...props,
											},
										}),
									},
									deviceType === 'general' && {
										...inspectorTabs.anchor({
											props: {
												...props,
											},
										}),
									},
									...inspectorTabs.customCss({
										props: {
											...props,
										},
										breakpoint: deviceType,
										selectors: selectorsAccordion,
										categories: categoriesAccordion,
									}),
									...inspectorTabs.scrollEffects({
										props: {
											...props,
										},
									}),
									...inspectorTabs.transform({
										props: {
											...props,
										},
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
									}),
									...inspectorTabs.display({
										props: {
											...props,
										},
									}),
									...inspectorTabs.position({
										props: {
											...props,
										},
									}),
									deviceType !== 'general' && {
										...inspectorTabs.responsive({
											props: {
												...props,
											},
										}),
									},
									...inspectorTabs.overflow({
										props: {
											...props,
										},
									}),
									...inspectorTabs.flex({
										props: {
											...props,
										},
									}),
									...inspectorTabs.zindex({
										props: {
											...props,
										},
									}),
									...inspectorTabs.relation({
										props,
										isButton: true,
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
