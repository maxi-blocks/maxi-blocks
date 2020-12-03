/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import {
	GetCustomFormatValue,
	SetFormat,
} from '../../../../extensions/text/formats';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarBold } from '../../../../icons';

/**
 * TextBold
 */
const TextBold = ({
	typography,
	formatValue,
	blockName,
	onChange,
	isList,
	breakpoint,
}) => {
	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typographyValue =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const boldValue = GetCustomFormatValue({
		typography: typographyValue,
		formatValue,
		prop: 'font-weight',
		breakpoint,
	});

	const isActive = (boldValue > 400 && true) || false;

	const onClick = () => {
		const { typography: newTypography, content: newContent } = SetFormat({
			formatValue,
			isActive,
			isList,
			typography: typographyValue,
			value: {
				'font-weight': (isActive && 400) || 800,
			},
			breakpoint,
			// isHover,
		});

		onChange({
			typography: JSON.stringify(newTypography),
			...(newContent && { content: newContent }),
		});
	};

	return (
		<Tooltip text={__('Bold', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__bold'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarBold} />
			</Button>
		</Tooltip>
	);
};

export default TextBold;
