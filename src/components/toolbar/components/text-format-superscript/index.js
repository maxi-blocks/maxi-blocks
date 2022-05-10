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

/**
 * Styles and icons
 */
import { toolbarSuperScript } from '../../../../icons';

/**
 * TextFormatSuperscript
 */
const TextFormatSuperscript = props => {
	const { onChangeFormat, getValue } = props;

	const getSuperscriptValue = () => getValue('vertical-align') || '';

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isActive, setIsActive] = useState(
		(getSuperscriptValue() === 'super' && true) || false
	);

	useEffect(() => {
		setIsActive((getSuperscriptValue() === 'super' && true) || false);
	});

	return (
		<Tooltip
			text={__('Superscript', 'maxi-blocks')}
			position='bottom center'
		>
			<Button
				className='toolbar-item toolbar-item__superscript'
				onClick={() =>
					onChangeFormat({
						'vertical-align': isActive ? 'unset' : 'super',
					})
				}
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
