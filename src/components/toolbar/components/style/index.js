/**
 * WordPress dependencies
 */
const { Icon } = wp.components;

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
