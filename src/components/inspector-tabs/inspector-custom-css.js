/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Internal dependencies
 */
import TextareaControl from '../textarea-control';

/**
 * Component
 */
const customCss = ({ props }) => {
	const { attributes, setAttributes } = props;
	const { customCss, customCssSelectors } = attributes;

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<>
				{customCssSelectors.map((element, index) => {
					return (
						<TextareaControl
							key={`${element}`}
							label={`${__(
								'Custom CSS for',
								'maxi-blocks'
							)} ${element}`}
							className='maxi-additional__css'
							value={customCss[index]}
							onChange={val => {
								const newCustomCss = cloneDeep(customCss);
								newCustomCss[index] = val;
								setAttributes({
									customCss: newCustomCss,
								});
							}}
						/>
					);
				})}
			</>
		),
	};
};

export default customCss;
