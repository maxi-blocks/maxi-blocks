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
import { toolbarStrikethrough } from '../../../../icons';

/**
 * TextFormatStrikethrough
 */
const TextFormatStrikethrough = props => {
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
		textDecorationValue.indexOf('line-through') >= 0
	);

	const getTextDecorationValue = () => {
		if (textDecorationValue === 'none') return 'line-through';

		const response = isActive
			? textDecorationValue.replace('line-through', '')
			: `${textDecorationValue} line-through`;

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
