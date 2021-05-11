/**
 * Internal dependencies
 */
import Icon from '../../../icon';

/**
 * Icons
 */
import { toolbarStyle } from '../../../../icons';

/**
 * Style
 */
const Style = props => {
	return (
		<div className='toolbar-item toolbar-item__style'>
			<Icon className='toolbar-item__icon' icon={toolbarStyle} />
		</div>
	);
};

export default Style;
