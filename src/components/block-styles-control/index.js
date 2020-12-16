import { FancyRadioControl } from '..';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Component
 */
const BlockStylesControl = props => {
	const {
		blockStyle,
		defaultBlockStyle,
		blockStyleBackground,
		onChange,
		isFirstOnHierarchy,
		isHighlightText,
		isHighlightBackground,
		isHighlightBorder,
		isHighlightColor1,
		isHighlightColor2,
		disableHighlightText = false,
		disableHighlightBackground = false,
		disableHighlightBorder = false,
		disableHighlightColor1 = false,
		disableHighlightColor2 = false,
		onChangeBorder,
		border,
	} = props;

	const getSelectorOptions = () => {
		if (isFirstOnHierarchy)
			return [
				{ label: __('Dark', 'maxi-blocks'), value: 'maxi-dark' },
				{ label: __('Light', 'maxi-blocks'), value: 'maxi-light' },
				{ label: __('Custom', 'maxi-blocks'), value: 'maxi-custom' },
			];
		return [
			{ label: __('Parent', 'maxi-blocks'), value: 'maxi-parent' },
			{ label: __('Custom', 'maxi-blocks'), value: 'maxi-custom' },
		];
	};

	const borderValue = !isObject(border) ? JSON.parse(border) : border;

	return (
		<Fragment>
			<SelectControl
				label={__('Block Style', 'maxi-blocks')}
				value={blockStyle}
				options={getSelectorOptions()}
				onChange={blockStyle => onChange({ blockStyle })}
			/>
			{blockStyle === 'maxi-custom' && (
				<SelectControl
					label={__('Default Block Style', 'maxi-blocks')}
					className='maxi--default-block-style'
					value={defaultBlockStyle}
					options={[
						{
							label: __('Dark', 'maxi-blocks'),
							value: 'maxi-def-dark',
						},
						{
							label: __('Light', 'maxi-blocks'),
							value: 'maxi-def-light',
						},
					]}
					onChange={defaultBlockStyle =>
						onChange({ defaultBlockStyle })
					}
				/>
			)}
			{blockStyle !== 'maxi-custom' && (
				<Fragment>
					{!disableHighlightText && (
						<FancyRadioControl
							label={__('Highlight Text', 'maxi-blocks')}
							selected={isHighlightText}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={isHighlightText =>
								onChange({ isHighlightText: +isHighlightText })
							}
						/>
					)}
					{!disableHighlightBackground && (
						<FancyRadioControl
							label={__('Highlight Background', 'maxi-blocks')}
							selected={isHighlightBackground}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={isHighlightBackground =>
								onChange({
									isHighlightBackground: +isHighlightBackground,
								})
							}
						/>
					)}
					{!disableHighlightBorder && (
						<FancyRadioControl
							label={__('Highlight Border', 'maxi-blocks')}
							selected={isHighlightBorder}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={isHighlightBorder => {
								onChange({
									isHighlightBorder: +isHighlightBorder,
								});

								borderValue.general['border-style'] = 'solid';
								borderValue.borderWidth.general[
									'border-right-width'
								] = 2;
								borderValue.borderWidth.general[
									'border-left-width'
								] = 2;
								borderValue.borderWidth.general[
									'border-top-width'
								] = 2;
								borderValue.borderWidth.general[
									'border-bottom-width'
								] = 2;

								onChangeBorder(JSON.stringify(borderValue));
							}}
						/>
					)}
					{!disableHighlightColor1 && (
						<__experimentalFancyRadioControl
							label={__('Highlight SVG Color 1', 'maxi-blocks')}
							selected={isHighlightColor1}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={isHighlightColor1 =>
								onChange({
									isHighlightColor1: +isHighlightColor1,
								})
							}
						/>
					)}
					{!disableHighlightColor2 && (
						<__experimentalFancyRadioControl
							label={__('Highlight SVG Color 2', 'maxi-blocks')}
							selected={isHighlightColor2}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={isHighlightColor2 =>
								onChange({
									isHighlightColor2: +isHighlightColor2,
								})
							}
						/>
					)}
					{isFirstOnHierarchy && (
						<FancyRadioControl
							label={__('Background colour', 'maxi-blocks')}
							selected={blockStyleBackground}
							options={[
								{ label: 1, value: 1 },
								{ label: 2, value: 2 },
							]}
							onChange={blockStyleBackground =>
								onChange({
									blockStyleBackground: +blockStyleBackground,
								})
							}
						/>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

export default BlockStylesControl;
