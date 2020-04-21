/**
 * WordPress dependencies
 */
const { BaseControl } = wp.components;
import { useInstanceId } from '@wordpress/compose';

/**
 * Block
 */
export default function Checkbox (props) {

    const {
        id = '',
        title = '',
        help = '',
        className = "gutenberg-extra-checkbox-container",
        checked,
        label,
        onChange,
    } = props;

    const instanceId = useInstanceId( Checkbox );
    const checkboxId = `gutenberg-extra-checkbox-${instanceId}`;

    return (
        <BaseControl 
            id={id}
            label={title}
            help={help}
            className={className}
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