/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import InfoBox from '@components/info-box';
import SelectControl from '@components/select-control';
import {
	getWeightLabel,
	getWeightOptions,
} from '@components/typography-control/utils';
import onChangeFontWeight from './utils';

const FontWeightControl = props => {
	const {
		onChange,
		fontName,
		fontStyle,
		fontWeight,
		defaultFontWeight,
		onReset,
		setShowLoader,
	} = props;

	const options = getWeightOptions(fontName);
	const isFontWeightAvailable = options?.some(
		({ value }) => +value === +fontWeight
	);

	if (!isFontWeightAvailable) {
		options?.push({
			label: getWeightLabel(fontWeight),
			value: +fontWeight,
		});
	}

	return (
		<>
			<SelectControl
				__nextHasNoMarginBottom
				label={__('Font weight', 'maxi-blocks')}
				className='maxi-typography-control__weight'
				value={fontWeight}
				defaultValue={defaultFontWeight}
				options={options}
				newStyle
				resetButtonClassName='maxi-reset-button--typography'
				onChange={val => {
					onChange(val);
					onChangeFontWeight(val, fontName, fontStyle, setShowLoader);
				}}
				onReset={() => onReset()}
			/>
			{!isFontWeightAvailable && (
				<InfoBox
					className='maxi-typography-control__weight-warning'
					message={__(
						'Current font weight is not available in the selected font and may not render correctly, please select a different font weight',
						'maxi-blocks'
					)}
				/>
			)}
		</>
	);
};
export default FontWeightControl;
