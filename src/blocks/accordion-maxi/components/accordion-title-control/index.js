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
	getAttributesValue,
} from '../../../../extensions/attributes';

const TitleSettings = props => {
	const { onChange, clientId, bgPrefix, isHover = false, breakpoint } = props;

	const bgStatus = getAttributesValue({
		target: '.s',
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
						[getAttributeKey({
							key: '.s',
							isHover,
							prefix: bgPrefix,
						})]: value,
					})
				}
			/>
			{bgStatus && (
				<ColorControl
					label={__('Title background', 'maxi-blocks')}
					color={getAttributesValue({
						target: '_cc',
						props,
						isHover,
						prefix: bgPrefix,
						breakpoint,
					})}
					prefix={bgPrefix}
					paletteColor={getAttributesValue({
						target: '_pc',
						props,
						isHover,
						prefix: bgPrefix,
						breakpoint,
					})}
					paletteOpacity={getAttributesValue({
						target: '_po',
						props,
						isHover,
						prefix: bgPrefix,
						breakpoint,
					})}
					paletteStatus={getAttributesValue({
						target: '_ps',
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
							[getAttributeKey({
								key: '_ps',
								isHover,
								prefix: bgPrefix,
								breakpoint,
							})]: paletteStatus,
							[getAttributeKey({
								key: '_pc',
								isHover,
								prefix: bgPrefix,
								breakpoint,
							})]: paletteColor,
							[getAttributeKey({
								key: '_po',
								isHover,
								prefix: bgPrefix,
								breakpoint,
							})]: paletteOpacity,
							[getAttributeKey({
								key: '_cc',
								isHover,
								prefix: bgPrefix,
								breakpoint,
							})]: color,
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
	const { onChange, breakpoint } = props;

	const titleLevel = getAttributesValue({
		target: '_tle',
		props,
	});

	const prefix = 'ti-';
	const bgPrefix = 'ti-b-';

	return (
		<>
			{breakpoint === 'general' && (
				<FontLevelControl
					value={titleLevel}
					onChange={obj => {
						onChange({ _tle: obj.textLevel });
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
									selected={getAttributesValue({
										target: 'ti-t.sh',
										props,
									})}
									onChange={val =>
										onChange({
											'ti-t.sh': val,
										})
									}
								/>
								{getAttributesValue({
									target: 'ti-t.sh',
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
									selected={getAttributesValue({
										target: 'ti-t.sa',
										props,
									})}
									onChange={val =>
										onChange({
											'ti-t.sa': val,
										})
									}
								/>
								{getAttributesValue({
									target: 'ti-t.sa',
									props,
								}) && (
									<TitleSettings
										{...props}
										prefix={`a-${prefix}`}
										bgPrefix={`a-${bgPrefix}`}
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
