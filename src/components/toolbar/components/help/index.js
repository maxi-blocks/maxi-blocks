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
import tooltipsHide from '../../tooltipsHide';

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
	const { blockName } = props;

	if (blockName === 'maxi-blocks/column-maxi') return null;

	if (!tooltipsHide())
		return (
			<Tooltip text={__('Help', 'maxi-blocks')} position='bottom center'>
				<div className='toolbar-item toolbar-item__help'>
					<Button href='#'>
						<Icon
							className='toolbar-item__icon'
							icon={toolbarHelp}
						/>
					</Button>
				</div>
			</Tooltip>
		);
	return (
		<div className='toolbar-item toolbar-item__help'>
			<Button href='#'>
				<Icon className='toolbar-item__icon' icon={toolbarHelp} />
			</Button>
		</div>
	);
};

export default Help;
