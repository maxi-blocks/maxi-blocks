/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useSelect } = wp.data;
const { Icon, Button, Tooltip } = wp.components;
const { toggleFormat, create, toHTMLString, getActiveFormat } = wp.richText;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarItalic } from '../../../../icons';

/**
 * TextItalic
 */
const TextItalic = props => {
	const { blockName, content, onChange, node, isList, typeOfList } = props;

	const formatName = 'core/italic';

	const formatElement = {
		element: node,
		html: content,
		multilineTag: isList ? 'li' : undefined,
		multilineWrapperTags: isList ? typeOfList : undefined,
		__unstableIsEditableTree: true,
	};

	const { formatValue, isActive } = useSelect(
		select => {
			const { getSelectionStart, getSelectionEnd } = select(
				'core/block-editor'
			);

			const formatValue = create(formatElement);
			formatValue.start = getSelectionStart().offset;
			formatValue.end = getSelectionEnd().offset;

			const activeFormat = getActiveFormat(formatValue, formatName);
			const isActive =
				(!isNil(activeFormat) && activeFormat.type === formatName) ||
				false;

			return {
				formatValue,
				isActive,
			};
		},
		[getActiveFormat, formatElement]
	);

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const onClick = () => {
		const newFormat = toggleFormat(formatValue, {
			type: formatName,
			isActive,
		});

		const newContent = toHTMLString({
			value: newFormat,
			multilineTag: isList ? 'li' : null,
		});

		onChange(newContent);
	};

	return (
		<Tooltip text={__('Italic', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__italic'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarItalic} />
			</Button>
		</Tooltip>
	);
};

export default TextItalic;
