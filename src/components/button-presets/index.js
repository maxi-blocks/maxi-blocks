/**
 * Internal Dependencies
 */
import {
	PresetOne,
	PresetTwo,
	PresetThree,
	PresetFour,
	PresetFive,
	PresetSix,
	PresetSeven,
	PresetEight,
} from '../../icons';
import { updateButtonAttributes } from './utils';

/**
 * Styles
 */
import './editor.scss';

const PresetsIcons = props => {
	const { buttonAttributes, onChange } = props;

	return (
		<div className='maxi-button-presets'>
			<div className='maxi-button-presets__icons-group'>
				<span
					className='maxi-button-presets__icon'
					onClick={() =>
						onChange(updateButtonAttributes(buttonAttributes, 1))
					}
				>
					<PresetOne />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() =>
						onChange(updateButtonAttributes(buttonAttributes, 2))
					}
				>
					<PresetTwo />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() =>
						onChange(updateButtonAttributes(buttonAttributes, 3))
					}
				>
					<PresetThree />
				</span>
			</div>

			<div className='maxi-button-presets__icons-group'>
				<span
					className='maxi-button-presets__icon'
					onClick={() =>
						onChange(updateButtonAttributes(buttonAttributes, 4))
					}
				>
					<PresetFour />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() =>
						onChange(updateButtonAttributes(buttonAttributes, 5))
					}
				>
					<PresetFive />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() =>
						onChange(updateButtonAttributes(buttonAttributes, 6))
					}
				>
					<PresetSix />
				</span>
			</div>

			<div className='maxi-button-presets__icons-group'>
				<span
					className='maxi-button-presets__icon'
					onClick={() =>
						onChange(updateButtonAttributes(buttonAttributes, 7))
					}
				>
					<PresetSeven />
				</span>
				<span
					className='maxi-button-presets__icon'
					onClick={() =>
						onChange(updateButtonAttributes(buttonAttributes, 8))
					}
				>
					<PresetEight />
				</span>
			</div>
		</div>
	);
};

export default PresetsIcons;
