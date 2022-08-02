/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectControl, TextControl } from '../../../../components';

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
				className='maxi-search-button-control__skin'
				label={__('Skin', 'maxi-blocks')}
				value={buttonSkin}
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
