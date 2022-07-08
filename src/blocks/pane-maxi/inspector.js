/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	SettingTabsControl,
	AccordionControl,
	AccordionBackgroundSettings,
	AccordionIconSettings,
	AccordionTitleSettings,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { withMaxiInspector } from '../../extensions/inspector';
import { categoriesPane, selectorsPane } from './custom-css';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		deviceType,
		attributes,
		setAccordionAttributes,
		accordionAttributes,
	} = props;
	const { blockStyle } = attributes;

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
									deviceType === 'general' && {
										label: __('Title', 'maxi-blocks'),
										content: (
											<AccordionTitleSettings
												onChange={obj =>
													setAccordionAttributes(obj)
												}
												{...getGroupAttributes(
													accordionAttributes,
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
													accordionAttributes,
													'accordionIcon'
												)}
												blockStyle={blockStyle}
												onChange={obj =>
													setAccordionAttributes(obj)
												}
												breakpoint={deviceType}
											/>
										),
									},
									{
										label: __(
											'Pane background',
											'maxi-blocks'
										),
										content: (
											<AccordionBackgroundSettings
												{...accordionAttributes}
												onChange={obj =>
													setAccordionAttributes(obj)
												}
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
										selectors: selectorsPane,
										categories: categoriesPane,
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
										selectors: selectorsPane,
										categories: categoriesPane,
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
