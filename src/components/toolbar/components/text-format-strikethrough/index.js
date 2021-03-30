/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;
const { useState, useEffect } = wp.element;

/**
 * Internal dependencies
 */
import {
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * External dependencies
 */
import { trim } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarStrikethrough } from '../../../../icons';

/**
 * TextFormatStrikethrough
 */
const TextFormatStrikethrough = props => {
	const { formatValue, onChange, isList, breakpoint } = props;

	const getTextDecorationValue = () => {
		return (
			getCustomFormatValue({
				typography: { ...getGroupAttributes(props, 'typography') },
				formatValue,
				prop: 'text-decoration',
				breakpoint,
			}) || ''
		);
	};

	const textDecorationValue = getTextDecorationValue();

	const [isActive, setIsActive] = useState(
		textDecorationValue.indexOf('line-through') >= 0
	);

	useEffect(() => {
		const textDecorationValue = getTextDecorationValue();

		setIsActive(textDecorationValue.indexOf('line-through') >= 0);
	});

	const onClick = () => {
		const textDecorationValue = getTextDecorationValue();

		let response;

		if (textDecorationValue === 'none') response = 'overline';
		else
			response =
				textDecorationValue.indexOf('overline') >= 0
					? textDecorationValue.replace('overline', '')
					: `${textDecorationValue} overline`;

		response = trim(response);

		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value: {
				'text-decoration': response,
			},
			breakpoint,
		});

		setIsActive(!isActive);

		onChange(obj);
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
				<Icon
					className='toolbar-item__icon'
					icon={toolbarStrikethrough}
				/>
			</Button>
		</Tooltip>
	);
};

export default TextFormatStrikethrough;
