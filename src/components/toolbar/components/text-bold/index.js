/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { Icon, Button, Tooltip } = wp.components;
const { useState, useEffect } = wp.element;

/**
 * Internal dependencies
 */
import {
	getCustomFormatValue,
	setFormat,
	withFormatValue,
} from '../../../../extensions/text/formats';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarBold } from '../../../../icons';

/**
 * TextBold
 */
const TextBold = withFormatValue(props => {
	const { blockName, onChange, isList, breakpoint, formatValue } = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const getBoldValue = () =>
		getCustomFormatValue({
			typography: { ...getGroupAttributes(props, 'typography') },
			formatValue,
			prop: 'font-weight',
			breakpoint,
		});

	const boldValue = getBoldValue();

	const [isActive, setIsActive] = useState(
		(boldValue > 400 && true) || false
	);

	useEffect(() => {
		const boldValue = getBoldValue();

		setIsActive((boldValue > 400 && true) || false);
	});

	const onClick = () => {
		const boldValue = getBoldValue();

		const obj = setFormat({
			formatValue,
			isActive: (boldValue > 400 && true) || false,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value: {
				'font-weight': (isActive && 400) || 800,
			},
			breakpoint,
		});

		setIsActive(!isActive);

		onChange(obj);
	};

	return (
		<Tooltip text={__('Bold', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__bold'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarBold} />
			</Button>
		</Tooltip>
	);
});

export default TextBold;
