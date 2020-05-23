/**
 * WordPress dependencies
 */
const { __experimentalLinkControl } = wp.blockEditor;
const {
    Draggable,
    Icon,
    Dropdown,
    Button
} = wp.components;
const {
    useSelect,
    useDispatch
} = wp.data;
const {
    useEffect,
    useRef,
    createContext
} = wp.element;

/**
 * Internal dependencies
 */
import {
    PopoverControl
} from '../popover-control';
import TEMPLATES from '../../blocks/row-maxi/templates';

/**
 * Icons
 */
import {
    toolbarDelete,
    toolbarDuplicate,
    toolbarFavorite,
    toolbarLink,
    toolbarMove,
    toolbarReplaceImage,
    toolbarStyle,
} from '../../icons';
import update from '@wordpress/icons/build/library/update';

/**
 * Drag&Drop 
 */
export const DragAndDrop = props => {
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

/**
 * Style
 */
export const Style = props => {
    return (
        <div
            className='toolbar-item toolbar-item__style'
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarStyle}
            />
        </div>
    )
}

/**
 * Column patterns
 * 
 * @todo Shows just row patterns with same existing number of columns
 */
export const ColumnPatterns = props => {
    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__column-patterns'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarStyle}
                    />
                </Button>
            )}
            popoverProps={
                {
                    className: 'toolbar-item__popover',
                    noArrow: false,
                    position: 'center'
                }
            }
            renderContent={
                () => (
                    <div
                        class="toolbar-item__popover__wrapper"
                    >
                        {
                            TEMPLATES.map((template, i) => (
                                <Button
                                    className="toolbar-item__popover__template-button"
                                >
                                    <Icon
                                        className="toolbar-item__popover__template-button__icon"
                                        icon={template.icon}
                                    />
                                </Button>
                            )
                            )
                        }
                    </div>
                )
            }
        >
        </Dropdown>
    )
}

/**
 * Duplicate
 */
export const Duplicate = props => {
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

/**
 * Link
 */
export const Link = props => {
    const { clientId } = props;

	const { linkSettings } = useSelect(
		( select ) => {
			const { getBlockAttributes } = select(
				'core/block-editor'
            );
			return {
				linkSettings: getBlockAttributes( clientId ).linkSettings,
			};
		},
		[ clientId ]
	);

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__link'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarLink}
                    />
                </Button>
            )}
            popoverProps={
                {
                    className: 'toolbar-item__popover',
                    noArrow: false,
                    position: 'center'
                }
            }
            renderContent={
                () => (
                    <__experimentalLinkControl
                        className="toolbar-item__popover__link-control"
                        value={JSON.parse(linkSettings)}
                        onChange={value => 
                            updateBlockAttributes(clientId, { linkSettings: JSON.stringify(value) })
                        }
                    />
                )
            }
        >
        </Dropdown>
    )
}

/**
 * Favorite
 */
export const Favorite = props => {
    return (
        <Button
            className='toolbar-item toolbar-item__favorite'
        >
            <Icon
                className='toolbar-item__icon'
                icon={toolbarFavorite}
            />
        </Button>
    )
}

/**
 * Delete
 */
export const Delete = props => {
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