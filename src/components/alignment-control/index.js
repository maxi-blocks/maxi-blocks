/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { RadioControl } = wp.components;

/**
 * Styles and Icons
 */
import './editor.scss';
import { 
    Icon, 
    alignLeft, 
    alignCenter,
    alignRight, 
    alignJustify
} from '@wordpress/icons';

/**
 * Block
 */
const AlignmentControl = props => {

    const {
        value,
        onChange
    } = props;

    const getClassName = align => {
        let response = "gx-alignmentcontrol-button";
        if ( align === value ) {
            response += ' selected';
        }
        return response;
    }

    return (
        <RadioControl
            label={__('Alignment', 'gutenberg-extra')}
            className={'gx-alignmentcontrol-control'}
            selected={value}
            options={[
                { label: <Icon icon={alignLeft} />, value: 'left' },
                { label: <Icon icon={alignCenter} />, value: 'center' },
                { label: <Icon icon={alignRight} />, value: 'right' },
                { label: <Icon icon={alignJustify} />, value: 'justify' },
            ]}
            onChange={value => onChange(value)}
        />
    )
}

export default AlignmentControl;