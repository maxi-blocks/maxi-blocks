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

/**
 * External dependencies
 */
import { trim, isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarStrikethrough } from '@maxi-icons';

/**
 * TextFormatStrikethrough
 */
const TextFormatStrikethrough = props => {
	const { onChangeFormat, getValue, tooltipHide } = props;

	const getTextDecorationValue = () => getValue('text-decoration') || '';

	const [isActive, setIsActive] = useState(
		getTextDecorationValue().indexOf('line-through') >= 0
	);

	useEffect(() => {
		setIsActive(getTextDecorationValue().indexOf('line-through') >= 0);
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

		onChangeFormat({
			'text-decoration': response,
		});
	};

	const contentStrikethrough = () => {
		return (
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
		);
	};

	if (!tooltipHide)
		return (
			<Tooltip text={__('Strikethrough', 'maxi-blocks')} placement='top'>
				{contentStrikethrough()}
			</Tooltip>
		);
	return contentStrikethrough();
};

export default TextFormatStrikethrough;
