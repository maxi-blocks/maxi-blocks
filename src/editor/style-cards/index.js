const { __, sprintf } = wp.i18n;

const { select, useSelect, useDispatch } = wp.data;
const { withState } = wp.compose;
const { Fragment, useState } = wp.element;

const { Button, SelectControl, Popover, Icon } = wp.components;

import { isEmpty, forIn } from 'lodash';
import { main } from '../../icons';
import './editor.scss';

const MaxiStyleCardsEditor = withState({
	isVisible: false,
})(({ isVisible, setState }) => {
	const toggleVisible = () => {
		setState(state => ({ isVisible: !state.isVisible }));
	};

	const { isRTL } = select('core/editor').getEditorSettings();

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
			<Button
				id='maxi-button__go-to-customizer'
				className='button maxi-button maxi-button__toolbar'
				aria-label='Style Cards'
				onClick={toggleVisible}
			>
				<Icon icon={main} />
				{__('Style Cards', 'maxi-blocks')}
			</Button>
			{isVisible && (
				<Popover
					noArrow
					position={isRTL ? 'top left right' : 'top right left'}
					className='maxi-style-cards__popover'
					focusOnMount
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
								{/*onChange({
									...getStyleCards()[styleCardLoad].styleCard,
								});*/}
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
				</Popover>
			)}
		</Fragment>
	);
});

export default MaxiStyleCardsEditor;
