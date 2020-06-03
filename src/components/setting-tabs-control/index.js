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

    const { items } = props;

    const [tab, setTab] = useState(0);

    const classesContent = classnames('maxi-tabs-content');

    return (
        <Fragment>
            <div
                className='maxi-tabs-control'
            >
                {
                    items.map((item, i) => (
                        <Button
                            className='maxi-tab-control__button'
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