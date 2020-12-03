/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import {
	SetFormat,
	GetCustomFormatValue,
} from '../../../../extensions/text/formats';

/**
 * External dependencies
 */
import { isObject, trim } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarOverline } from '../../../../icons';

/**
 * TextFormatOverline
 */
const TextFormatOverline = props => {
	const { typography, formatValue, onChange, isList, breakpoint } = props;

	const typographyValue =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const textDecorationValue = GetCustomFormatValue({
		typography: typographyValue,
		formatValue,
		prop: 'text-decoration',
		breakpoint,
	});

	const isActive = textDecorationValue.indexOf('overline') >= 0;

	const getTextDecorationValue = () => {
		if (textDecorationValue === 'none') return 'overline';

		const response = isActive
			? textDecorationValue.replace('overline', '')
			: `${textDecorationValue} overline`;

		return trim(response);
	};

	const onClick = () => {
		const { typography: newTypography, content: newContent } = SetFormat({
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
