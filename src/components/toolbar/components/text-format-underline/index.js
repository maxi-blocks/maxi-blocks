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
import { toolbarUnderline } from '../../../../icons';

/**
 * TextFormatUnderline
 */
const TextFormatUnderline = props => {
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
		textDecorationValue.indexOf('overline') >= 0
	);

	useEffect(() => {
		const textDecorationValue = getTextDecorationValue();

		setIsActive(textDecorationValue.indexOf('underline') >= 0);
	});

	const onClick = () => {
		const textDecorationValue = getTextDecorationValue();

		let response;

		if (textDecorationValue === 'none') response = 'underline';
		else
			response =
				textDecorationValue.indexOf('underline') >= 0
					? textDecorationValue.replace('underline', '')
					: `${textDecorationValue} underline`;

		response = trim(response);

		const obj = setFormat({
			formatValue,
			isActive: textDecorationValue.indexOf('underline') >= 0,
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
		<Tooltip text={__('Underline', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__underline'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarUnderline} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatUnderline;
