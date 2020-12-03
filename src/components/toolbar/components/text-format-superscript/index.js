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
import { isObject } from 'lodash';

/**
 * Styles and icons
 */
import { toolbarSuperScript } from '../../../../icons';

/**
 * TextFormatSuperscript
 */
const TextFormatSuperscript = props => {
	const { typography, formatValue, onChange, isList, breakpoint } = props;

	const typographyValue =
		(!isObject(typography) && JSON.parse(typography)) || typography;

	const superscriptValue = GetCustomFormatValue({
		typography: typographyValue,
		formatValue,
		prop: 'vertical-align',
		breakpoint,
	});

	const isActive = (superscriptValue === 'super' && true) || false;

	const onClick = () => {
		const { typography: newTypography, content: newContent } = SetFormat({
			formatValue,
			isActive,
			isList,
			typography: typographyValue,
			value: {
				'vertical-align': isActive ? '' : 'super',
			},
			breakpoint,
		});

		onChange({
			typography: JSON.stringify(newTypography),
			...(newContent && { content: newContent }),
		});
	};

	return (
		<Tooltip
			text={__('Superscript', 'maxi-blocks')}
			position='bottom center'
		>
			<Button
				className='toolbar-item toolbar-item__superscript'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon
					className='toolbar-item__icon'
					icon={toolbarSuperScript}
				/>
			</Button>
		</Tooltip>
	);
};

export default TextFormatSuperscript;
