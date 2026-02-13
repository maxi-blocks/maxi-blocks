/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import AccordionControl from '@components/accordion-control';
import FlexGapControl from '@components/flex-settings-control/flex-gap-control';
import FlexWrapControl from '@components/flex-settings-control/flex-wrap-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import SettingTabsControl from '@components/setting-tabs-control';
import ColumnPattern from './components/column-pattern';
import { getGroupAttributes } from '@extensions/styles';
import * as inspectorTabs from '@components/inspector-tabs';
import { ariaLabelsCategories, customCss } from './data';
import { withMaxiInspector } from '@extensions/inspector';

function ColumnPicker(props) {
	const {
		clientId,
		attributes,
		deviceType,
		repeaterStatus,
		repeaterRowClientId,
		getInnerBlocksPositions,
		maxiSetAttributes,
	} = props;

	return (
		<>
			<ColumnPattern
				clientId={clientId}
				{...getGroupAttributes(attributes, 'rowPattern')}
				onChange={obj => maxiSetAttributes(obj)}
				breakpoint={deviceType}
				repeaterStatus={repeaterStatus}
				repeaterRowClientId={repeaterRowClientId}
				getInnerBlocksPositions={getInnerBlocksPositions}
			/>
			<FlexGapControl
				{...getGroupAttributes(attributes, 'flex')}
				onChange={maxiSetAttributes}
				breakpoint={deviceType}
			/>
			<FlexWrapControl
				{...getGroupAttributes(attributes, 'flex')}
				onChange={maxiSetAttributes}
				breakpoint={deviceType}
			/>
		</>
	);
}

/**
 * Inspector
 */
const Inspector = props => {
	const {
		deviceType,
		isRepeaterInherited,
		updateInnerBlocksPositions,
		attributes,
	} = props;
	const { selectors: allSelectors, categories: allCategories } = customCss;

	// Get carousel status to conditionally show Arrows and Dots tabs
	const carouselStatus = attributes['row-carousel-status'];

	// Filter out carousel-related custom CSS categories/selectors when carousel is disabled
	const carouselCssKeys = [
		'first arrow',
		'second arrow',
		'first arrow icon',
		'second arrow icon',
		'all dots',
		'each dot',
		'dot icon',
	];
	const categories = carouselStatus
		? allCategories
		: allCategories.filter(cat => !carouselCssKeys.includes(cat));
	const selectors = carouselStatus
		? allSelectors
		: Object.fromEntries(
				Object.entries(allSelectors).filter(
					([key]) => !carouselCssKeys.includes(key)
				)
		  );

	return (
		<InspectorControls>
			{inspectorTabs.blockSettings({
				props,
			})}
			{inspectorTabs.repeaterInfoBox({ props })}
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
							<AccordionControl
								isPrimary
								items={[
									{
										label: __(
											'Column picker',
											'maxi-blocks'
										),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
												<ColumnPicker {...props} />
											</ResponsiveTabsControl>
										),
										ignoreIndicator: [
											`row-pattern-${deviceType}`,
										],
										extraIndicators: [
											'verticalAlign',
											'horizontalAlign',
										],
									},
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
									...inspectorTabs.contextLoop({
										props,
										contentType: 'row',
									}),
									...inspectorTabs.repeater({
										props,
										isRepeaterInherited,
										updateInnerBlocksPositions,
									}),
								]}
							/>
						),
						ignoreIndicator: [`row-pattern-${deviceType}`],
					},
					{
						label: __('Carousel', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									...inspectorTabs.carouselSlider({
										props,
									}),
									...(carouselStatus
										? [
												...inspectorTabs.carouselArrows(
													{
														props,
													}
												),
												...inspectorTabs.carouselDots({
													props,
												}),
										  ]
										: []),
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
									...inspectorTabs.ariaLabel({
										props,
										targets: ariaLabelsCategories,
										blockName: props.name,
									}),
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
										selectors,
										categories,
									}),
									...inspectorTabs.advancedCss({
										props,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										selectors,
										categories,
									}),
									...inspectorTabs.transition({
										props,
										selectors,
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
									...inspectorTabs.flex({
										props,
									}),
									...inspectorTabs.zindex({
										props,
									}),
									...inspectorTabs.relation({
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

export default withMaxiInspector(Inspector);
