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
const customCss = ({ props }) => {
	const { attributes, setAttributes } = props;
	const { extraClassName } = attributes;

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<TextControl
				label={__('Add CSS classes', 'maxi-blocks')}
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

export default customCss;
