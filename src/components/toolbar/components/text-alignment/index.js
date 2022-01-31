/**
 * Internal dependencies
 */
import AlignmentControl from '../../../alignment-control';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
// import './editor.scss';

const TextAlignment = props => {
	const { onChange, breakpoint = false } = props;

	return (
		<AlignmentControl
			{...getGroupAttributes(props, 'textAlignment')}
			onChange={obj => onChange(obj)}
			breakpoint={breakpoint}
			type='text'
			isToolbar
		/>
	);
};

export default TextAlignment;
