/**
 * WordPress dependencies
 */
 import { __ } from '@wordpress/i18n';
 import { Icon } from '@wordpress/components';
 import { Tooltip } from '@wordpress/components';

 /**
  * Internal dependencies
  */
 import Button from '../../../button';
 
 /**
  * Styles and icons
  */
import { replay } from '../../../../icons';

 const NumberCounterReplay = props => {
	const {
		blockName,
		resetNumberHelper,
	} = props;

	if (blockName !== 'maxi-blocks/number-counter-maxi') return null;
	return (
		<Tooltip text={__('Replay', 'maxi-blocks')}>
			<div className='toolbar-item toolbar-item__replay'>
				<Button 
				className='toolbar-item toolbar-item__replay'
				onClick={resetNumberHelper}>
					<Icon
						className='toolbar-item__icon'
						icon={replay}
					/>
				</Button>
			</div>
		</Tooltip>
	 );
 };
 
 export default NumberCounterReplay;