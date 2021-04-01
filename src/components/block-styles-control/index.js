import { FancyRadioControl } from '..';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
const { SelectControl } = wp.components;
const { Fragment } = wp.element;

/**
 * Component
 */
const BlockStylesControl = props => {
	const {
		blockStyle,
		blockStyleBackground,
		onChange,
		isFirstOnHierarchy,
		disableHighlightText = false,
		disableHighlightBackground = false,
		disableHighlightBorder = false,
		disableHighlightColor1 = false,
		disableHighlightColor2 = false,
		disableBlockStyleBackground = false,
	} = props;

	const getSelectorOptions = () => {
		if (isFirstOnHierarchy)
			return [
				{ label: __('Dark', 'maxi-blocks'), value: 'maxi-dark' },
				{ label: __('Light', 'maxi-blocks'), value: 'maxi-light' },
			];
		return [{ label: __('Parent', 'maxi-blocks'), value: 'maxi-parent' }];
	};

	return (
		<Fragment>
			<SelectControl
				label={__('Block Style', 'maxi-blocks')}
				value={blockStyle}
				options={getSelectorOptions()}
				onChange={blockStyle => onChange({ blockStyle })}
			/>
			<Fragment>
				{!disableHighlightText && (
					<FancyRadioControl
						label={__('Highlight Text', 'maxi-blocks')}
						selected={props['text-highlight']}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => onChange({ 'text-highlight': val })}
					/>
				)}
				{!disableHighlightBackground && (
					<FancyRadioControl
						label={__('Highlight Background', 'maxi-blocks')}
						selected={props['background-highlight']}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val =>
							onChange({ 'background-highlight': val })
						}
					/>
				)}
				{!disableHighlightBorder && (
					<FancyRadioControl
						label={__('Highlight Border', 'maxi-blocks')}
						selected={props['border-highlight']}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => onChange({ 'border-highlight': val })}
					/>
				)}
				{!disableHighlightColor1 && (
					<FancyRadioControl
						label={__('Highlight SVG Color 1', 'maxi-blocks')}
						selected={props['color1-highlight']}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => onChange({ 'color1-highlight': val })}
					/>
				)}
				{!disableHighlightColor2 && (
					<FancyRadioControl
						label={__('Highlight SVG Color 2', 'maxi-blocks')}
						selected={props['color2-highlight']}
						options={[
							{ label: __('Yes', 'maxi-blocks'), value: 1 },
							{ label: __('No', 'maxi-blocks'), value: 0 },
						]}
						onChange={val => onChange({ 'color2-highlight': val })}
					/>
				)}
				{isFirstOnHierarchy && !disableBlockStyleBackground && (
					<FancyRadioControl
						label={__('Background colour', 'maxi-blocks')}
						selected={blockStyleBackground}
						optionType='number'
						options={[
							{ label: 1, value: 1 },
							{ label: 2, value: 2 },
						]}
						onChange={val =>
							onChange({ blockStyleBackground: val })
						}
					/>
				)}
			</Fragment>
		</Fragment>
	);
};

export default BlockStylesControl;
