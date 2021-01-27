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
	const { formatValue, onChange, isList, breakpoint, typography } = props;

	const superscriptValue =
		getCustomFormatValue({
			typography,
			formatValue,
			prop: 'vertical-align',
			breakpoint,
		}) || '';

	const isActive = (superscriptValue === 'sub' && true) || false;

	const onClick = () => {
		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography,
			value: {
				'vertical-align': isActive ? '' : 'sub',
			},
			breakpoint,
		});

		onChange(obj);
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
