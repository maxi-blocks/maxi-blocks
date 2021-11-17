/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import TextControl from '../text-control';

/**
 * Component
 */
const ImageAltControl = ({ mediaID, altSelector, mediaAlt, onChange }) => {
	const { wpAlt, titleAlt } = useSelect(select => {
		const { getMedia } = select('core');

		const mediaData = getMedia(mediaID) ?? {
			alt_text: { wpAlt: '' },
			title: { rendered: { titleAlt: '' } },
		};

		const {
			alt_text: wpAlt,
			title: { rendered: titleAlt },
		} = mediaData;

		return { wpAlt, titleAlt };
	});

	const getImageAltOptions = () => {
		const response = [
			{
				label: __('WordPress Alt', 'maxi-blocks'),
				value: 'wordpress',
			},
			{
				label: __('Custom', 'maxi-blocks'),
				value: 'custom',
			},
			{
				label: __('None', 'maxi-blocks'),
				value: 'none',
			},
		];

		if (titleAlt)
			response.unshift({
				label: __('Image Title', 'maxi-blocks'),
				value: 'title',
			});

		return response;
	};

	return (
		<>
			<SelectControl
				className='maxi-image-inspector__alt-tag'
				label={__('Image Alt Tag', 'maxi-blocks')}
				value={altSelector}
				options={getImageAltOptions()}
				onChange={altSelector =>
					onChange({
						altSelector,
						...(altSelector === 'wordpress' && {
							mediaAlt: wpAlt,
						}),
						...(altSelector === 'title' && {
							mediaAlt: titleAlt,
						}),
					})
				}
			/>
			{altSelector === 'custom' && (
				<TextControl
					className='maxi-image-inspector__custom-tag'
					placeholder={__('Add Your Alt Tag Here', 'maxi-blocks')}
					value={mediaAlt || ''}
					onChange={mediaAlt =>
						onChange({
							mediaAlt,
						})
					}
				/>
			)}
		</>
	);
};

export default ImageAltControl;
