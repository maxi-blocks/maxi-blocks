/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '@components/button';

const MaxiClarifyUI = ({ options = [], onSelect, message }) => {
	if (!options.length) {
		return null;
	}

	return (
		<div className='maxi-ai-clarify-container p-4 bg-white rounded-lg shadow-lg border border-gray-200'>
			<p className='text-sm font-medium text-gray-700 mb-4'>
				{message ||
					__(
						'I have a few ideas! Which direction should I take?',
						'maxi-blocks'
					)}
			</p>

			<div className='grid gap-3'>
				{options.map((option, index) => (
					<Button
						key={option.id || option.label || index}
						onClick={() => onSelect?.(option)}
						className='flex flex-col items-start p-3 text-left transition-all border rounded-md hover:border-blue-500 hover:bg-blue-50 group'
					>
						<span className='flex items-center w-full mb-1'>
							<span className='flex items-center justify-center w-6 h-6 mr-2 text-xs font-bold text-blue-600 bg-blue-100 rounded-full group-hover:bg-blue-600 group-hover:text-white'>
								{String.fromCharCode(65 + index)}
							</span>
							<span className='font-semibold text-gray-900'>
								{option.label}
							</span>
						</span>
						{option.description && (
							<span className='text-xs text-gray-500 leading-relaxed'>
								{option.description}
							</span>
						)}
					</Button>
				))}
			</div>

			<Button
				onClick={() => onSelect?.({ id: 'cancel' })}
				className='mt-4 text-xs text-gray-400 hover:text-gray-600 underline w-full text-center'
				isLink
			>
				{__(
					'None of these, let me explain more...',
					'maxi-blocks'
				)}
			</Button>
		</div>
	);
};

export default MaxiClarifyUI;
