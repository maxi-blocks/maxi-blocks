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

import './editor.scss';
import { toolbarItalic } from '../../../../icons';

/**
 * TextItalic
 */
const TextItalic = props => {
	const { onChangeFormat, getValue } = props;

	const getItalicValue = () => getValue('font-style');

	const [isActive, setIsActive] = useState(
		(getItalicValue() > 400 && true) || false
	);

	useEffect(() => {
		setIsActive((getItalicValue() === 'italic' && true) || false);
	});

	return (
		<Tooltip text={__('Italic', 'maxi-blocks')} position='bottom center'>
			<Button
				className='toolbar-item toolbar-item__italic'
				onClick={() =>
					onChangeFormat({
						'font-style': isActive ? 'normal' : 'italic',
					})
				}
				aria-pressed={isActive}
			>
				<Icon
					className='toolbar-item__icon toolbar-item__italic'
					icon={toolbarItalic}
				/>
			</Button>
		</Tooltip>
	);
};

export default TextItalic;
