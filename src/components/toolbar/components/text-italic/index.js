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
        clientId,
        blockName,
        rawTypography
    } = props;

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const getBoldTypography = () => {
        console.log(typography.desktop['font-style'])
        if (typography.desktop['font-style'] != 'italic') {
            typography.desktop['font-style'] = 'italic';
            typography.tablet['font-style'] = 'italic';
            typography.mobile['font-style'] = 'italic';
        }
        else {
            typography.desktop['font-style'] = 'normal';
            typography.tablet['font-style'] = 'normal';
            typography.mobile['font-style'] = 'normal';
        }


        updateBlockAttributes(
            clientId,
            {
                typography: JSON.stringify(typography)
            }
        )
    }

    let typography = JSON.parse(rawTypography);

    return (
        <Button
            className='toolbar-item toolbar-item__italic'
            onClick={getBoldTypography}
            aria-pressed={typography.desktop['font-style'] === 'italic'}
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarItalic}
            />
        </Button>
    )
}

export default TextItalic;