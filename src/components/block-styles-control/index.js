import { __experimentalFancyRadioControl } from '..';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { Fragment } = wp.element;

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
						<__experimentalFancyRadioControl
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
						<__experimentalFancyRadioControl
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
						<__experimentalFancyRadioControl
							label={__('Highlight Border', 'maxi-blocks')}
							selected={isHighlightBorder}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={isHighlightBorder =>
								onChange({
									isHighlightBorder: +isHighlightBorder,
								})
							}
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
						<__experimentalFancyRadioControl
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
