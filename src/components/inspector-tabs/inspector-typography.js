/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import TypographyControl from '@components/typography-control';
import ToggleSwitch from '@components/toggle-switch';
import FontLevelControl from '@components/font-level-control';
import AlignmentControl from '@components/alignment-control';
import { getGroupAttributes } from '@extensions/styles';
import ManageHoverTransitions from '@components/manage-hover-transitions';

/**
 * Component
 */
const typography = ({
	props,
	styleCardPrefix = '',
	hideAlignment = false,
	showBottomGap = false,
	disableCustomFormats = false,
	allowLink = false,
	globalProps,
	hoverGlobalProps,
	textLevel,
	depth = 2,
	inlineTarget = '.maxi-text-block__content',
	prefix = '',
}) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		scValues = {},
		insertInlineStyles,
		cleanInlineStyles,
		setShowLoader,
	} = props;
	const {
		blockStyle,
		isList,
		[`${prefix}typography-status-hover`]: typographyHoverStatus,
	} = attributes;

	const { 'hover-color-global': isActive, 'hover-color-all': affectAll } =
		scValues;
	const globalHoverStatus = isActive && affectAll;

	const hoverStatus = typographyHoverStatus || globalHoverStatus;

	const typographyTarget = allowLink ? ['typography', 'link'] : 'typography';

	return {
		label: __('Typography', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<>
				{/* Font Level Control (Heading/Paragraph tags) */}
				{props.name !== 'maxi-blocks/search-maxi' &&
					props.name !== 'maxi-blocks/button-maxi' &&
					props.name !== 'maxi-blocks/list-item-maxi' && (
						<div className='maxi-typography-control__font-level maxi-typography-panel__font-level'>
							<FontLevelControl
								{...getGroupAttributes(
									attributes,
									'typography',
									true
								)}
								value={textLevel || attributes.textLevel}
								onChange={obj => maxiSetAttributes(obj)}
							/>
						</div>
					)}
				{!hideAlignment && (
					<div className='maxi-typography-control__alignment-buttons'>
						<AlignmentControl
							{...getGroupAttributes(
								attributes,
								'textAlignment',
								false,
								prefix
							)}
							/* Add a unique class for Typography panel text alignment */
							className='maxi-typography-control__text-alignment maxi-typography-panel__text-alignment'
							onChange={val => {
								maxiSetAttributes(val);
								cleanInlineStyles();
							}}
							breakpoint={deviceType}
							type='text'
							disableRTC
							prefix={prefix}
						/>
					</div>
				)}
				<SettingTabsControl
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: (
								<TypographyControl
									{...getGroupAttributes(
										attributes,
										typographyTarget,
										false,
										prefix
									)}
									onChangeInline={(
										obj,
										target,
										isMultiplySelector
									) =>
										insertInlineStyles({
											obj,
											target,
											isMultiplySelector,
										})
									}
									onChange={(obj, target) => {
										maxiSetAttributes(obj);
										cleanInlineStyles(target);
									}}
									setShowLoader={setShowLoader}
									hideAlignment={hideAlignment}
									showBottomGap={showBottomGap}
									breakpoint={deviceType}
									clientId={clientId}
									disableCustomFormats={disableCustomFormats}
									blockStyle={blockStyle}
									styleCardPrefix={styleCardPrefix}
									textLevel={
										textLevel || attributes.textLevel
									}
									inlineTarget={inlineTarget}
									isList={isList}
									allowLink={allowLink}
									globalProps={globalProps}
									prefix={prefix}
								/>
							),
						},
						{
							label: __('Hover state', 'maxi-blocks'),
							content: (
								<>
									<ManageHoverTransitions />
									{!globalHoverStatus && (
										<ToggleSwitch
											label={__(
												'Enable typography hover',
												'maxi-blocks'
											)}
											selected={hoverStatus}
											onChange={val =>
												maxiSetAttributes({
													[`${prefix}typography-status-hover`]:
														val,
												})
											}
										/>
									)}
									{hoverStatus && (
										<TypographyControl
											{...getGroupAttributes(
												attributes,
												'typography',
												true,
												prefix
											)}
											onChange={obj =>
												maxiSetAttributes(obj)
											}
											hideAlignment={hideAlignment}
											breakpoint={deviceType}
											isHover
											clientId={clientId}
											disableCustomFormats={
												disableCustomFormats
											}
											blockStyle={blockStyle}
											styleCardPrefix={styleCardPrefix}
											isList={isList}
											globalProps={hoverGlobalProps}
											prefix={prefix}
										/>
									)}
								</>
							),
							extraIndicators: [
								`${prefix}typography-status-hover`,
							],
						},
					]}
					depth={depth}
				/>
			</>
		),
	};
};

export default typography;
