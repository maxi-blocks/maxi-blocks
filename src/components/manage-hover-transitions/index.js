/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { openTransitions } from '@extensions/inspector';

const ManageHoverTransitions = () => {
	return (
		<div
			className='maxi-warning-box__links manage-transitions'
			onClick={() => {
				openTransitions();
			}}
		>
			<a>{__('Manage hover transitions', 'maxi-blocks')}</a>
		</div>
	);
};
export default ManageHoverTransitions;
