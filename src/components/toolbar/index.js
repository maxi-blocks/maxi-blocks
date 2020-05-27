/**
 * WordPress dependencies
 */
const { Popover } = wp.components;
const { useBlockEditContext } = wp.blockEditor;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { __experimentalDraggableBlock } from '../index';

/**
 * Utils
 */
import {
    DragAndDrop,
    ColumnPattern,
    Duplicate,
    Link,
    Favorite,
    Delete,
    TextColor,
    TextLevel,
    TextOptions,
    PaddingMargin
} from './utils/index';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const MaxiToolbar = props => {
    const {
        clientId,
        isSelected
    } = useBlockEditContext();

    const anchorRef = document.getElementById(`block-${clientId}`)

    return (
        <Fragment>
            {
                isSelected &&
                <Popover
                    noArrow
                    animate={false}
                    position='top right'
                    focusOnMount={false}
                    anchorRef={anchorRef}
                    className="maxi-toolbar__popover"
                >
                    <div
                        className='toolbar-wrapper'
                    >
                        <DragAndDrop
                            clientId={clientId}
                        />
                        <TextOptions
                            clientId={clientId}
                        />
                        <TextColor
                            clientId={clientId}
                        />
                        <TextLevel
                            clientId={clientId}
                        />
                        <ColumnPattern
                            clientId={clientId}
                        />
                        <Duplicate
                            clientId={clientId}
                        />
                        <Link
                            clientId={clientId}
                        />
                        <PaddingMargin
                            clientId={clientId}
                        />
                        <Favorite
                            clientId={clientId}
                        />
                        <Delete
                            clientId={clientId}
                        />
                    </div>
                </Popover>
            }
        </Fragment>
    )
}

export default MaxiToolbar;