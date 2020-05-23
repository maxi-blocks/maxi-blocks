/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { withSelect, select } = wp.data;
const {
    BlockMover,
    BlockDraggable
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
    GXComponent,
    __experimentalDraggableBlock
} from '../index';

/**
 * Component
 */
class ToolbarControl extends GXComponent {

    render() {

        return (
            <div id="experimentalToolbar">
                <__experimentalDraggableBlock
                    // clientIds={select('core/block-editor').getSelectedBlockClientIds()}
                    clientIds={[this.props.clientId]}
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
        )
    }
}

export default withSelect( (select) => {
    const test = select('core/block-editor').getSelectedBlockClientIds();

    return {
        test
    }
})(ToolbarControl);