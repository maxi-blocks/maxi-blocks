/**
 * WordPress dependencies
 */
const {
    Icon,
    Button,
} = wp.components;
const { useDispatch } = wp.data;

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
        onChange
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const getBoldTypography = () => {
        if (value.desktop['font-style'] != 'italic') {
            value.desktop['font-style'] = 'italic';
            value.tablet['font-style'] = 'italic';
            value.mobile['font-style'] = 'italic';
        }
        else {
            value.desktop['font-style'] = 'normal';
            value.tablet['font-style'] = 'normal';
            value.mobile['font-style'] = 'normal';
        }


        onChange(JSON.stringify(value))
    }

    let value = JSON.parse(typography);

    return (
        <Button
            className='toolbar-item toolbar-item__italic'
            onClick={getBoldTypography}
            aria-pressed={value.desktop['font-style'] === 'italic'}
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarItalic}
            />
        </Button>
    )
}

export default TextItalic;