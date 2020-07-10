/**
 * WordPress dependencies
 */
const {
    Icon,
    Button,
} = wp.components;

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarBold } from '../../../../icons';

/**
 * TextBold
 */
const TextBold = props => {
    const {
        blockName,
        typography,
        onChange,
        breakpoint
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const getBoldTypography = () => {
        if (value[breakpoint]['font-weight'] != 800) 
            value[breakpoint]['font-weight'] = 800;
        else 
            value[breakpoint]['font-weight'] = 400;

        onChange(JSON.stringify(value))
    }

    let value = JSON.parse(typography);

    return (
        <Button
            className='toolbar-item toolbar-item__bold'
            onClick={getBoldTypography}
            aria-pressed={value[breakpoint]['font-weight'] === 800}
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarBold}
            />
        </Button>
    )
}

export default TextBold;