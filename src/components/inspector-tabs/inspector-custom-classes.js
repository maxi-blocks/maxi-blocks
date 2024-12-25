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
const customClasses = ({ props }) => {
	const { attributes, maxiSetAttributes } = props;
	const { extraClassName } = attributes;

	return {
		label: __('Add CSS classes', 'maxi-blocks'),
		content: (
			<TextControl
				isFullwidth
				label={__(
					'Input CSS classes to target this block',
					'maxi-blocks'
				)}
				placeholder={__(
					'Separate multiple classes with spaces',
					'maxi-blocks'
				)}
				className='maxi-additional__css-classes'
				value={extraClassName}
				onChange={extraClassName =>
					maxiSetAttributes({
						extraClassName,
					})
				}
			/>
		),
		extraIndicators: ['extraClassName'],
	};
};

export default customClasses;
