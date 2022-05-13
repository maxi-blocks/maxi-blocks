/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';
import { getGroupAttributes } from '../../../../extensions/styles';
import {
	setFormat,
	getCustomFormatValue,
} from '../../../../extensions/text/formats';

/**
 * Styles and icons
 */
import { toolbarSuperScript } from '../../../../icons';

/**
 * TextFormatSuperscript
 */
const TextFormatSuperscript = props => {
	const {
		formatValue,
		onChange,
		isList,
		breakpoint,
		textLevel,
		styleCard,
		tooltipsHide,
	} = props;

	const getSuperscriptValue = () =>
		getCustomFormatValue({
			typography: { ...getGroupAttributes(props, 'typography') },
			formatValue,
			prop: 'vertical-align',
			breakpoint,
			textLevel,
			styleCard,
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
		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography: { ...getGroupAttributes(props, 'typography') },
			value: {
				'vertical-align': isActive ? 'unset' : 'super',
			},
			breakpoint,
			textLevel,
		});

		setIsActive(!isActive);

		onChange(obj);
	};

	const superscriptContent = () => {
		return (
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
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip
				text={__('Superscript', 'maxi-blocks')}
				position='bottom center'
			>
				{superscriptContent()}
			</Tooltip>
		);
	return superscriptContent();
};

export default TextFormatSuperscript;
