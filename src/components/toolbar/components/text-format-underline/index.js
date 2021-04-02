/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, Button, Tooltip } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';

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
	const { formatValue, onChange, isList, breakpoint, typography } = props;

	const textDecorationValue =
		getCustomFormatValue({
			typography,
			formatValue,
			prop: 'text-decoration',
			breakpoint,
		}) || '';

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isActive, setIsActive] = useState(
		textDecorationValue.indexOf('underline') >= 0
	);
	const getTextDecorationValue = () => {
		if (textDecorationValue === 'none') return 'underline';

		const response = isActive
			? textDecorationValue.replace('underline', '')
			: `${textDecorationValue} underline`;

		return trim(response);
	};

	const onClick = () => {
		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography,
			value: {
				'text-decoration': getTextDecorationValue(),
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
