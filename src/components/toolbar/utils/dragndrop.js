/**
 * WordPress dependencies
 */
const {
    Draggable,
    Icon,
    Button
} = wp.components;
const {
    useSelect,
    useDispatch
} = wp.data;
const {
    useEffect,
    useRef,
} = wp.element;

/**
 * Icons
 */
import {  toolbarMove } from '../../../icons';

/**
 * Drag&Drop 
 */
const DragAndDrop = props => {
    const {
        clientId
    } = props;

    const { srcRootClientId, index, isDraggable } = useSelect(
        (select) => {
            const {
                getBlockIndex,
                getBlockRootClientId,
                getTemplateLock,
            } = select('core/block-editor');
            const rootClientId = getBlockRootClientId(clientId)
            const templateLock = rootClientId
                ? getTemplateLock(rootClientId)
                : null;

            return {
                index: getBlockIndex(clientId, rootClientId),
                srcRootClientId: rootClientId,
                isDraggable: 'all' !== templateLock,
            };
        },
        [clientId]
    );
    const isDragging = useRef(false);
    const { startDraggingBlocks, stopDraggingBlocks } = useDispatch(
        'core/block-editor'
    );

    // Stop dragging blocks if the block draggable is unmounted
    useEffect(() => {
        return () => {
            if (isDragging.current) {
                stopDraggingBlocks();
            }
        };
    }, []);

    const blockElementId = `block-${clientId}`;
    const transferData = {
        type: 'block',
        srcIndex: index,
        srcClientId: clientId,
        srcRootClientId,
    };

    return (
        <Draggable
            elementId={blockElementId}
            transferData={transferData}
            onDragStart={() => {
                startDraggingBlocks();
                isDragging.current = true;
            }}
            onDragEnd={() => {
                stopDraggingBlocks();
                isDragging.current = false;
            }}
        >
            {({ onDraggableStart, onDraggableEnd }) => (
                <Button
                    className='toolbar-item toolbar-item__move'
                    draggable={isDraggable}
                    onDragStart={onDraggableStart}
                    onDragEnd={onDraggableEnd}
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarMove}
                    />
                </Button>
            )}
        </Draggable>
    )
}

export default DragAndDrop;