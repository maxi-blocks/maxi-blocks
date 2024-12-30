/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '@components/select-control';
import TextControl from '@components/text-control';

const ButtonControl = ({
	buttonContent,
	buttonContentClose,
	buttonSkin,
	skin,
	onChange,
}) => {
	return (
		<>
			<SelectControl
				__nextHasNoMarginBottom
				className='maxi-search-button-control__skin'
				label={__('Skin', 'maxi-blocks')}
				value={buttonSkin}
				newStyle
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
				onChange={buttonSkin =>
					onChange({
						buttonSkin,
					})
				}
			/>
			{buttonSkin === 'text' && (
				<>
					<TextControl
						label={__('Button text', 'maxi-blocks')}
						value={buttonContent}
						newStyle
						onChange={buttonContent =>
							onChange({
								buttonContent,
							})
						}
					/>
					{skin === 'icon-reveal' && (
						<TextControl
							label={__('Button close text', 'maxi-blocks')}
							value={buttonContentClose}
							newStyle
							onChange={buttonContentClose =>
								onChange({
									buttonContentClose,
								})
							}
						/>
					)}
				</>
			)}
		</>
	);
};

export default ButtonControl;
