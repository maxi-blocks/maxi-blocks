/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button, SelectControl } = wp.components;
const { Fragment } = wp.element;
const { useState } = wp.element;
const { useSelect, useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import { __experimentalFancyRadioControl } from '../../components';

/**
 * External dependencies
 */
import { isEmpty, uniqueId, forIn } from 'lodash';

/**
 * Component
 */
const TimelinePresets = props => {
	const { interaction, onChange } = props;

	const [presetName, setPresetName] = useState('');
	const [presetLoad, setPresetLoad] = useState('');
	const { saveMaxiMotionPresets } = useDispatch('maxiBlocks');

	const { presets } = useSelect(select => {
		const { receiveMaxiMotionPresets } = select('maxiBlocks');

		return {
			presets: receiveMaxiMotionPresets(),
		};
	});

	const getPresets = () => {
		switch (typeof presets) {
			case 'string':
				if (!isEmpty(presets)) return JSON.parse(presets);
				return {};
			case 'object':
				return presets;
			case 'undefined':
				return {};
			default:
				return {};
		}
	};

	const getPresetsOptions = () => {
		const presetArr = [
			{ label: __('Select your preset', 'maxi-blocks'), value: '' },
		];

		forIn(getPresets(), (value, key) =>
			presetArr.push({ label: value.name, value: key })
		);
		return presetArr;
	};

	return (
		<div className='maxi-motion-control__preset'>
			<__experimentalFancyRadioControl
				label={__('Preset', 'maxi-blocks')}
				selected={interaction.presetStatus}
				options={[
					{
						label: __('Yes', 'maxi-blocks'),
						value: 1,
					},
					{
						label: __('No', 'maxi-blocks'),
						value: 0,
					},
				]}
				onChange={val => {
					interaction.presetStatus = Number(val);
					onChange(interaction);
				}}
			/>
			{!!interaction.presetStatus && (
				<Fragment>
					{getPresetsOptions().length > 1 && (
						<div className='maxi-motion-control__preset__load'>
							<SelectControl
								value={presetLoad}
								options={getPresetsOptions()}
								onChange={val => setPresetLoad(val)}
							/>
							<Button
								disabled={isEmpty(presetLoad)}
								onClick={() => {
									interaction.timeline = {
										...getPresets()[presetLoad].preset,
									};

									onChange(interaction);
									setPresetLoad('');
								}}
							>
								{__('Load Preset', 'maxi-blocks')}
							</Button>
						</div>
					)}
					<div className='maxi-motion-control__preset__save'>
						<input
							type='text'
							placeholder={__(
								'Add your Preset Name here',
								'maxi-blocks'
							)}
							value={presetName}
							onChange={e => setPresetName(e.target.value)}
						/>
						<Button
							disabled={isEmpty(presetName)}
							onClick={() => {
								saveMaxiMotionPresets({
									...JSON.parse(presets),
									[uniqueId('preset_')]: {
										name: presetName,
										preset: {
											...interaction.timeline,
										},
									},
								});

								setPresetName('');
							}}
						>
							{__('Save Preset', 'maxi-blocks')}
						</Button>
					</div>
				</Fragment>
			)}
			<hr />
		</div>
	);
};
export default TimelinePresets;
