/**
 * Internal dependencies
 */
const { Fragment } = wp.element;
const {
    SelectControl,
    RadioControl,
    IconButton,
} = wp.components;
const { useDispatch } = wp.data;
import ToolbarPopover from '../toolbar-popover';
import openSidebar from '../../../../extensions/dom';

/**
 * Icons
 */
import './editor.scss';
import {
    alignLeft,
    alignCenter,
    alignRight,
    toolbarDividerAlign,
    toolbarAdvancedSettings,
} from '../../../../icons';
import { Icon } from '@wordpress/icons';

/**
 * DividerAlignment
 */
const DividerAlignment = props => {
    const {
        blockName,
        lineOrientation,
        lineVertical,
        lineHorizontal,
        onChangeOrientation,
        onChangeVertical,
        onChangeHorizontal,
    } = props;

    if (blockName != 'maxi-blocks/divider-maxi')
        return null;

    const { openGeneralSidebar } = useDispatch(
        'core/edit-post'
    );

    const getHorizontalOptions = () => {
        let options = [];
        options.push({ label: <Icon icon={alignLeft} />, value: 'flex-start' });
        options.push({ label: <Icon icon={alignCenter} />, value: 'center' });
        options.push({ label: <Icon icon={alignRight} />, value: 'flex-end' });

        return options;
    }

    const getVerticalOptions = () => {
        return [
            { label: __('Top', 'maxi-blocks'), value: 'flex-start' },
            { label: __('Center', 'maxi-blocks'), value: 'center' },
            { label: __('Bottom', 'maxi-blocks'), value: 'flex-end' },
        ]
    }

    return (
        <ToolbarPopover
            className='toolbar-item__alignment'
            icon={toolbarDividerAlign}
            content={(
                <Fragment>
                    <div className='toolbar-item__popover__dropdown-options'>
                        <IconButton
                            className='toolbar-item__popover__dropdown-options__advanced-button'
                            icon={toolbarAdvancedSettings}
                            onClick={() =>
                                openGeneralSidebar('edit-post/block')
                                    .then(() => openSidebar('line'))
                            }
                        />
                    </div>
                    <SelectControl
                            label={__('Line Orientation', 'maxi-blocks')}
                            options={[
                                { label: __('Horizontal', 'maxi-blocks'), value: 'horizontal' },
                                { label: __('Vertical', 'maxi-blocks'), value: 'vertical' },
                            ]}
                            value={lineOrientation}
                            onChange={(value) => onChangeOrientation(value) }
                        />
                        {
                            ( lineOrientation === 'vertical' ) &&
                                <SelectControl
                                    label={__('Vertical Position', 'maxi-blocks')}
                                    options={getVerticalOptions()}
                                    value={lineVertical}
                                    onChange={(value) => onChangeVertical(value) }
                                />
                        }
                        {
                            ( lineOrientation === 'horizontal' ) &&
                                <RadioControl
                                    className='maxi-alignment-control'
                                    selected={lineHorizontal}
                                    options={getHorizontalOptions()}
                                    onChange={(value) => onChangeHorizontal(value) }
                                />
                        }
                    </Fragment>
            )}
        />
    )
}

export default DividerAlignment;