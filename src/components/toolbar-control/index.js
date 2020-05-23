import { Popover } from '@wordpress/components';

import {
    GXComponent,
    __experimentalDraggableBlock
} from '../index';

const Toolbar = props => {
    return (
        <Popover
            noArrow
            animate={false}
            position='top right'
            focusOnMount={false}
            // anchorRef={anchorRef}
            className="block-editor-block-list__block-popover"
            // __unstableSticky={!showEmptyBlockSideInserter}
            __unstableSlotName="block-toolbar"
            __unstableBoundaryParent
            // Allow subpixel positioning for the block movement animation.
            // __unstableAllowVerticalSubpixelPosition={
            //     moverDirection !== 'horizontal' && node
            // }
            // __unstableAllowHorizontalSubpixelPosition={
            //     moverDirection === 'horizontal' && node
            // }
            // onBlur={() => setIsToolbarForced(false)}
            shouldAnchorIncludePadding
        // Popover calculates the width once. Trigger a reset by remounting
        // the component.
        // key={shouldShowContextualToolbar}
        >
            <div id="experimentalToolbar">
                <__experimentalDraggableBlock
                    // clientIds={select('core/block-editor').getSelectedBlockClientIds()}
                    clientIds={[props.clientId]}
                >
                    {
                        ({ isDraggable, onDraggableStart, onDraggableEnd }) => {

                            return (
                                <div
                                    className='please-drag'
                                    draggable={true}
                                    onDragStart={onDraggableStart}
                                    onDragEnd={onDraggableEnd}
                                    style={{
                                        width: '2rem',
                                        height: '2rem',
                                        background: 'red'
                                    }}
                                >
                                </div>
                            )
                        }
                    }
                </__experimentalDraggableBlock>
            </div>
        </Popover>
    );
}

export default Toolbar;