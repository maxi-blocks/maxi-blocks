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
    const checkboxId = `maxi-blocks-checkbox-${instanceId}`;

    const classes = classnames('maxi-blocks-checkbox-container', className);

    return (
        <BaseControl 
            id={id}
            label={title}
            help={help}
            className={classes}
        >
            <label 
                for={checkboxId}
                className="maxi-blocks-checkbox-label"
            >
                <input 
                    id={checkboxId}
                    name={checkboxId}
                    className="maxi-blocks-checkbox-input"
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