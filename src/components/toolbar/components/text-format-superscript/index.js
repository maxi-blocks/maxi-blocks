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
 * Styles and icons
 */
import { toolbarSuperScript } from '../../../../icons';

/**
 * TextFormatSuperscript
 */
const TextFormatSuperscript = props => {
	const { formatValue, onChange, isList, breakpoint } = props;

	const typography = { ...props.typography };

	const superscriptValue = __experimentalGetCustomFormatValue({
		typography,
		formatValue,
		prop: 'vertical-align',
		breakpoint,
	});

	const isActive = (superscriptValue === 'super' && true) || false;

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
				'vertical-align': isActive ? '' : 'super',
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
