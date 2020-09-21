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
import { isObject } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarItalic } from '../../../../icons';

/**
 * TextFormatUnderline
 */
const TextFormatUnderline = props => {
	const { typography, formatValue, onChange, isList, breakpoint } = props;

	const typographyValue =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const textDecorationValue = __experimentalGetCustomFormatValue({
		typography: typographyValue,
		formatValue,
		prop: 'text-decoration',
		breakpoint,
	});

	const isActive = textDecorationValue.indexOf('underline') >= 0;

	const getTextDecorationValue = () => {
		if (textDecorationValue === 'none') return 'underline';

		const response = isActive
			? textDecorationValue.replace('underline', '')
			: `${textDecorationValue} underline`;

		return response;
	};

	const onClick = () => {
		const {
			typography: newTypography,
			content: newContent,
		} = __experimentalSetFormat({
			formatValue,
			isActive,
			isList,
			typography: typographyValue,
			value: {
				'text-decoration': getTextDecorationValue(),
			},
			breakpoint,
		});

		onChange({
			typography: JSON.stringify(newTypography),
			...(newContent && { content: newContent }),
		});
	};

	return (
		<Tooltip text={__('Underline', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__underline'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarItalic} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatUnderline;
