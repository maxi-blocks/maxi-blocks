/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Icon from '../../../icon';
import CrispChat from '../../../../editor/crisp-chat';

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
				<CrispChat>
					<Icon className='toolbar-item__icon' icon={toolbarHelp} />
				</CrispChat>
			</div>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Help', 'maxi-blocks')} position='top center'>
				{helpContent()}
			</Tooltip>
		);

	return helpContent();
};

export default Help;
