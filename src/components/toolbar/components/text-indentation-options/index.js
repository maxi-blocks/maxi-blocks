/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import {
	useIndentListItem,
	useOutdentListItem,
} from '../../../../extensions/text/lists';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarIndentList, toolbarOutdentList } from '../../../../icons';

const IndentationItem = ({
	className,
	icon,
	tooltipText,
	tooltipsHide,
	onClick,
}) => {
	const classes = classnames(
		'toolbar-item',
		'toolbar-item__list-indentation-option',
		className
	);

	const content = (
		<div className='toolbar-item'>
			<Button className={classes} onClick={onClick}>
				<Icon className='toolbar-item__icon' icon={icon} />
			</Button>
		</div>
	);

	return tooltipsHide ? (
		content
	) : (
		<Tooltip text={tooltipText} placement='top'>
			{content}
		</Tooltip>
	);
};

const TextIndentationOptions = props => {
	const { blockName, clientId, tooltipsHide } = props;

	if (blockName !== 'maxi-blocks/list-item-maxi') return null;

	const indentListItem = useIndentListItem(clientId);
	const outdentListItem = useOutdentListItem();
	const { canIndent, canOutdent } = useSelect(
		select => {
			const { getBlockIndex, getBlockRootClientId, getBlockName } =
				select('core/block-editor');
			return {
				canIndent: getBlockIndex(clientId) > 0,
				canOutdent:
					getBlockName(
						getBlockRootClientId(getBlockRootClientId(clientId))
					) === 'maxi-blocks/list-item-maxi',
			};
		},
		[clientId]
	);

	return (
		<>
			{canOutdent && (
				<IndentationItem
					className='toolbar-item__list-outdent-option'
					icon={toolbarOutdentList}
					tooltipText={__('Outdent', 'maxi-blocks')}
					tooltipsHide={tooltipsHide}
					onClick={outdentListItem}
				/>
			)}
			{canIndent && (
				<IndentationItem
					className='toolbar-item__list-indent-option'
					icon={toolbarIndentList}
					tooltipText={__('Indent', 'maxi-blocks')}
					tooltipsHide={tooltipsHide}
					onClick={indentListItem}
				/>
			)}
		</>
	);
};

export default TextIndentationOptions;
