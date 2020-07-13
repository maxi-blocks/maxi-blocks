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
import { toolbarItalic } from '../../../../icons';

/**
 * TextItalic
 */
const TextItalic = props => {
    const {
        blockName,
        typography,
        onChange,
        breakpoint
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const getBoldTypography = () => {
        if (value[breakpoint]['font-style'] != 'italic') 
            value[breakpoint]['font-style'] = 'italic';
        else 
            value[breakpoint]['font-style'] = 'normal';

        onChange(JSON.stringify(value))
    }

    let value = JSON.parse(typography);

    return (
        <Button
            className='toolbar-item toolbar-item__italic'
            onClick={getBoldTypography}
            aria-pressed={value[breakpoint]['font-style'] === 'italic'}
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarItalic}
            />
        </Button>
    )
}

export default TextItalic;