const { __, sprintf } = wp.i18n;

const { registerPlugin } = wp.plugins;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { useState } = wp.element;
const { useSelect, useDispatch } = wp.data;

const { Button, SelectControl } = wp.components;

import { isEmpty, forIn } from 'lodash';
import { AdminSettings } from '@wordpress/icons';
import { Fragment } from '@wordpress/element';

const PluginSidebarMoreMenuItemStyleCards = props => {
	const { onChange } = props;
	const [styleCardName, setStyleCardName] = useState('');
	const [styleCardLoad, setStyleCardLoad] = useState('');
	const { saveMaxiStyleCards } = useDispatch('maxiBlocks');

	const { styleCards } = useSelect(select => {
		const { receiveMaxiStyleCards } = select('maxiBlocks');

		return {
			styleCards: receiveMaxiStyleCards(),
		};
	});

	const getStyleCards = () => {
		switch (typeof styleCards) {
			case 'string':
				if (!isEmpty(styleCards)) return JSON.parse(styleCards);
				return {};
			case 'object':
				return styleCards;
			case 'undefined':
				return {};
			default:
				return {};
		}
	};

	const getStyleCardsOptions = () => {
		const styleCardsArr = [
			{ label: __('Select Style Card', 'maxi-blocks'), value: '' },
		];

		forIn(getStyleCards(), (value, key) =>
			styleCardsArr.push({ label: value.name, value: key })
		);
		return styleCardsArr;
	};

	return (
		<Fragment>
			<PluginSidebarMoreMenuItem
				target='maxi-blocks--customizer-sidebar'
				icon={AdminSettings}
			>
				Style Card Editor
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name='maxi-blocks--customizer-sidebar'
				icon={AdminSettings}
				title='Style Card Editor'
			>
				<div className='maxi-style-cards__card__load'>
					<SelectControl
						value={styleCardLoad}
						options={getStyleCardsOptions()}
						onChange={val => setStyleCardLoad(val)}
					/>
					<Button
						disabled={isEmpty(styleCardLoad)}
						onClick={() => {
							onChange({
								...getStyleCards()[styleCardLoad].styleCard,
							});
							setStyleCardLoad('');
						}}
					>
						{__('Load', 'maxi-blocks')}
					</Button>
					<Button
						className='maxi-style-cards-control__preset__load--delete'
						disabled={isEmpty(styleCardLoad)}
						onClick={() => {
							const newStyleCards = {
								...getStyleCards(),
							};

							if (
								window.confirm(
									sprintf(
										__(
											'Are you sure to delete "%s" style card?',
											'maxi-blocks'
										),
										getStyleCards()[styleCardLoad].name
									)
								)
							) {
								delete newStyleCards[styleCardLoad];
								saveMaxiStyleCards(newStyleCards);
								setStyleCardLoad('');
							}
						}}
					>
						{__('Delete', 'maxi-blocks')}
					</Button>
				</div>
				<div className='maxi-style-cards-control__preset__save'>
					<input
						type='text'
						placeholder={__(
							'Add your Style Card Name here',
							'maxi-blocks'
						)}
						value={styleCardName}
						onChange={e => setStyleCardName(e.target.value)}
					/>
					<Button
						disabled={isEmpty(styleCardName)}
						onClick={() => {
							if (isEmpty(styleCards)) {
								saveMaxiStyleCards({
									[`sc_${new Date().getTime()}`]: {
										name: styleCardName,
										status: '',
										styleCard: {
										},
									},
								});
							} else {
								saveMaxiStyleCards({
									...getStyleCards(),
									[`sc_${new Date().getTime()}`]: {
										name: styleCardName,
										status: '',
										styleCard: {
										},
									},
								});
							}

							setStyleCardName('');
						}}
					>
						{__('Save Style Card', 'maxi-blocks')}
					</Button>
				</div>
			</PluginSidebar>
		</Fragment>
	);
};

// registerPlugin('maxi-blocks-customizer-sidebar', {
// 	render: PluginSidebarMoreMenuItemStyleCards,
// });
