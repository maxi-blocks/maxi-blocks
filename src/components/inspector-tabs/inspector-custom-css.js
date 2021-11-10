/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';
import CodeEditor from '@uiw/react-textarea-code-editor';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
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
						<BaseControl
							key={`${label}`}
							label={`${__(
								'Custom CSS for',
								'maxi-blocks'
							)} ${label}`}
							className='maxi-additional__css'
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
								style={{
									backgroundColor: '#f5f5f5',
									fontFamily:
										'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
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
