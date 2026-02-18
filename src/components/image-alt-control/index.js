/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SelectControl from '@components/select-control';
import TextControl from '@components/text-control';

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
			const { getEntityRecord } = select('core');

			const mediaData = mediaID
				? getEntityRecord('postType', 'attachment', mediaID)
				: null;
			const wpAlt = mediaData?.alt_text ?? '';
			const titleAlt = mediaData?.title?.rendered ?? '';

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
				altSelector: 'title',
				mediaAlt: titleAlt,
			});
	}, []);

	return (
		<>
			<SelectControl
				__nextHasNoMarginBottom
				className='maxi-image-inspector__alt-tag'
				label={__('Image alt tag', 'maxi-blocks')}
				value={altSelector}
				options={getImageAltOptions()}
				newStyle
				onChange={altSelector =>
					onChange({
						altSelector,
						...(altSelector === 'wordpress' && {
							mediaAlt: wpAlt,
						}),
						...(altSelector === 'title' && {
							mediaAlt: titleAlt,
						}),
						...(altSelector === 'none' && { mediaAlt: null }),
					})
				}
			/>
			{altSelector === 'custom' && (
				<TextControl
					className='maxi-image-inspector__custom-tag'
					placeholder={__('Add Your Alt Tag Here', 'maxi-blocks')}
					value={mediaAlt || ''}
					newStyle
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
