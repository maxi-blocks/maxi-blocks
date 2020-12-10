/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import {
	__experimentalSetFormat,
	__experimentalGetCustomFormatValue,
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
	const { formatValue, onChange, isList, breakpoint } = props;

	const typography = { ...props.typography };

	const textDecorationValue = __experimentalGetCustomFormatValue({
		typography,
		formatValue,
		prop: 'text-decoration',
		breakpoint,
	});

	const isActive = textDecorationValue.indexOf('line-through') >= 0;

	const getTextDecorationValue = () => {
		if (textDecorationValue === 'none') return 'line-through';

		const response = isActive
			? textDecorationValue.replace('line-through', '')
			: `${textDecorationValue} line-through`;

		return trim(response);
	};

	const onClick = () => {
		const {
			typography: newTypography,
			content: newContent,
		} = __experimentalSetFormat({
			formatValue,
			isActive,
			isList,
			typography,
			value: {
				'text-decoration': getTextDecorationValue(),
			},
			breakpoint,
		});

		onChange({
			typography: newTypography,
			...(newContent && { content: newContent }),
		});
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
