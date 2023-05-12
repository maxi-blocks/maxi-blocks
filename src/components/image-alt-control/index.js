/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import TextControl from '../text-control';

/**
 * Component
 */
const ImageAltControl = ({
	mediaID,
	altSelector,
	mediaAlt,
	onChange,
	dcStatus,
}) => {
	const { wpAlt, titleAlt } = useSelect(
		select => {
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
		},
		[mediaID]
	);

	const getImageAltOptions = () => {
		if (dcStatus)
			return [
				{
					label: __('Dynamic content', 'maxi-blocks'),
					value: 'custom',
				},
				{
					label: __('None', 'maxi-blocks'),
					value: 'none',
				},
			];

		const response = [
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
				label: __('Image title', 'maxi-blocks'),
				value: 'title',
			});

		if (wpAlt)
			response.unshift({
				label: __('WordPress alt', 'maxi-blocks'),
				value: 'wordpress',
			});

		return response;
	};

	useEffect(() => {
		if (typeof altSelector === 'undefined' && titleAlt)
			onChange({
				_as: 'title',
				_mal: titleAlt,
			});
	}, []);

	return (
		<>
			<SelectControl
				className='maxi-image-inspector__alt-tag'
				label={__('Image alt tag', 'maxi-blocks')}
				value={altSelector}
				options={getImageAltOptions()}
				onChange={altSelector =>
					onChange({
						_as: altSelector,
						...(altSelector === 'wordpress' && {
							_mal: wpAlt,
						}),
						...(altSelector === 'title' && {
							_mal: titleAlt,
						}),
						...(altSelector === 'none' && { _mal: null }),
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
							_mal: mediaAlt,
						})
					}
				/>
			)}
		</>
	);
};

export default ImageAltControl;
