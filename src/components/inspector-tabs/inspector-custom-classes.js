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
const customClasses = ({ props }) => {
	const { attributes, setAttributes } = props;
	const { extraClassName } = attributes;

	return {
		label: __('Add CSS classes', 'maxi-blocks'),
		content: (
			<TextControl
				ifFullwidth
				label={__(
					'Attach custom CSS classes to target this element',
					'maxi-blocks'
				)}
				className='maxi-additional__css-classes'
				value={extraClassName}
				onChange={extraClassName =>
					setAttributes({
						extraClassName,
					})
				}
			/>
		),
	};
};

export default customClasses;
