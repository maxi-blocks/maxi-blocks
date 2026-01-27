/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

const SelectEditOverlay = ({ isSelected = false, className }) => {
	return (
		<div
			className={classnames(
				'maxi-select-edit-overlay',
				isSelected && 'is-selected',
				className
			)}
		/>
	);
};

export default SelectEditOverlay;
