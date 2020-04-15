/**
 * WordPress dependencies
 */
const { Icon } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

/**
 * Styles
 */
import './editor.scss';

/**
 * Block
 */
const AccordionControl = props => {
    const {
        className,
        allowMultipleExpanded = true,
        allowZeroExpanded = true,
        preExpanded = [],
        items,
        isPrimary = false,
        isSecondary = false
    } = props;

    let classes = classnames('gx-style-tab-setting gx-accordion');
    if(className)
        classes = classnames(classes, className);
    if(isPrimary)
        classes = classnames(classes, 'is-primary');
    if(isSecondary)
        classes = classnames(classes, 'is-secondary');

    return (
        <Accordion
            className={classes}
            allowMultipleExpanded={allowMultipleExpanded}
            allowZeroExpanded={allowZeroExpanded}
            preExpanded={preExpanded}
        >
            {
                items.map(item => {
                    let classes = 'gx-accordion-tab';
                    if(item.className)
                        classes = classnames(classes, item.className)

                    return (
                        <AccordionItem
                            uuid={item.uuid ? item.uuid : Math.random() * 1000}
                        >
                            <AccordionItemHeading
                                className={classes}
                            >
                                <AccordionItemButton
                                    className='components-base-control__label'
                                >
                                    <Icon 
                                        className='gx-accordion-icon'
                                        icon={item.icon}
                                    />
                                    {item.label}
                                </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                                {item.content}
                            </AccordionItemPanel>
                        </AccordionItem>
                    )
                })
            }
        </Accordion>
    )
}

export default AccordionControl;