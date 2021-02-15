import { FancyRadioControl } from '..';

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
						<FancyRadioControl
							label={__('Highlight Text', 'maxi-blocks')}
							selected={+props['text-highlight']}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val =>
								onChange({ 'text-highlight': !!+val })
							}
						/>
					)}
					{!disableHighlightBackground && (
						<FancyRadioControl
							label={__('Highlight Background', 'maxi-blocks')}
							selected={+props['background-highlight']}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val =>
								onChange({ 'background-highlight': !!+val })
							}
						/>
					)}
					{!disableHighlightBorder && (
						<FancyRadioControl
							label={__('Highlight Border', 'maxi-blocks')}
							selected={+props['border-highlight']}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val => {
								onChange({
									'border-highlight': !!+val,
									'border-style-general': 'solid',
									'border-top-width-general': 2,
									'border-right-width-general': 2,
									'border-bottom-width-general': 2,
									'border-left-width-general': 2,
								});
							}}
						/>
					)}
					{!disableHighlightColor1 && (
						<FancyRadioControl
							label={__('Highlight SVG Color 1', 'maxi-blocks')}
							selected={+props['color1-highlight']}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val =>
								onChange({ 'color1-highlight': !!+val })
							}
						/>
					)}
					{!disableHighlightColor2 && (
						<FancyRadioControl
							label={__('Highlight SVG Color 2', 'maxi-blocks')}
							selected={+props['color2-highlight']}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={val =>
								onChange({ 'color2-highlight': !!+val })
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
							onChange={val =>
								onChange({
									blockStyleBackground: +val,
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
