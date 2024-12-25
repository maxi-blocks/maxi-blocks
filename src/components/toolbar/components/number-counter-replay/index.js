/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import Icon from '@components/icon';

/**
 * Styles and icons
 */
import { replay } from '@maxi-icons';

const NumberCounterReplay = props => {
	const { blockName, resetNumberHelper, tooltipsHide } = props;

	const replayContent = () => {
		return (
			<div className='toolbar-item toolbar-item__replay'>
				<Button
					className='toolbar-item toolbar-item__replay'
					onClick={resetNumberHelper}
				>
					<Icon className='toolbar-item__icon' icon={replay} />
				</Button>
			</div>
		);
	};

	if (blockName !== 'maxi-blocks/number-counter-maxi') return null;

	if (!tooltipsHide)
		return (
			<Tooltip text={__('Replay', 'maxi-blocks')}>
				{replayContent()}{' '}
			</Tooltip>
		);
	return replayContent();
};

export default NumberCounterReplay;
