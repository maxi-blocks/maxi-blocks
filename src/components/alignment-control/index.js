/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { 
    Button, 
    ButtonGroup,
    BaseControl,
} = wp.components;

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

    // const {
    //     value,
    //     onChange
    // } = props;

    const value = 'alignLeft';
    const onChange = e => {
        console.log (e)
    }

    const getClassName = align => {
        let response = "gx-alignmentcontrol-button";
        if ( align === value ) {
            response += ' selected';
        }
        return response;
    }

    const onClick = e => {
        const value = e.target.value;
        onChange(value);
    }

    return (
        <BaseControl
            label={__('Alignment', 'gutenberg-extra')}
            className="gx-alignmentcontrol-control"
        >
            <ButtonGroup>
                <Button 
                    className={getClassName('alignLeft')}
                    value='alignLeft'
                    onClick={onClick}
                    >
                    <Icon icon={alignLeft} />
                </Button>
                <Button 
                    className={getClassName('alignCeter')}
                    value='alignCenter'
                    onClick={onClick}
                    >
                    <Icon icon={alignCenter} />
                </Button>
                <Button 
                    className={getClassName('alignRight')}
                    value='alignRight'
                    onClick={onClick}
                    >
                    <Icon icon={alignRight} />
                </Button>
                <Button 
                    className={getClassName('alignJustify')}
                    value='alignLeft'
                    onClick={onClick}
                    >
                    <Icon icon={alignJustify} />
                </Button>
            </ButtonGroup>
        </BaseControl>
    )
}

export default AlignmentControl;