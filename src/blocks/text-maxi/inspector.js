/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { memo, useState } from '@wordpress/element';
import { isURL } from '@wordpress/url';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	AdvancedNumberControl,
	FontLevelControl,
	SelectControl,
	SettingTabsControl,
	TextControl,
} from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsText, categoriesText } from './custom-css';

/**
 * External dependencies
 */
import { isEmpty, isEqual, cloneDeep, capitalize } from 'lodash';
import MaxiModal from '../../editor/library/modal';

/**
 * Inspector
 */
const listTab = props => {
	const { attributes, deviceType, setAttributes } = props;
	const {
		parentBlockStyle,
		isList,
		listReversed,
		listStart,
		typeOfList,
		listPosition,
		listStyle,
		listStyleCustom,
	} = attributes;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [listStyleSource, setListStyleSource] = useState(
		(isURL(listStyleCustom) && 'url') ||
			(listStyleCustom.includes('<svg ') && 'icon') ||
			'text'
	);

	const getListStyleOptions = () =>
		[
			'none',
			'custom',
			'disc',
			'circle',
			'square',
			'decimal',
			'cjk-decimal',
			'decimal-leading-zero',
			'lower-roman',
			'upper-roman',
			'lower-greek',
			'lower-alpha',
			'lower-latin',
			'upper-alpha',
			'upper-latin',
			'arabic-indic',
			'armenian',
			'bengali',
			'cambodian',
			'khmer',
			'cjk-earthly-branch',
			'cjk-heavenly-stem',
			'cjk-ideographic',
			'trad-chinese-informal',
			'devanagari',
			'ethiopic-numeric',
			'georgian',
			'gujarati',
			'gurmukhi',
			'hebrew',
			'hiragana',
			'hiragana-iroha',
			'japanese-formal',
			'japanese-informal',
			'kannada',
			'katakana',
			'katakana-iroha',
			'korean-hangul-formal',
			'korean-hanja-formal',
			'korean-hanja-informal',
			'lao',
			'lower-armenian',
			'malayalam',
			'mongolian',
			'myanmar',
			'oriya',
			'persian',
			'simp-chinese-formal',
			'simp-chinese-informal',
			'tamil',
			'telugu',
			'thai',
			'tibetan',
			'trad-chinese-formal',
			'trad-chinese-informal',
			'upper-armenian',
			'disclosure-open',
			'details',
			'disclosure-closed',
			'details',
		].map(style => {
			return {
				label: __(`${capitalize(style)}`, 'maxi-blocks'),
				value: style,
			};
		});

	return {
		...(deviceType === 'general' &&
			isList && {
				label: __('List options', 'maxi-blocks'),
				content: (
					<>
						<SelectControl
							label={__('List position', 'maxi-blocks')}
							className='maxi-image-inspector__list-position'
							value={listPosition}
							options={[
								{
									label: __('Inside', 'maxi-blocks'),
									value: 'inside',
								},
								{
									label: __('Outside', 'maxi-blocks'),
									value: 'outside',
								},
							]}
							onChange={listPosition =>
								setAttributes({
									listPosition,
								})
							}
						/>
						<AdvancedNumberControl
							label={__('List gap', 'maxi-blocks')}
							className='maxi-image-inspector__list-gap'
							placeholder={getLastBreakpointAttribute(
								'list-gap',
								deviceType,
								attributes
							)}
							value={attributes[`list-gap-${deviceType}`]}
							onChangeValue={val =>
								setAttributes({
									[`list-gap-${deviceType}`]: val,
								})
							}
							enableUnit
							unit={getLastBreakpointAttribute(
								'list-gap-unit',
								deviceType,
								attributes
							)}
							minMaxSettings={{
								px: {
									min: 0,
									max: 999,
								},
								em: {
									min: 0,
									max: 99,
								},
								vw: {
									min: 0,
									max: 99,
								},
								'%': {
									min: 0,
									max: 100,
								},
							}}
							onChangeUnit={val =>
								setAttributes({
									[`list-gap-unit-${deviceType}`]: val,
								})
							}
						/>
						<SelectControl
							label={__('Type of list', 'maxi-blocks')}
							className='maxi-image-inspector__list-type'
							value={typeOfList}
							options={[
								{
									label: __('Unorganized', 'maxi-blocks'),
									value: 'ul',
								},
								{
									label: __('Organized', 'maxi-blocks'),
									value: 'ol',
								},
							]}
							onChange={typeOfList =>
								setAttributes({
									typeOfList,
								})
							}
						/>
						{typeOfList === 'ol' && (
							<>
								<AdvancedNumberControl
									label={__('Start From', 'maxi-blocks')}
									className='maxi-image-inspector__list-start'
									value={listStart}
									onChangeValue={val => {
										setAttributes({
											listStart:
												val !== undefined && val !== ''
													? val
													: '',
										});
									}}
									min={-99}
									max={99}
									onReset={() =>
										setAttributes({
											listStart: '',
										})
									}
								/>
								<SelectControl
									label={__('Reverse order', 'maxi-blocks')}
									className='maxi-image-inspector__list-reverse'
									value={listReversed}
									options={[
										{
											label: __('Yes', 'maxi-blocks'),
											value: 1,
										},
										{
											label: __('No', 'maxi-blocks'),
											value: 0,
										},
									]}
									onChange={value => {
										setAttributes({
											listReversed: Number(value),
										});
									}}
								/>
							</>
						)}
						{typeOfList === 'ul' && (
							<>
								<SelectControl
									label={__('Style', 'maxi-blocks')}
									className='maxi-image-inspector__list-style'
									value={listStyle || 'disc'}
									options={getListStyleOptions()}
									onChange={listStyle =>
										setAttributes({
											listStyle,
										})
									}
								/>
								{listStyle === 'custom' && (
									<>
										<SelectControl
											label={__('Source', 'maxi-blocks')}
											className='maxi-image-inspector__list-source-selector'
											value={listStyleSource}
											options={[
												{
													label: __(
														'Text',
														'maxi-blocks'
													),
													value: 'text',
												},
												{
													label: __(
														'URL',
														'maxi-blocks'
													),
													value: 'url',
												},
												{
													label: __(
														'Icon',
														'maxi-blocks'
													),
													value: 'icon',
												},
											]}
											onChange={listStyleSource =>
												setListStyleSource(
													listStyleSource
												)
											}
										/>
										{listStyleSource !== 'icon' && (
											<TextControl
												className='maxi-image-inspector__list-source-text'
												value={listStyleCustom}
												onChange={listStyleCustom =>
													setAttributes({
														listStyleCustom,
													})
												}
											/>
										)}
										{listStyleSource === 'icon' && (
											<MaxiModal
												type='image-shape'
												style={
													parentBlockStyle || 'light'
												}
												onSelect={obj =>
													setAttributes({
														listStyleCustom:
															obj.SVGElement,
													})
												}
												onRemove={() =>
													setAttributes({
														listStyleCustom: '',
													})
												}
												icon={listStyleCustom}
											/>
										)}
									</>
								)}
							</>
						)}
					</>
				),
			}),
	};
};

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
											...listTab(props),
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
											...inspectorTabs.motion({
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
