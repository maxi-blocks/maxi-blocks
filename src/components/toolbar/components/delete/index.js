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
import { toolbarDelete } from '../../../../icons';

/**
 * Delete
 */
const Delete = props => {
    const { clientId } = props;

    const { removeBlock } = useDispatch(
        'core/block-editor'
    );

    return (
        <Button
            className='toolbar-item toolbar-item__delete'
            onClick={() => removeBlock(clientId)}
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarDelete}
            />
        </Button>
    )
}

export default Delete;