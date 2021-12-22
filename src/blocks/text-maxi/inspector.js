/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	FontLevelControl,
	SettingTabsControl,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsText, categoriesText } from './custom-css';
import listTab from './list-tab';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep } from 'lodash';

/**
 * Inspector
 */
const Inspector = memo(
	props => {
		const { attributes, deviceType, setAttributes } = props;
		const { isList, textLevel } = attributes;

		return (
			<InspectorControls>
				{inspectorTabs.responsiveInfoBox({ props })}
				<SettingTabsControl
					target='sidebar-settings-tabs'
					disablePadding
					deviceType={deviceType}
					items={[
						{
							label: __('Settings', 'maxi-blocks'),
							content: (
								<>
									{inspectorTabs.blockSettings({
										props,
									})}
									<AccordionControl
										isSecondary
										items={[
											deviceType === 'general' &&
												!isList && {
													label: __(
														'Heading / Paragraph tag',
														'maxi-blocks'
													),
													content: (
														<FontLevelControl
															{...getGroupAttributes(
																attributes,
																'typography',
																true
															)}
															value={textLevel}
															onChange={obj =>
																setAttributes(
																	obj
																)
															}
														/>
													),
												},
											...(deviceType === 'general' &&
												isList &&
												listTab(props)),
											...inspectorTabs.alignment({
												props,
												isTextAlignment: true,
											}),
											...inspectorTabs.typography({
												props,
												styleCardPrefix: '',
												hideAlignment: true,
												allowLink: true,
												globalProps: {
													target: '',
													type: textLevel,
												},
												hoverGlobalProps: {
													target: 'hover',
													type: textLevel,
												},
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
								<>
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
												selectors: selectorsText,
												categories: categoriesText,
											}),
											...inspectorTabs.scrollEffects({
												props,
											}),
											...inspectorTabs.transform({
												props,
											}),
											...inspectorTabs.transition({
												props,
												label: __(
													'Hyperlink hover transition',
													'maxi-blocks'
												),
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
								</>
							),
						},
					]}
				/>
			</InspectorControls>
		);
	},
	// Avoids non-necessary renderings
	(
		{
			attributes: oldAttr,
			propsToAvoid,
			isSelected: wasSelected,
			deviceType: oldBreakpoint,
		},
		{ attributes: newAttr, isSelected, deviceType: breakpoint }
	) => {
		if (
			!wasSelected ||
			wasSelected !== isSelected ||
			oldBreakpoint !== breakpoint
		)
			return false;

		const oldAttributes = cloneDeep(oldAttr);
		const newAttributes = cloneDeep(newAttr);

		if (!isEmpty(propsToAvoid)) {
			propsToAvoid.forEach(prop => {
				delete oldAttributes[prop];
				delete newAttributes[prop];
			});

			return isEqual(oldAttributes, newAttributes);
		}

		return isEqual(oldAttributes, newAttributes);
	}
);

export default Inspector;
