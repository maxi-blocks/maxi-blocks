/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Internal dependencies
 */
import TextareaControl from '../textarea-control';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * Component
 */
const customCss = ({ props, breakpoint = 'general' }) => {
	const { attributes, setAttributes } = props;
	const { customCssSelectors } = attributes;
	const customCss = attributes['custom-css-general'];

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<>
				{/* <ResponsiveTabsControl
					className='maxi-typography-control__text-options-tabs'
					breakpoint={breakpoint}
				> */}
				{customCssSelectors.map((element, index) => {
					let label = element;
					if (isEmpty(element)) label = ' main block';
					if (element === ':hover') label = ' main block hover';
					return (
						<TextareaControl
							key={`${label}`}
							label={`${__(
								'Custom CSS for',
								'maxi-blocks'
							)} ${label}`}
							className='maxi-additional__css'
							value={customCss[index]}
							onChange={val => {
								const newCustomCss = cloneDeep(customCss);
								newCustomCss[index] = val;
								setAttributes({
									'custom-css-general': newCustomCss,
								});
							}}
						/>
					);
				})}
				{/* </ResponsiveTabsControl> */}
			</>
		),
	};
};

export default customCss;
