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
	NumberCounterControl,
	SettingTabsControl,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { getBgLayersSelectorsCss } from '../../components/background-displayer/utils';
import { selectorsNumberCounter, categoriesNumberCounter } from './custom-css';

/**
 * External dependencies
 */
import { isEmpty, without } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const { 'background-layers': bgLayers } = attributes;
	const bgLayersHover = !isEmpty(attributes['background-layers-hover'])
		? attributes['background-layers-hover']
		: [];

	const getCategoriesCss = () => {
		const { 'block-background-hover-status': blockBackgroundHoverStatus } =
			attributes;
		return without(
			categoriesNumberCounter,
			isEmpty(bgLayers) && 'background',
			!blockBackgroundHoverStatus && 'background hover'
		);
	};

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
										{
											label: __('Number', 'maxi-blocks'),
											content: (
												<NumberCounterControl
													{...getGroupAttributes(
														attributes,
														'numberCounter'
													)}
													{...getGroupAttributes(
														attributes,
														'size',
														false,
														'number-counter-'
													)}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										...inspectorTabs.border({
											props,
											prefix: 'number-counter-',
										}),
										...inspectorTabs.boxShadow({
											props,
											prefix: 'number-counter-',
										}),
										...inspectorTabs.marginPadding({
											props,
											prefix: 'number-counter-',
										}),
									]}
								/>
							</>
						),
					},
					{
						label: __('Canvas', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
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
									...inspectorTabs.opacity({
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
											...selectorsNumberCounter,
											...getBgLayersSelectorsCss([
												...bgLayers,
												...bgLayersHover,
											]),
										},
										categories: getCategoriesCss(),
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
