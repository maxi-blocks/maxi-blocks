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
	const { onChange, clientId, bgPrefix, isHover = false } = props;

	return (
		<>
			<TypographyControl {...props} isHover={isHover} />
			<ColorControl
				label={__('Title background', 'maxi-blocks')}
				color={getAttributeValue({
					target: 'color',
					props,
					isHover,
					prefix: bgPrefix,
				})}
				prefix={bgPrefix}
				paletteColor={getAttributeValue({
					target: 'palette-color',
					props,
					isHover,
					prefix: bgPrefix,
				})}
				paletteOpacity={getAttributeValue({
					target: 'palette-opacity',
					props,
					isHover,
					prefix: bgPrefix,
				})}
				paletteStatus={getAttributeValue({
					target: 'palette-status',
					props,
					isHover,
					prefix: bgPrefix,
				})}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) =>
					onChange({
						[getAttributeKey('palette-status', isHover, bgPrefix)]:
							paletteStatus,
						[getAttributeKey('palette-color', isHover, bgPrefix)]:
							paletteColor,
						[getAttributeKey('palette-opacity', isHover, bgPrefix)]:
							paletteOpacity,
						[getAttributeKey('color', isHover, bgPrefix)]: color,
					})
				}
				clientId={clientId}
				disableGradient
			/>
		</>
	);
};

const AccordionTitleSettings = props => {
	const { titleLevel, onChange } = props;

	const prefix = 'title-';
	const bgPrefix = 'title-background-';

	return (
		<>
			<FontLevelControl
				value={titleLevel}
				onChange={obj => {
					onChange({ titleLevel: obj.textLevel });
				}}
			/>
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
									selected={
										props['title-typography-status-hover']
									}
									onChange={val =>
										onChange({
											'title-typography-status-hover':
												val,
										})
									}
								/>
								{props['title-typography-status-hover'] && (
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
									selected={
										props['title-typography-status-active']
									}
									onChange={val =>
										onChange({
											'title-typography-status-active':
												val,
										})
									}
								/>
								{props['title-typography-status-active'] && (
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
