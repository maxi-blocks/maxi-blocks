/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Icon } = wp.components;

/**
 * External dependencies
 */
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

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

    const classes = `gx-style-tab-setting gx-accordion ${className ? className : ''} ${isPrimary ? 'is-primary' : ''} ${isSecondary ? 'is-secondary' : ''}`;

    return (
        <Accordion
            className={classes}
            allowMultipleExpanded={allowMultipleExpanded}
            allowZeroExpanded={allowZeroExpanded}
            preExpanded={preExpanded}
        >
            {
                items.map(item => {
                    const classes = `gx-accordion-tab ${item.className ? item.className : ''}`;

                    return (
                        <AccordionItem
                            uuid={item.uuid ? item.uuid : null}
                        >
                            <AccordionItemHeading
                                className={classes}
                            >
                                <AccordionItemButton
                                    className='components-base-control__label'
                                >
                                    <Icon 
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