/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TextControl from '@components/text-control';

/**
 * Component
 */
const anchor = ({ props }) => {
	const { attributes, maxiSetAttributes } = props;
	const { anchorLink } = attributes;

	const validateAnchor = text => {
		const regex = /^[a-zA-Z0-9-_]+$/;
		if (!regex.test(text)) {
			return text.replace(/[^a-zA-Z0-9-_]/g, '');
		}
		return text;
	};

	return {
		label: __('Add anchor link', 'maxi-blocks'),
		content: (
			<TextControl
				isFullwidth
				label={__(
					'Create anchor link ID for this block',
					'maxi-blocks'
				)}
				className='maxi-anchor-link'
				placeholder={__(
					'Allowed chars: 0-9, A-Z, a-z, _ , -',
					'maxi-blocks'
				)}
				value={anchorLink}
				onChange={anchorLink => {
					const link = validateAnchor(anchorLink);
					maxiSetAttributes({
						anchorLink: link,
					});
				}}
			/>
		),
		extraIndicators: ['anchorLink'],
	};
};

export default anchor;
