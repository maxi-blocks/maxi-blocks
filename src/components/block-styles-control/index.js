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
import { isNil } from 'lodash';

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
		disableHighlightText = false,
		disableHighlightBackground = false,
		disableHighlightBorder = false,
		disableHighlightColor1 = false,
		disableHighlightColor2 = false,
		onChangeBorder,
	} = props;
	const border = { ...props.border };
	const highlight = { ...props.highlight };

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
							selected={highlight.textHighlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlight.textHighlight = Number(val);
								onChange(highlight);
							}}
						/>
					)}
					{!disableHighlightBackground && (
						<FancyRadioControl
							label={__('Highlight Background', 'maxi-blocks')}
							selected={highlight.backgroundHighlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlight.backgroundHighlight = Number(val);
								onChange(highlight);
							}}
						/>
					)}
					{!disableHighlightBorder && (
						<FancyRadioControl
							label={__('Highlight Border', 'maxi-blocks')}
							selected={highlight.borderHighlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlight.borderHighlight = Number(val);
								onChange(highlight);

								if (!isNil(border)) {
									border.general['border-style'] = 'solid';
									border.borderWidth.general[
										'border-right-width'
									] = 2;
									border.borderWidth.general[
										'border-left-width'
									] = 2;
									border.borderWidth.general[
										'border-top-width'
									] = 2;
									border.borderWidth.general[
										'border-bottom-width'
									] = 2;

									onChangeBorder(border);
								}
							}}
						/>
					)}
					{!disableHighlightColor1 && (
						<FancyRadioControl
							label={__('Highlight SVG Color 1', 'maxi-blocks')}
							selected={highlight.color1Highlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlight.color1Highlight = Number(val);
								onChange(highlight);
							}}
						/>
					)}
					{!disableHighlightColor2 && (
						<FancyRadioControl
							label={__('Highlight SVG Color 2', 'maxi-blocks')}
							selected={highlight.color2Highlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								highlight.color2Highlight = Number(val);
								onChange(highlight);
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
