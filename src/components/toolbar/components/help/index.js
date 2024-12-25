/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Icon from '@components/icon';

/**
 * Icons
 */
import { toolbarHelp } from '@maxi-icons';

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
				<a
					href='https://maxiblocks.com/go/help-center'
					target='_blank'
					rel='noopener noreferrer'
					className='maxi-components-button components-button'
				>
					<Icon className='toolbar-item__icon' icon={toolbarHelp} />
				</a>
			</div>
		);
	};

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Help', 'maxi-blocks')} placement='top'>
				{helpContent()}
			</Tooltip>
		);

	return helpContent();
};

export default Help;
