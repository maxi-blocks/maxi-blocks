/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';
import { setFormat, getCustomFormatValue } from '@extensions/text/formats';

/**
 * External dependencies
 */
import { trim, isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarOverline } from '@maxi-icons';
import { getGroupAttributes } from '@extensions/styles';

/**
 * TextFormatOverline
 */
const TextFormatOverline = props => {
	const {
		formatValue,
		onChange,
		isList,
		breakpoint,
		textLevel,
		styleCard,
		tooltipsHide,
	} = props;

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
		textDecorationValue.indexOf('overline') >= 0
	);

	useEffect(() => {
		const textDecorationValue = getTextDecorationValue();

		setIsActive(textDecorationValue.indexOf('overline') >= 0);
	});

	const onClick = () => {
		const textDecorationValue = getTextDecorationValue();

		let response;

		if (textDecorationValue === 'unset') response = 'overline';
		else
			response =
				textDecorationValue.indexOf('overline') >= 0
					? textDecorationValue.replace('overline', '')
					: `${textDecorationValue} overline`;

		response = trim(response);
		if (isEmpty(response)) response = 'unset';

		const obj = setFormat({
			formatValue,
			isActive: textDecorationValue.indexOf('overline') >= 0,
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

	const overlineContent = () => {
		return (
			<Button
				className='toolbar-item toolbar-item__overline'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarOverline} />
			</Button>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Overline', 'maxi-blocks')} placement='top'>
				{overlineContent()}
			</Tooltip>
		);
	return overlineContent();
};

export default TextFormatOverline;
