/**
 * Internal dependencies
 */
import Icon from '@components/icon';
import AccordionItemHeading from './AccordionItemHeading';
import AccordionItemButton from './AccordionItemButton';
import AccordionItemPanel from './AccordionItemPanel';

const AccordionItem = props => {
	const {
		headingClassName,
		panelClassName,
		className,
		label,
		icon,
		content,
		isExpanded,
		toggleExpanded,
		uuid,
		buttonClassName,
		'data-name': dataName,
	} = props;

	return (
		<div className={className} data-name={dataName}>
			<AccordionItemHeading className={headingClassName}>
				<AccordionItemButton
					className={buttonClassName}
					toggleExpanded={toggleExpanded}
					uniqueId={uuid}
					isExpanded={isExpanded}
				>
					<Icon className='maxi-accordion-icon' icon={icon} />
					{label}
				</AccordionItemButton>
			</AccordionItemHeading>
			<AccordionItemPanel
				className={panelClassName}
				isHidden={!isExpanded}
			>
				{typeof content === 'function' ? content() : content}
			</AccordionItemPanel>
		</div>
	);
};

export default AccordionItem;
