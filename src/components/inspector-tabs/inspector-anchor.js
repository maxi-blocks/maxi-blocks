/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';

/**
 * Component
 */
const anchor = ({ props }) => {
	const { attributes, handleSetAttributes } = props;
	const { anchorLink } = attributes;

	const validateAnchor = text => {
		const regex = new RegExp('^[a-zA-Z0-9-_]+$');
		if (!regex.test(text)) {
			return text.replace(/[^a-zA-Z0-9-_]/g, '');
		}
		return text;
	};

	return {
		label: __('Add Anchor Link', 'maxi-blocks'),
		content: (
			<TextControl
				label={__('Add anchor', 'maxi-blocks')}
				className='maxi-anchor-link'
				value={anchorLink}
				onChange={anchorLink => {
					const link = validateAnchor(anchorLink);
					handleSetAttributes({
						anchorLink: link,
					});
				}}
				validationText={
					__('Add an anchor link to the element. ', 'maxi-blocks') +
					__('Possible characters: ', 'maxi-blocks') +
					__('0-9, A-Z, a-z, _ , -', 'maxi-blocks')
				}
			/>
		),
		extraIndicators: ['anchorLink'],
	};
};

export default anchor;
