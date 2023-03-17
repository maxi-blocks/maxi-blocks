/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const DisabledMaxiBlock = () => (
	<div className='maxi-block__disabled'>
		<p>
			{__(
				'To edit this block please use a desktop browser',
				'maxi-blocks'
			)}
		</p>
	</div>
);

export default DisabledMaxiBlock;
