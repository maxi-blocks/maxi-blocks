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
} from '../../../../components';
import {
	getAttributeKey,
	getAttributeValue,
} from '../../../../extensions/styles';

const TitleColor = props => {
	const { onChange, clientId, prefix, bgPrefix, isHover = false } = props;

	return (
		<>
			<ColorControl
				label={__('Title', 'maxi-blocks')}
				color={getAttributeValue({
					target: 'color',
					props,
					isHover,
					prefix,
				})}
				prefix={prefix}
				paletteColor={getAttributeValue({
					target: 'palette-color',
					props,
					isHover,
					prefix,
				})}
				paletteOpacity={getAttributeValue({
					target: 'palette-opacity',
					props,
					isHover,
					prefix,
				})}
				paletteStatus={getAttributeValue({
					target: 'palette-status',
					props,
					isHover,
					prefix,
				})}
				onChange={({
					color,
					paletteColor,
					paletteStatus,
					paletteOpacity,
				}) =>
					onChange({
						[getAttributeKey('palette-status', isHover, prefix)]:
							paletteStatus,
						[getAttributeKey('palette-color', isHover, prefix)]:
							paletteColor,
						[getAttributeKey('palette-opacity', isHover, prefix)]:
							paletteOpacity,
						[getAttributeKey('color', isHover, prefix)]: color,
					})
				}
				clientId={clientId}
				disableGradient
			/>
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
							<TitleColor
								{...props}
								prefix={prefix}
								bgPrefix={bgPrefix}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<TitleColor
								{...props}
								prefix={prefix}
								bgPrefix={bgPrefix}
								isHover
							/>
						),
					},
					{
						label: __('Active state', 'maxi-blocks'),
						content: (
							<TitleColor
								{...props}
								prefix={`active-${prefix}`}
								bgPrefix={`active-${bgPrefix}`}
							/>
						),
					},
				]}
			/>
		</>
	);
};

export default AccordionTitleSettings;
