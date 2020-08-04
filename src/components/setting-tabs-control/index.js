/**
 * WordPress dependencies
 */
const { useState } = wp.element;
const {
    Button,
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const SettingTabsControl = props => {

    const {
        items,
        disablePadding = false,
        selectedTab = 0,
        className,
        onChange
    } = props;

    const [tab, setTab] = useState(selectedTab);

    const classes = classnames(
        'maxi-settingstab-control',
        className
    )

    const classesControl = classnames(
        'maxi-tabs-control',
        !disablePadding ?
            'maxi-tabs-control--disable-padding' :
            null
    )

    const classesContent = classnames(
        'maxi-tabs-content',
        disablePadding ?
            'maxi-tabs-content--disable-padding' :
            null
    );

    return (
        <div className={classes}>
            <div
                className={classesControl}
            >
                {
                    items.map((item, i) => (
                        <Button
                            className='maxi-tabs-control__button'
                            onClick={() => {
                                if(!isNil(onChange))
                                    onChange(item.label);
                                setTab(i);
                            }}
                            aria-pressed={tab === i}
                        >
                            {item.label}
                        </Button>
                    ))
                }
            </div>
            <div
                className={classesContent}
            >
                {
                    items.map((item, i) => {
                        const classesItemContent = classnames(
                            'maxi-tab-content',
                            tab === i ? 'maxi-tab-content--selected' : ''
                        )

                        return (
                            <div
                                className={classesItemContent}
                            >
                                {item.content}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SettingTabsControl;