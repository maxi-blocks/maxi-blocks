/**
 * WordPress dependencies
 */
const {
    Fragment,
    useState
} = wp.element;
const {
    Button,
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

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
        disablePadding = false
    } = props;

    const [tab, setTab] = useState(0);

    const classesControl = classnames(
        'maxi-tabs-control',
        !disablePadding ?
            'maxi-tabs-control--disable-padding' :
            ''
    )

    const classesContent = classnames(
        'maxi-tabs-content',
        disablePadding ?
            'maxi-tabs-content--disable-padding' :
            ''
    );

    return (
        <Fragment>
            <div
                className={classesControl}
            >
                {
                    items.map((item, i) => (
                        <Button
                            className='maxi-tabs-control__button'
                            onClick={() => setTab(i)}
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
        </Fragment>
    )
}

export default SettingTabsControl;