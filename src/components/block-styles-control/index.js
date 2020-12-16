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
import { isObject, isNil } from 'lodash';

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
		highlight,
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

	const borderValue =
		!isNil(border) && !isObject(border) ? JSON.parse(border) : border;
	const highlightValue = !isObject(highlight)
		? JSON.parse(highlight)
		: highlight;

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
							selected={highlightValue.textHighlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlightValue.textHighlight = Number(val);
								onChange(JSON.stringify(highlightValue));
							}}
						/>
					)}
					{!disableHighlightBackground && (
						<FancyRadioControl
							label={__('Highlight Background', 'maxi-blocks')}
							selected={highlightValue.backgroundHighlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlightValue.backgroundHighlight = Number(
									val
								);
								onChange(JSON.stringify(highlightValue));
							}}
						/>
					)}
					{!disableHighlightBorder && (
						<FancyRadioControl
							label={__('Highlight Border', 'maxi-blocks')}
							selected={highlightValue.borderHighlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlightValue.borderHighlight = Number(val);
								onChange(JSON.stringify(highlightValue));

								if (!isNil(borderValue)) {
									borderValue.general['border-style'] =
										'solid';
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
								}
							}}
						/>
					)}
					{!disableHighlightColor1 && (
						<FancyRadioControl
							label={__('Highlight SVG Color 1', 'maxi-blocks')}
							selected={highlightValue.color1Highlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlightValue.color1Highlight = Number(val);
								onChange(JSON.stringify(highlightValue));
							}}
						/>
					)}
					{!disableHighlightColor2 && (
						<FancyRadioControl
							label={__('Highlight SVG Color 2', 'maxi-blocks')}
							selected={highlightValue.color2Highlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlightValue.color2Highlight = Number(val);
								onChange(JSON.stringify(highlightValue));
							}}
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
