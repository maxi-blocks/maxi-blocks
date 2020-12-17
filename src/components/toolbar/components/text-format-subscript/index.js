/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;

/**
 * Internal dependencies
 */
import {
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';

/**
 * Styles and icons
 */
import { toolbarSubScript } from '../../../../icons';

/**
 * TextFormatSubscript
 */
const TextFormatSubscript = props => {
	const { formatValue, onChange, isList, breakpoint } = props;

	const typography = { ...props.typography };

	const superscriptValue = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'vertical-align',
		breakpoint,
	});

	const isActive = (superscriptValue === 'sub' && true) || false;

	const onClick = () => {
		const { typography: newTypography, content: newContent } = setFormat({
			formatValue,
			isActive,
			isList,
			typography,
			value: {
				'vertical-align': isActive ? '' : 'sub',
			},
			breakpoint,
		});

		onChange({
			typography: newTypography,
			...(newContent && { content: newContent }),
		});
	};

	return (
		<Tooltip text={__('Subscript', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__subscript'
				onClick={onClick}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarSubScript} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatSubscript;
