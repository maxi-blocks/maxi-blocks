/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, capitalize } from 'lodash';
import CodeEditor from '@uiw/react-textarea-code-editor';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import SelectControl from '../select-control';
import ResponsiveTabsControl from '../responsive-tabs-control';

/**
 * Component
 */
const customCss = ({ props, breakpoint = 'general' }) => {
	const { attributes, setAttributes } = props;
	const { customCssSelectors } = attributes;
	const customCss = attributes['custom-css-general'];
	const customCssCategory = attributes['custom-css-category'];

	// TODO: switch it based on the block
	const customCssCategories = [
		'canvas',
		'button',
		'before',
		'after',
		'background',
		'text',
		'icon',
	];

	const getOptions = () => {
		const options = [
			{
				label: 'None',
				value: 'none',
			},
		];
		customCssCategories.forEach(category => {
			options.push({
				label: capitalize(category),
				value: category,
			});
		});
		return options;
	};

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<>
				{/* <ResponsiveTabsControl
					className='maxi-typography-control__text-options-tabs'
					breakpoint={breakpoint}
				> */}
				<SelectControl
					label={__('Choose custom CSS', 'maxi-blocks')}
					className='maxi-custom-css-control__category'
					value={customCssCategory || 'none'}
					options={getOptions()}
					onChange={val => {
						setAttributes({
							'custom-css-category': val,
						});
					}}
				/>
				{customCssSelectors.map((element, index) => {
					let label = element;
					if (isEmpty(element)) label = ' canvas';
					if (element === ':hover') label = ' canvas hover';
					return (
						<BaseControl
							key={`${label}`}
							label={`${__(
								'Custom CSS for',
								'maxi-blocks'
							)} ${label}`}
							className='maxi-additional__css'
							hidden={!!customCssCategory?.includes(label)}
						>
							<CodeEditor
								language='css'
								placeholder='Please enter CSS code.'
								value={customCss[index]}
								onChange={evn => {
									const newCustomCss = cloneDeep(customCss);
									newCustomCss[index] = evn.target.value;
									setAttributes({
										'custom-css-general': newCustomCss,
									});
								}}
							/>
						</BaseControl>
					);
				})}
				{/* </ResponsiveTabsControl> */}
			</>
		),
	};
};

export default customCss;
