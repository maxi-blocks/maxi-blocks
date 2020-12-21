/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import TextShadowControl from '../../../text-shadow-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import './editor.scss';
import { toolbarDropShadow } from '../../../../icons';

/**
 * TextShadow
 */
const TextShadow = props => {
	const { blockName, onChange } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...props.typography };

	return (
		<ToolbarPopover
			className='toolbar-item__box-shadow'
			tooltip={__('Text shadow', 'maxi-blocks')}
			icon={toolbarDropShadow}
			content={
				<TextShadowControl
					boxShadowOptions={typography.desktop['text-shadow']}
					onChange={boxShadow => {
						typography.desktop['text-shadow'] = boxShadow;
						onChange(typography);
					}}
				/>
			}
		/>
	);
};

export default TextShadow;
