/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarBold } from '../../../../icons';

/**
 * TextList
 */
const TextList = props => {
	const { blockName, isList, content, onChange } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const getContent = content => {
		let newContent = '';
		if (isList) {
			newContent = content
				.replace(/<li>/gi, '')
				.replace(/<\/li>(?=.*<\/li>)/gi, '<br>')
				.replace(/<\/li>/gi, '');
		}

		if (!isList)
			newContent = `<li>${content.replace(/<br>/gi, '</li><li>')}</li>`;

		return newContent;
	};

	return (
		<Tooltip text={__('List', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__list'
				onClick={() => onChange(!isList, getContent(content))}
				aria-pressed={isList}
			>
				<Icon className='toolbar-item__icon' icon={toolbarBold} />
			</Button>
		</Tooltip>
	);
};

export default TextList;
