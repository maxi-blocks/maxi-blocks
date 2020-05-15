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
 * Component
 */
const AlignmentControl = props => {

    const {
        value,
        onChange,
        disableLeft = false,
        disableCenter = false,
        disableRight = false,
        disableJustify = false,
    } = props;

    const getOptions = () => {
        let options = [];
        if(!disableLeft)
            options.push({ label: <Icon icon={alignLeft} />, value: 'left' });
        if(!disableCenter)
            options.push({ label: <Icon icon={alignCenter} />, value: 'center' });
        if(!disableRight)
            options.push({ label: <Icon icon={alignRight} />, value: 'right' });
        if(!disableJustify)
            options.push({ label: <Icon icon={alignJustify} />, value: 'justify' })

        return options;
    }

    return (
        <RadioControl
            label={__('Alignment', 'maxi-blocks')}
            className={'components-base-control maxi-alignmentcontrol-control'}
            selected={value}
            options={getOptions()}
            onChange={value => onChange(value)}
        />
    )
}

export default AlignmentControl;