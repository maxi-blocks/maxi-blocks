/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FontLevelControl from '@components/font-level-control';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	toolbarH1,
	toolbarH2,
	toolbarH3,
	toolbarH4,
	toolbarH5,
	toolbarH6,
	toolbarP,
} from '@maxi-icons';

/**
 * TextLevel
 */
const TextLevel = props => {
	const { blockName, textLevel, isList, onChange } = props;

	if (blockName !== 'maxi-blocks/text-maxi' || isList) return null;

	const levelIcon = textLevel => {
		switch (textLevel) {
			case 'h1':
				return toolbarH1;
			case 'h2':
				return toolbarH2;
			case 'h3':
				return toolbarH3;
			case 'h4':
				return toolbarH4;
			case 'h5':
				return toolbarH5;
			case 'h6':
				return toolbarH6;
			case 'p':
				return toolbarP;
			default:
				return toolbarP;
		}
	};

	return (
		<ToolbarPopover
			className='toolbar-item__text-level'
			tooltip={__('Text level', 'maxi-blocks')}
			icon={levelIcon(textLevel)}
		>
			<FontLevelControl
				{...getGroupAttributes(props, [
					'typography',
					'typographyHover',
				])}
				value={textLevel}
				onChange={onChange}
			/>
		</ToolbarPopover>
	);
};

export default TextLevel;
