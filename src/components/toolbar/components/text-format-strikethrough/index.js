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
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';

/**
 * External dependencies
 */
import { trim, isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarStrikethrough } from '../../../../icons';

/**
 * TextFormatStrikethrough
 */
const TextFormatStrikethrough = props => {
	const { formatValue, onChange, isList, breakpoint, textLevel, styleCard } =
		props;

	const getTextDecorationValue = () => {
		return (
			getCustomFormatValue({
				typography: { ...getGroupAttributes(props, 'typography') },
				formatValue,
				prop: 'text-decoration',
				breakpoint,
				textLevel,
				styleCard,
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

		if (textDecorationValue === 'unset') response = 'line-through';
		else
			response =
				textDecorationValue.indexOf('line-through') >= 0
					? textDecorationValue.replace('line-through', '')
					: `${textDecorationValue} line-through`;

		response = trim(response);
		if (isEmpty(response)) response = 'unset';

		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value: {
				'text-decoration': response,
			},
			breakpoint,
			textLevel,
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
