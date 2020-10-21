/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const { Button, Modal } = wp.components;

/**
 * External dependencies.
 */
import classnames from 'classnames';

/**
 * Internal dependencies.
 */
import jsonData from './fa-icons.json';

const MaxiModalIcon = props => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [iconsList, setIconsList] = useState({});
	const [currentList, setCurrentList] = useState('regular');

	const { onChange } = props;

	const onClick = () => setOpen(!open);

	const fetchFaIcons = async () => {
		const iconsEndpoint =
			'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json';

		const response = await fetch(iconsEndpoint);

		if (response.ok) {
			const data = await response.text();
			const value = {
				value: data,
				timestamp: new Date().getTime(),
			};

			localStorage.setItem('maxi-fa-icons', JSON.stringify(value));

			setIconsState(JSON.parse(data));

			console.log('Icons have been loaded from the API');
		}

		if (!response.ok) {
			const message = `Unable to load icons from github repository: ${response.status}, icons have been loaded from the local backup file`;

			const value = {
				value: JSON.stringify(jsonData),
				timestamp: new Date().getTime(),
			};

			localStorage.setItem('maxi-fa-icons', JSON.stringify(value));

			setIconsState(jsonData);

			console.error(message);
		}
	};

	function setIconsState(icons) {
		const solid = [];
		const brand = [];
		const regular = [];

		Object.keys(icons).forEach(iconName => {
			if (icons[iconName].free.includes('brands')) {
				brand.push({ iconName, content: icons[iconName] });
			}

			if (icons[iconName].free.includes('solid')) {
				solid.push({ iconName, content: icons[iconName] });
			}

			if (icons[iconName].free.includes('regular')) {
				regular.push({ iconName, content: icons[iconName] });
			}
		});

		setIconsList({
			solid,
			regular,
			brand,
		});
	}

	useEffect(() => {
		async function loadIcons() {
			// Check if we have iconsData in localStorage
			const iconsData = localStorage.getItem('maxi-fa-icons');

			if (!iconsData) {
				fetchFaIcons();
				setIsLoading(false);
			} else {
				// Check if the data is expired
				const object = JSON.parse(
					localStorage.getItem('maxi-fa-icons')
				);

				const date = object.timestamp;
				const now = new Date().getTime();
				const day = 1000 * 60 * 60 * 24;

				if (now - date > day) {
					console.log(
						'localStorage Data is Expired, fetching again...'
					);
					fetchFaIcons();
					setIsLoading(false);
				} else {
					console.log('localStorage Data is not expired');
					setIconsState(JSON.parse(object.value));
					setIsLoading(false);
				}
			}
		}
		if (open) loadIcons();
	}, [open]);

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
								<li>
									<button
										type='button'
										onClick={() =>
											setCurrentList('regular')
										}
										className={classnames(
											'maxi-font-icon-control__category-button',
											currentList === 'regular' &&
												'maxi-font-icon-control__category-button--active'
										)}
									>
										Font-Awesome - Regular
									</button>
								</li>
								<li>
									<button
										type='button'
										onClick={() => setCurrentList('solid')}
										className={classnames(
											'maxi-font-icon-control__category-button',
											currentList === 'solid' &&
												'maxi-font-icon-control__category-button--active'
										)}
									>
										Font-Awesome - Solid
									</button>
								</li>
								<li>
									<button
										type='button'
										onClick={() => setCurrentList('brand')}
										className={classnames(
											'maxi-font-icon-control__category-button',
											currentList === 'brand' &&
												'maxi-font-icon-control__category-button--active'
										)}
									>
										Font-Awesome - Brands
									</button>
								</li>
							</ul>
						</div>
						{!isLoading ? (
							<div className='maxi-font-icon-control__icons'>
								{iconsList[currentList].map(icon => (
									<span className='maxi-font-icon-control__card'>
										<i
											className={`fa${currentList.charAt(
												0
											)} fa-${icon.iconName}`}
										/>
										<button
											type='button'
											className='maxi-font-icon-control__insert'
											onClick={() => {
												onChange(
													`fa${currentList.charAt(
														0
													)} fa-${icon.iconName}`
												);
												setOpen(!open);
											}}
										>
											Insert
										</button>
									</span>
								))}
							</div>
						) : (
							<span>Loading...</span>
						)}
					</div>
				</Modal>
			)}
		</Fragment>
	);
	// render END
}; // class MaxiModal END
export default MaxiModalIcon;
