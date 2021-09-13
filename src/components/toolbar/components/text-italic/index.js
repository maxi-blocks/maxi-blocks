/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import { getGroupAttributes } from '../../../../extensions/styles';
import {
	getCustomFormatValue,
	setFormat,
	withFormatValue,
} from '../../../../extensions/text/formats';

/**
 * Styles and icons
 */

import './editor.scss';
import { toolbarItalic } from '../../../../icons';

/**
 * TextItalic
 */
const TextItalic = withFormatValue(props => {
	const {
		blockName,
		formatValue,
		onChange,
		isList,
		breakpoint,
		textLevel,
		styleCard,
		isCaptionToolbar = false,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	const getItalicValue = () =>
		getCustomFormatValue({
			typography: { ...getGroupAttributes(props, 'typography') },
			formatValue,
			prop: 'font-style',
			breakpoint,
			textLevel,
			styleCard,
		});

	const italicValue = getItalicValue();

	const [isActive, setIsActive] = useState(
		(italicValue === 'italic' && true) || false
	);

	useEffect(() => {
		const italicValue = getItalicValue();

		setIsActive((italicValue === 'italic' && true) || false);
	});

	const onClick = () => {
		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value: {
				'font-style': isActive ? 'normal' : 'italic',
			},
			breakpoint,
			textLevel,
		});

		setIsActive(!isActive);

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
});

export default TextItalic;
