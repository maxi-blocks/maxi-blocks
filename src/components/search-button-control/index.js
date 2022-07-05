/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	BackgroundControl,
	IconControl,
	PaddingControl,
	SelectControl,
	SettingTabsControl,
	TypographyControl,
} from '../../components';
import { getIconWithColor, getGroupAttributes } from '../../extensions/styles';

const StateControls = props => {
	const {
		searchButtonSkin,
		svgType,
		onChange,
		blockStyle,
		breakpoint,
		cleanInlineStyles,
		clientId,
		prefix,
		isHover = false,
	} = props;
	const searchButtonIsIcon = searchButtonSkin === 'icon';

	return (
		<>
			{searchButtonIsIcon ? (
				<IconControl
					{...getGroupAttributes(
						props,
						[
							'icon',
							'iconBackground',
							'iconBackgroundGradient',
							'iconBackgroundColor',
							'iconBorder',
							'iconBorderWidth',
							'iconBorderRadius',
							'iconPadding',
						],
						isHover
					)}
					blockStyle={blockStyle}
					breakpoint={breakpoint}
					clientId={clientId}
					disableBackground
					disableIconInherit
					disablePadding
					getIconWithColor={args => getIconWithColor(props, args)}
					isHover={isHover}
					onChange={onChange}
					svgType={svgType}
					type='search-icon'
				/>
			) : (
				<TypographyControl
					blockStyle={blockStyle}
					breakpoint={breakpoint}
					clientId={clientId}
					disableCustomFormats
					hideAlignment
					isHover={isHover}
					onChange={onChange}
					prefix={prefix}
					typography={getGroupAttributes(
						props,
						'typography',
						isHover,
						prefix
					)}
				/>
			)}
			<BackgroundControl
				{...getGroupAttributes(
					props,
					['background', 'backgroundColor'],
					isHover,
					prefix
				)}
				breakpoint={breakpoint}
				clientId={clientId}
				disableClipPath
				disableGradient
				disableImage
				disableNoneStyle
				disableSVG
				disableVideo
				isHover={isHover}
				onChange={onChange}
				prefix={prefix}
			/>
		</>
	);
};

const SearchButtonControl = props => {
	const {
		searchButtonSkin,
		onChange,
		breakpoint,
		prefix = 'search-button-',
	} = props;

	return (
		<div className='maxi-search-button-control'>
			<SelectControl
				className='maxi-search-button-control__skin'
				label={__('Skin', 'maxi-blocks')}
				value={searchButtonSkin}
				options={[
					{
						label: __('Icon', 'maxi-blocks'),
						value: 'icon',
					},
					{
						label: __('Text', 'maxi-blocks'),
						value: 'text',
					},
				]}
				onChange={searchButtonSkin => onChange({ searchButtonSkin })}
			/>
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: <StateControls {...props} />,
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: <StateControls {...props} isHover />,
					},
				]}
			/>
			<PaddingControl
				{...getGroupAttributes(props, 'padding', false, prefix)}
				breakpoint={breakpoint}
				onChange={onChange}
				prefix={prefix}
			/>
		</div>
	);
};

export default SearchButtonControl;
