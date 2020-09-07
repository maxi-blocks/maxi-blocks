/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useSelect } = wp.data;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import {
	getFormatSettings,
	getFormattedString,
} from '../../../../extensions/text/formats';
/**
 * Styles and icons
 */
import { toolbarItalic } from '../../../../icons';

/**
 * TextFormatStrikethrough
 */
const TextFormatStrikethrough = props => {
	const { content, onChange, node, isList, typeOfList } = props;

	const formatName = 'core/strikethrough';

	const formatElement = {
		element: node,
		html: content,
		multilineTag: isList ? 'li' : undefined,
		multilineWrapperTags: isList ? typeOfList : undefined,
		__unstableIsEditableTree: true,
	};

	const { formatValue, isActive } = useSelect(() => {
		const { formatValue, isActive } = getFormatSettings(
			formatElement,
			formatName
		);

		return {
			formatValue,
			isActive,
		};
	}, [getFormatSettings, formatElement, formatName]);

	const onClick = () => {
		const newContent = getFormattedString({
			formatValue,
			formatName,
			isActive,
			isList,
		});

		onChange(newContent);
	};

	return (
		<Tooltip
			text={__('Strikethrough', 'maxi-blocks')}
			position='bottom center'
		>
			<Button
				className='toolbar-item toolbar-item__strikethrough'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarItalic} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatStrikethrough;
