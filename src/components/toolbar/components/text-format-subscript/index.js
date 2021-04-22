/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, Button, Tooltip } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

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
import { toolbarSubScript } from '../../../../icons';

/**
 * TextFormatSubscript
 */
const TextFormatSubscript = props => {
	const { formatValue, onChange, isList, breakpoint } = props;

	const getSuperscriptValue = () =>
		getCustomFormatValue({
			typography: { ...getGroupAttributes(props, 'typography') },
			formatValue,
			prop: 'vertical-align',
			breakpoint,
		}) || '';

	const superscriptValue = getSuperscriptValue();

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isActive, setIsActive] = useState(
		(superscriptValue === 'sub' && true) || false
	);

	useEffect(() => {
		const superscriptValue = getSuperscriptValue();

		setIsActive((superscriptValue === 'sub' && true) || false);
	});

	const onClick = () => {
		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value: {
				'vertical-align': isActive ? '' : 'sub',
			},
			breakpoint,
		});

		setIsActive(!isActive);

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
