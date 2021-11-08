/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TextareaControl from '../textarea-control';

/**
 * Component
 */
const customCss = ({ props }) => {
	const { attributes, setAttributes } = props;
	const { extraClassName } = attributes;

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<TextareaControl
				label={__('Add CSS classes', 'maxi-blocks')}
				className='maxi-additional__css'
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
