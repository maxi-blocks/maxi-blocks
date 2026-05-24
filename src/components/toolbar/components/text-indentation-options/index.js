/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';
import {
	canIndentListItem,
	canOutdentListItem,
	LIST_ITEM_BLOCK,
	useIndentListItem,
	useOutdentListItem,
} from '@extensions/text/lists';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarIndentList, toolbarOutdentList } from '@maxi-icons';

const IndentationButton = ({
	icon,
	label,
	onClick,
	tooltipsHide,
	className,
}) => {
	const content = (
		<div className='toolbar-item'>
			<Button
				className={`toolbar-item toolbar-item__button ${className}`}
				onClick={onClick}
			>
				<Icon className='toolbar-item__icon' icon={icon} />
			</Button>
		</div>
	);

	if (tooltipsHide) return content;

	return (
		<Tooltip text={label} placement='top'>
			{content}
		</Tooltip>
	);
};

const TextIndentationOptions = ({ blockName, clientId, tooltipsHide }) => {
	const indentListItem = useIndentListItem(clientId);
	const outdentListItem = useOutdentListItem();
	const { canIndent, canOutdent } = useSelect(
		select => {
			if (blockName !== LIST_ITEM_BLOCK)
				return { canIndent: false, canOutdent: false };

			const selectors = select('core/block-editor');

			return {
				canIndent: canIndentListItem(selectors, clientId),
				canOutdent: canOutdentListItem(selectors, clientId),
			};
		},
		[blockName, clientId]
	);

	if (blockName !== LIST_ITEM_BLOCK) return null;

	return (
		<>
			{canOutdent && (
				<IndentationButton
					className='toolbar-item__list-outdent-option'
					icon={toolbarOutdentList}
					label={__('Outdent', 'maxi-blocks')}
					onClick={() => outdentListItem(clientId)}
					tooltipsHide={tooltipsHide}
				/>
			)}
			{canIndent && (
				<IndentationButton
					className='toolbar-item__list-indent-option'
					icon={toolbarIndentList}
					label={__('Indent', 'maxi-blocks')}
					onClick={indentListItem}
					tooltipsHide={tooltipsHide}
				/>
			)}
		</>
	);
};

export default TextIndentationOptions;
