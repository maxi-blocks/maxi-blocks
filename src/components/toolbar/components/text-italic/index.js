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

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarItalic } from '../../../../icons';

/**
 * TextItalic
 */
const TextItalic = ({
	blockName,
	typography,
	formatValue,
	onChange,
	isList,
	breakpoint,
}) => {
	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typographyValue =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const italicValue = getCustomFormatValue({
		typography: typographyValue,
		formatValue,
		prop: 'font-style',
		breakpoint,
	});

	const isActive = (italicValue === 'italic' && true) || false;

	const onClick = () => {
		const { typography: newTypography, content: newContent } = setFormat({
			formatValue,
			isActive,
			isList,
			typography: typographyValue,
			value: {
				'font-style': isActive ? '' : 'italic',
			},
			breakpoint,
		});

		onChange({
			typography: JSON.stringify(newTypography),
			...(newContent && { content: newContent }),
		});
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
