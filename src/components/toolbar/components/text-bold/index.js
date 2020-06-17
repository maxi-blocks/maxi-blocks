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
        clientId,
        blockName,
        typography,
        onChange
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const getBoldTypography = () => {
        if (value.desktop['font-weight'] != 800) {
            value.desktop['font-weight'] = 800;
            value.tablet['font-weight'] = 800;
            value.mobile['font-weight'] = 800;
        }
        else {
            value.desktop['font-weight'] = 400;
            value.tablet['font-weight'] = 400;
            value.mobile['font-weight'] = 400;
        }


        onChange(JSON.stringify(value))
    }

    let value = JSON.parse(typography);

    return (
        <Button
            className='toolbar-item toolbar-item__bold'
            onClick={getBoldTypography}
            aria-pressed={value.desktop['font-weight'] === 800}
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarBold}
            />
        </Button>
    )
}

export default TextBold;