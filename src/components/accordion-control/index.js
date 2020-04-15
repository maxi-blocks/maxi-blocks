/**
 * WordPress dependencies
 */
const { Icon } = wp.components;
const { Component } = wp.element;

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
export default class AccordionControl extends Component {
    state = {
        currentOpen: this.props.preExpanded ? this.props.preExpanded : []
    }

    render() {
        const {
            className,
            allowMultipleExpanded = true,
            allowZeroExpanded = true,
            items,
            isPrimary = false,
            isSecondary = false,
        } = this.props;

        const { 
            currentOpen
        } = this.state;
    
        let classes = classnames('gx-style-tab-setting gx-accordion');
        if(className)
            classes = classnames(classes, className);
        if(isPrimary)
            classes = classnames(classes, 'is-primary');
        if(isSecondary)
            classes = classnames(classes, 'is-secondary');

        const onOpen = value => {
            this.setState({currentOpen: value})
        }
    
        return (
            <Accordion
                className={classes}
                allowMultipleExpanded={allowMultipleExpanded}
                allowZeroExpanded={allowZeroExpanded}
                preExpanded={currentOpen}
                onChange={onOpen}
            >
                {
                    items.map(item => {
                        let classes = 'gx-accordion-tab';
                        if(item.className)
                            classes = classnames(classes, item.className)
    
                        return (
                            <AccordionItem
                                uuid={item.uuid ? item.uuid : undefined} 
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
}