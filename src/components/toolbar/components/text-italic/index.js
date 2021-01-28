/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import {
	getCustomFormatValue,
	setFormat,
} from '../../../../extensions/text/formats';
import getGroupAttributes from '../../../../extensions/styles/getGroupAttributes';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarItalic } from '../../../../icons';

/**
 * TextItalic
 */
const TextItalic = props => {
	const { blockName, formatValue, onChange, isList, breakpoint } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...getGroupAttributes(props, 'typography') };

	const italicValue = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'font-style',
		breakpoint,
	});

	const isActive = (italicValue === 'italic' && true) || false;

	const onClick = () => {
		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography,
			value: {
				'font-style': isActive ? '' : 'italic',
			},
			breakpoint,
		});

		onChange(obj);
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
