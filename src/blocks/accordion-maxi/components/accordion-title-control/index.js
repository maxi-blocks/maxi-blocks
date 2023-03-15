/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ColorControl,
	FontLevelControl,
	SettingTabsControl,
	TypographyControl,
	ToggleSwitch,
} from '../../../../components';
import {
	getAttributeKey,
	getAttributeValue,
} from '../../../../extensions/styles';

const TitleSettings = props => {
	const { onChange, clientId, bgPrefix, isHover = false, breakpoint } = props;

	const bgStatus = getAttributeValue({
		target: 'status',
		props,
		isHover,
		prefix: bgPrefix,
	});

	return (
		<>
			<TypographyControl {...props} isHover={isHover} />
			<ToggleSwitch
				label={__('Enable title background', 'maxi-blocks')}
				selected={bgStatus}
				onChange={value =>
					onChange({
						[getAttributeKey('status', isHover, bgPrefix)]: value,
					})
				}
			/>
			{bgStatus && (
				<ColorControl
					label={__('Title background', 'maxi-blocks')}
					color={getAttributeValue({
						target: 'color',
						props,
						isHover,
						prefix: bgPrefix,
						breakpoint,
					})}
					prefix={bgPrefix}
					paletteColor={getAttributeValue({
						target: 'palette-color',
						props,
						isHover,
						prefix: bgPrefix,
						breakpoint,
					})}
					paletteOpacity={getAttributeValue({
						target: 'palette-opacity',
						props,
						isHover,
						prefix: bgPrefix,
						breakpoint,
					})}
					paletteStatus={getAttributeValue({
						target: 'palette-status',
						props,
						isHover,
						prefix: bgPrefix,
						breakpoint,
					})}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) =>
						onChange({
							[getAttributeKey(
								'palette-status',
								isHover,
								bgPrefix,
								breakpoint
							)]: paletteStatus,
							[getAttributeKey(
								'palette-color',
								isHover,
								bgPrefix,
								breakpoint
							)]: paletteColor,
							[getAttributeKey(
								'palette-opacity',
								isHover,
								bgPrefix,
								breakpoint
							)]: paletteOpacity,
							[getAttributeKey(
								'color',
								isHover,
								bgPrefix,
								breakpoint
							)]: color,
						})
					}
					clientId={clientId}
					disableGradient
				/>
			)}
		</>
	);
};

const AccordionTitleSettings = props => {
	const { titleLevel, onChange, breakpoint } = props;

	const prefix = 'title-';
	const bgPrefix = 'title-background-';

	return (
		<>
			{breakpoint === 'general' && (
				<FontLevelControl
					value={titleLevel}
					onChange={obj => {
						onChange({ titleLevel: obj.textLevel });
					}}
				/>
			)}
			<SettingTabsControl
				depth={2}
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<TitleSettings
								{...props}
								prefix={prefix}
								bgPrefix={bgPrefix}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable hover', 'maxi-blocks')}
									selected={getAttributeValue({
										target: 'title-typography-status-hover',
										props,
									})}
									onChange={val =>
										onChange({
											'title-typography-status-hover':
												val,
										})
									}
								/>
								{getAttributeValue({
									target: 'title-typography-status-hover',
									props,
								}) && (
									<TitleSettings
										{...props}
										prefix={prefix}
										bgPrefix={bgPrefix}
										isHover
									/>
								)}
							</>
						),
					},
					{
						label: __('Active state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__('Enable active', 'maxi-blocks')}
									selected={getAttributeValue({
										targt: 'title-typography-status-active',
										props,
									})}
									onChange={val =>
										onChange({
											'title-typography-status-active':
												val,
										})
									}
								/>
								{getAttributeValue({
									target: 'title-typography-status-active',
									props,
								}) && (
									<TitleSettings
										{...props}
										prefix={`active-${prefix}`}
										bgPrefix={`active-${bgPrefix}`}
									/>
								)}
							</>
						),
					},
				]}
			/>
		</>
	);
};

export default AccordionTitleSettings;
