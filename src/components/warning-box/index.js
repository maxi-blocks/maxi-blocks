/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

const WarningBox = ({ className, message }) => {
	const classes = classnames('maxi-warning-box', className);

	return <div className={classes}>{message}</div>;
};

export default WarningBox;
