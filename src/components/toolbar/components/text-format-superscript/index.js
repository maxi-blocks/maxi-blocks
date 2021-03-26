/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon, Button, Tooltip } = wp.components;
const { useState, useEffect } = wp.element;

/**
 * Internal dependencies
 */
import {
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Styles and icons
 */
import { toolbarSuperScript } from '../../../../icons';

/**
 * TextFormatSuperscript
 */
const TextFormatSuperscript = props => {
	const { getFormatValue, onChange, isList, breakpoint } = props;

	const formatValue = getFormatValue();

	const getSuperscriptValue = () =>
		getCustomFormatValue({
			typography: { ...getGroupAttributes(props, 'typography') },
			formatValue,
			prop: 'vertical-align',
			breakpoint,
		}) || '';

	const superscriptValue = getSuperscriptValue();

	const [isActive, setIsActive] = useState(
		(superscriptValue === 'super' && true) || false
	);

	useEffect(() => {
		const superscriptValue = getSuperscriptValue();

		setIsActive((superscriptValue === 'super' && true) || false);
	});

	const onClick = () => {
		const formatValue = getFormatValue();

		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value: {
				'vertical-align': isActive ? '' : 'super',
			},
			breakpoint,
		});

		setIsActive(!isActive);

		onChange(obj);
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
