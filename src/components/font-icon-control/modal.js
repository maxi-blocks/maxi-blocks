/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const { Button, Modal } = wp.components;

import jsonData from './fa-icons.json';

const MaxiModalIcon = props => {
	const [open, setOpen] = useState(false);
	const [solidIcons, setSolidIcons] = useState([]);
	const [regularIcons, setRegularIcons] = useState([]);
	const [brandIcons, setBrandIcons] = useState([]);

	const { onChange } = props;

	const onClick = () => setOpen(!open);

	useEffect(async () => {
		/* const response = await fetch(
			'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json'
		);

		if (!response.ok) {
			const message = `An error has occured: ${response.status}`;
			throw new Error(message);
		} */

		const loadData = () => JSON.parse(JSON.stringify(jsonData));

		const icons = loadData();
		const solidIcons = [];
		const brandIcons = [];
		const regularIcons = [];

		Object.keys(icons).forEach(iconName => {
			if (icons[iconName].free.includes('brands')) {
				brandIcons.push({ iconName, content: icons[iconName] });
			}

			if (icons[iconName].free.includes('solid')) {
				solidIcons.push({ iconName, content: icons[iconName] });
			}

			if (icons[iconName].free.includes('regular')) {
				regularIcons.push({ iconName, content: icons[iconName] });
			}
		});

		setSolidIcons(solidIcons);
		setRegularIcons(regularIcons);
		setBrandIcons(brandIcons);
	}, []);

	return (
		<Fragment>
			{/* Launch the layout modal window */}
			<Button onClick={onClick}>
				{__('Choose an icon', 'maxi-blocks')}
			</Button>
			{open && (
				<Modal
					className='maxi-font-icon-control__modal'
					title={__('Maxi Font Icons', 'maxi-blocks')}
					shouldCloseOnEsc
					shouldCloseOnClickOutside={false}
					onRequestClose={onClick}
				>
					<div className='maxi-font-icon-control__main-content'>
						<div className='maxi-font-icon-control__categories'>
							<ul>
								<li>Font-Awesome - Regular</li>
								<li>Font-Awesome - Solid</li>
								<li>Font-Awesome - Brands</li>
							</ul>
						</div>
						<div className='maxi-font-icon-control__icons'>
							{brandIcons.map(icon => (
								<span className='maxi-font-icon-control__card'>
									<i className={`fab fa-${icon.iconName}`} />
									<button
										type='button'
										className='maxi-font-icon-control__insert'
										onClick={() => {
											onChange(`fab fa-${icon.iconName}`);
											setOpen(!open);
										}}
									>
										Insert
									</button>
								</span>
							))}
						</div>
					</div>
				</Modal>
			)}
		</Fragment>
	);
	// render END
}; // class MaxiModal END
export default MaxiModalIcon;
