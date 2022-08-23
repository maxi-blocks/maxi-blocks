/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { SettingTabsControl, AccordionControl } from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { withMaxiInspector } from '../../extensions/inspector';
import { categoriesPane, selectorsPane } from './custom-css';

/**
 * Inspector
 */
const Inspector = props => {
	const { deviceType } = props;

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
						label: __('Pane', 'maxi-blocks'),
						content: (
							<AccordionControl
								items={[
									...inspectorTabs.blockBackground({
										props,
									}),
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
						label: __('Header', 'maxi-blocks'),
						content: (
							<AccordionControl
								items={[
									...inspectorTabs.background({
										props,
										label: 'Header',
										prefix: 'header-',
										inlineTarget:
											'.maxi-pane-block__header',
										disableImage: true,
										disableVideo: true,
										disableSVG: true,
									}),
									...inspectorTabs.border({
										props,
										prefix: 'header-',
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'header-',
									}),
									...inspectorTabs.size({
										props,
										prefix: 'header-',
									}),
									...inspectorTabs.marginPadding({
										props,
										customLabel: 'Padding',
										prefix: 'header-',
										disableMargin: true,
									}),
								]}
							/>
						),
					},
					{
						label: __('Content', 'maxi-blocks'),
						content: (
							<AccordionControl
								items={[
									...inspectorTabs.background({
										props,
										label: 'Content',
										prefix: 'content-',
										inlineTarget:
											'.maxi-pane-block__content',
										disableImage: true,
										disableVideo: true,
										disableSVG: true,
									}),
									...inspectorTabs.border({
										props,
										prefix: 'content-',
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'content-',
									}),
									...inspectorTabs.size({
										props,
										prefix: 'content-',
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
