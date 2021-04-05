/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, Button, Tooltip } from '@wordpress/components';
import { useState } from '@wordpress/element';

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
import { toolbarSuperScript } from '../../../../icons';

/**
 * TextFormatSuperscript
 */
const TextFormatSuperscript = props => {
	const { formatValue, onChange, isList, breakpoint, typography } = props;

	const superscriptValue =
		getCustomFormatValue({
			typography,
			formatValue,
			prop: 'vertical-align',
			breakpoint,
		}) || '';

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isActive, setIsActive] = useState(
		(superscriptValue === 'super' && true) || false
	);

	const onClick = () => {
		const obj = setFormat({
			formatValue,
			isActive,
			isList,
			typography,
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
