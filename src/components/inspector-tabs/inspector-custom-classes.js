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
	const { extraClassName, extraID } = attributes;

	return {
		label: __('Add CSS class/id', 'maxi-blocks'),
		content: (
			<>
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
				<TextControl
					label={__('Add ID', 'maxi-blocks')}
					className='maxi-additional__css-classes'
					value={extraID}
					onChange={extraID =>
						setAttributes({
							extraID,
						})
					}
				/>
			</>
		),
	};
};

export default customClasses;
