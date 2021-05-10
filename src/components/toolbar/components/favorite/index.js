/**
 * WordPress dependencies
 */
import { Button, Icon } from '@wordpress/components';

/**
 * Icons
 */
import { toolbarFavorite } from '../../../../icons';

/**
 * Favorite
 */
const Favorite = () => {
	return (
		<Button className='toolbar-item toolbar-item__favorite'>
			<Icon className='toolbar-item__icon' icon={toolbarFavorite} />
		</Button>
	);
};

export default Favorite;
