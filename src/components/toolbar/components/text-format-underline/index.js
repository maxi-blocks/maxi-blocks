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

/**
 * External dependencies
 */
import { trim, isEmpty } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarUnderline } from '../../../../icons';

/**
 * TextFormatUnderline
 */
const TextFormatUnderline = props => {
	const { onChangeFormat, getValue, tooltipsHide } = props;

	const getTextDecorationValue = () => getValue('text-decoration') || '';

	const [isActive, setIsActive] = useState(
		getTextDecorationValue().indexOf('overline') >= 0
	);

	useEffect(() => {
		setIsActive(getTextDecorationValue().indexOf('underline') >= 0);
	});

	const onClick = () => {
		const textDecorationValue = getTextDecorationValue();

		let response;

		if (textDecorationValue === 'unset') response = 'underline';
		else
			response =
				textDecorationValue.indexOf('underline') >= 0
					? textDecorationValue.replace('underline', '')
					: `${textDecorationValue} underline`;

		response = trim(response);
		if (isEmpty(response)) response = 'unset';

		onChangeFormat({
			'text-decoration': response,
		});
	};

	const underlineContent = () => {
		return (
			<Button
				className='toolbar-item toolbar-item__underline'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarUnderline} />
			</Button>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip
				text={__('Underline', 'maxi-blocks')}
				position='top center'
			>
				{underlineContent()}
			</Tooltip>
		);
	return underlineContent();
};

export default TextFormatUnderline;
