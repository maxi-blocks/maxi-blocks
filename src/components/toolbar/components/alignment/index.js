/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AlignmentControl from '../../../alignment-control';
import { getGroupAttributes } from '../../../../extensions/styles';
import Button from '../../../button';
import Icon from '../../../icon';
import Dropdown from '../../../dropdown';

/**
 * Styles & Icons
 */
import './editor.scss';
import { alignCenter } from '../../../../icons';

/**
 * Alignment
 */
const ALLOWED_BLOCKS = [
	'maxi-blocks/button-maxi',
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/image-maxi',
];

const TEXT_BLOCKS = ['maxi-blocks/text-maxi'];

const Alignment = props => {
	const { blockName, onChange, breakpoint, isCaptionToolbar = false } = props;

	if (!ALLOWED_BLOCKS.includes(blockName) && !isCaptionToolbar) return null;

	const isText = TEXT_BLOCKS.includes(blockName) || isCaptionToolbar;

	return (
		<Dropdown
			className='toolbar-item__alignment'
			contentClassName='maxi-dropdown__child-content maxi-dropdown__alignment-content'
			position='bottom right'
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} text='Copy'>
					{isText ? (
						<Icon
							className='toolbar-item__icon toolbar-item__icon__alignment'
							icon={alignCenter}
						/>
					) : (
						<>{__('Align', 'maxi-blocks')}</>
					)}
				</Button>
			)}
			renderContent={() => (
				<AlignmentControl
					{...getGroupAttributes(
						props,
						isText ? 'textAlignment' : 'alignment'
					)}
					onChange={onChange}
					disableJustify={!isText}
					disableIcon
					disableRTC
					breakpoint={breakpoint}
					type={isText && 'text'}
				/>
			)}
		/>
	);
};

export default Alignment;
