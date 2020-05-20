/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    Fragment,
    useState
} = wp.element;
const {
    Button,
    Icon
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

    const { items } = props;

    const [tab, setTab] = useState(0);

    const classesContent = classnames(
        "maxi-tabs-content",
        items[tab].disableStyles ?
            'disable-styles' :
            ''
    );

    return (
        <Fragment>
            <div
                className="maxi-tabs-control"
            >
                {
                    items.map((item, i) => {
                        console.log(tab.label === item.label)

                        return (
                            <Button
                                className="maxi-tab-control"
                                onClick={() => setTab(i)}
                                aria-pressed={tab === i}
                            >
                                <Icon
                                    icon={item.icon}
                                />
                                {item.label}
                            </Button>
                        )
                    })
                }
            </div>
            <div
                className={classesContent}
            >
                {
                    items.map((item, i) => {
                        const classesItemContent = classnames(
                            "maxi-tab-content",
                            tab === i ?
                                'is-selected' :
                                '',
                            item.disableStyles ?
                                'disable-styles' :
                                ''
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