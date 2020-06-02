/**
 * WordPress dependencies
 */
const {
    Icon,
    Button
} = wp.components;
const { useDispatch } = wp.data;

/**
 * Icons
 */
import { toolbarDuplicate } from '../../../../icons';

/**
 * Duplicate
 */
const Duplicate = props => {
    const { clientId } = props;

    const { duplicateBlocks } = useDispatch(
        'core/block-editor'
    );

    return (
        <Button
            className='toolbar-item toolbar-item__duplicate'
            onClick={() => duplicateBlocks([clientId])}
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarDuplicate}
            />
        </Button>
    )
}

export default Duplicate;