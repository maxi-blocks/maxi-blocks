/**
 * WordPress dependencies
 */
const { BaseControl } = wp.components;
const { useInstanceId } = wp.compose;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const CheckBoxControl = props => {
    const {
        id = '',
        title = '',
        help = '',
        className,
        checked,
        label,
        onChange,
    } = props;

    const instanceId = useInstanceId( CheckBoxControl );
    const checkboxId = `gutenberg-extra-checkbox-${instanceId}`;

    const classes = classnames('gutenberg-extra-checkbox-container', className);

    return (
        <BaseControl 
            id={id}
            label={title}
            help={help}
            className={classes}
        >
            <label 
                for={checkboxId}
                className="gutenberg-extra-checkbox-label"
            >
                <input 
                    id={checkboxId}
                    name={checkboxId}
                    className="gutenberg-extra-checkbox-input"
                    type="checkbox" 
                    onChange={el => onChange(el.target.checked)}
                    checked={checked}
                />
                {label}
            </label>
        </BaseControl>
    )
}

export default CheckBoxControl;