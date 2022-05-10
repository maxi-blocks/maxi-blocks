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
import { toolbarSubScript } from '../../../../icons';

/**
 * TextFormatSubscript
 */
const TextFormatSubscript = props => {
	const { onChangeFormat, getValue } = props;

	const getSuperscriptValue = () => getValue('vertical-align') || '';

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isActive, setIsActive] = useState(
		(getSuperscriptValue() === 'sub' && true) || false
	);

	useEffect(() => {
		setIsActive((getSuperscriptValue() === 'sub' && true) || false);
	});

	return (
		<Tooltip text={__('Subscript', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__subscript'
				onClick={() =>
					onChangeFormat({
						'vertical-align': isActive ? 'unset' : 'sub',
					})
				}
				aria-pressed={isActive}
			>
				<Icon className='toolbar-item__icon' icon={toolbarSubScript} />
			</Button>
		</Tooltip>
	);
};

export default TextFormatSubscript;
