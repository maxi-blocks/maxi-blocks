/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { AccordionControl, SettingTabsControl } from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import {
	getBgLayersCategoriesCss,
	getBgLayersSelectorsCss,
} from '../../components/background-displayer/utils';
import { selectorsGroup, categoriesGroup } from './custom-css';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType } = props;
	const { 'background-layers': bgLayers } = attributes;

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			<SettingTabsControl
				target='sidebar-settings-tabs'
				disablePadding
				deviceType={deviceType}
				depth={0}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<>
								{inspectorTabs.blockSettings({
									props,
								})}
								<AccordionControl
									isPrimary
									items={[
										...inspectorTabs.calloutArrow({
											props,
										}),
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
							</>
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
										selectors: {
											...selectorsGroup,
											...getBgLayersSelectorsCss(
												bgLayers
											),
										},
										categories: [
											...categoriesGroup,
											...getBgLayersCategoriesCss(
												bgLayers
											),
										],
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
