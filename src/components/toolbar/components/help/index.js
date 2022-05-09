/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '../../../button';
import Icon from '../../../icon';

/**
 * Icons
 */
import { toolbarHelp } from '../../../../icons';

/**
 * Style
 */
import './editor.scss';

/**
 * Duplicate
 */
const Help = props => {
	const { blockName, tooltipsHide } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

	const helpContent = () => {
		return (
			<div className='toolbar-item toolbar-item__help'>
				<Button href='#'>
					<Icon className='toolbar-item__icon' icon={toolbarHelp} />
				</Button>
			</div>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Help', 'maxi-blocks')} position='bottom center'>
				{helpContent()}
			</Tooltip>
		);
	return helpContent();
};

export default Help;
