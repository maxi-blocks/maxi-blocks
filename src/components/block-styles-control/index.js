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
		isHighlight,
		blockStyleBackground,
		onChange,
		isFirstOnHierarchy,
		disableHighlight = false,
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
					{!disableHighlight && (
						<FancyRadioControl
							label={__('Highlight', 'maxi-blocks')}
							selected={isHighlight}
							options={[
								{ label: __('Yes', 'maxi-blocks'), value: 1 },
								{ label: __('No', 'maxi-blocks'), value: 0 },
							]}
							onChange={isHighlight =>
								onChange({ isHighlight: +isHighlight })
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
