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
import { toolbarBold } from '../../../../icons';

/**
 * TextBold
 */
const TextBold = props => {
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
        if (typography.desktop['font-weight'] != 800) {
            typography.desktop['font-weight'] = 800;
            typography.tablet['font-weight'] = 800;
            typography.mobile['font-weight'] = 800;
        }
        else {
            typography.desktop['font-weight'] = 400;
            typography.tablet['font-weight'] = 400;
            typography.mobile['font-weight'] = 400;
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
            className='toolbar-item toolbar-item__bold'
            onClick={getBoldTypography}
            aria-pressed={typography.desktop['font-weight'] === 800}
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarBold}
            />
        </Button>
    )
}

export default TextBold;