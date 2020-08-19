/**
 * Internal dependencies
 */
const { Fragment } = wp.element;
const { __ } = wp.i18n;
const {
    SelectControl,
    RadioControl,
} = wp.components;
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import './editor.scss';
import {
    alignLeft,
    alignCenter,
    alignRight,
    toolbarDividerAlign,
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
            tooltip={__('Divider aligment', 'maxi-blocks')}
            icon={toolbarDividerAlign}
            advancedOptions='line'
            content={(
                <div className='toolbar-item__popover__alignment'>
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
                </div>
            )}
        />
    )
}

export default DividerAlignment;