/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;
const { useState } = wp.element;

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
import { toolbarOverline } from '../../../../icons';

/**
 * TextFormatOverline
 */
const TextFormatOverline = props => {
	const { formatValue, onChange, isList, breakpoint, typography } = props;

	const textDecorationValue =
		getCustomFormatValue({
			typography,
			formatValue,
			prop: 'text-decoration',
			breakpoint,
		}) || '';

	const [isActive, setIsActive] = useState(
		textDecorationValue.indexOf('overline') >= 0
	);

	const getTextDecorationValue = () => {
		if (textDecorationValue === 'none') return 'overline';

		const response = isActive
			? textDecorationValue.replace('overline', '')
			: `${textDecorationValue} overline`;

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
		<Tooltip text={__('Overline', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__overline'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarOverline} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatOverline;
