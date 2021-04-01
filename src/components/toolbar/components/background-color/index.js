/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import { getDefaultAttribute } from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * BackgroundColor
 */
const BackgroundColor = props => {
	const { blockName, onChange } = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi' ||
		blockName === 'maxi-blocks/svg-icon-maxi'
	)
		return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions='background'
			tooltip={__('Background color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background: props['background-color'],
						border: '1px solid #fff',
					}}
				/>
			}
			content={
				<ColorControl
					label={__('Background', 'maxi-blocks')}
					color={props['background-color']}
					defaultColor={getDefaultAttribute('background-color')}
					onChange={val =>
						onChange({
							'background-color': val,
							'background-active-media': 'color',
						})
					}
				/>
			}
		/>
	);
};

export default BackgroundColor;
