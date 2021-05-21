/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

const Spinner = ({ className }) => {
	const classes = classnames('maxi-spinner', className);

	return <span className={classes}></span>;
};

export default Spinner;
