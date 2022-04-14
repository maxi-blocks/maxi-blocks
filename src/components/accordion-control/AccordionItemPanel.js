const AccordionItemPanel = props => {
	const { children, className, isHidden } = props;

	return (
		<>
			{!isHidden && (
				<div
					className={className}
					data-accordion-component='AccordionItemPanel'
				>
					{children}
				</div>
			)}
		</>
	);
};

export default AccordionItemPanel;
