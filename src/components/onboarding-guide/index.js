// src/components/onboarding-guide/index.js
import { Guide } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function OnboardingGuide() {
    const [ isOpen, setIsOpen ] = useState( true );

    if ( ! isOpen ) {
        return null;
    }

    return (
        <Guide
            onFinish={ () => setIsOpen( false ) }
            pages={ [
                {
                    content: (
                        <div>
                            <h1>{ __('Step One: Open Master Toolbar', 'maxi-blocks') }</h1>
                            <p>{ __('Click the icon to open the master toolbar.', 'maxi-blocks') }</p>
                            {/* Add a screenshot or icon here */}
                        </div>
                    ),
                },
                {
                    content: (
                        <div>
                            <h1>{ __('Step Two: View Template Library', 'maxi-blocks') }</h1>
                            <p>{ __('View the template library and insert a pattern.', 'maxi-blocks') }</p>
                            {/* Add a screenshot or icon here */}
                        </div>
                    ),
                },
                {
                    content: (
                        <div>
                            <h1>{ __('Step Three: Choose a Style Card', 'maxi-blocks') }</h1>
                            <p>{ __('Browse and save a style card.', 'maxi-blocks') }</p>
                            {/* Add a screenshot or icon here */}
                        </div>
                    ),
                },
                {
                    content: (
                        <div>
                            <h1>{ __('Step Four: Toggle Responsive Views', 'maxi-blocks') }</h1>
                            <p>{ __('Toggle between different responsive views.', 'maxi-blocks') }</p>
                            {/* Add a screenshot or icon here */}
                        </div>
                    ),
                },
                {
                    content: (
                        <div>
                            <h1>{ __('Step Five: Dig Deeper', 'maxi-blocks') }</h1>
                            <p>{ __('Sign in to the Pro library for exclusive patterns. New to WordPress and Gutenberg? Check out the plugin overview and build your first-page guide. Dive deeper with our YouTube playlist. Need help? Visit our helpdesk.', 'maxi-blocks') }</p>
                            <ul>
                                <li><a href="https://help.maxiblocks.com/en/article/how-to-sign-in-to-maxi-blocks-pro-template-library-from-the-wordpress-plugin-jfjhae/">{ __('Sign in to the Pro library', 'maxi-blocks') }</a></li>
                                <li><a href="https://help.maxiblocks.com/en/article/get-started-with-maxi-blocks-1evc7kw/">{ __('Plugin overview', 'maxi-blocks') }</a></li>
                                <li><a href="https://help.maxiblocks.com/en/article/build-your-first-page-bi4jbj/">{ __('Build your first page', 'maxi-blocks') }</a></li>
                                <li><a href="https://www.youtube.com/watch?v=Ea2ETDzfVvk&list=PLyq6BtMKKWud7jkcKsulb_jcvgmH3jcda">{ __('YouTube playlist', 'maxi-blocks') }</a></li>
                                <li><a href="https://help.maxiblocks.com/en/">{ __('Visit our helpdesk', 'maxi-blocks') }</a></li>
                            </ul>
                            <p>{ __('Stay Connected', 'maxi-blocks') }</p>
                            <ul>
                                <li><a href="https://www.youtube.com/@maxiblocks">{ __('YouTube', 'maxi-blocks') }</a></li>
                                <li><a href="https://twitter.com/maxiblocks">{ __('Twitter', 'maxi-blocks') }</a></li>
                                <li><a href="https://maxiblocks.com/go/maxi-discord">{ __('Discord', 'maxi-blocks') }</a></li>
                                <li><a href="https://www.linkedin.com/company/maxi-blocks/">{ __('LinkedIn', 'maxi-blocks') }</a></li>
                                <li><a href="https://www.facebook.com/groups/309152754970143">{ __('Facebook', 'maxi-blocks') }</a></li>
                            </ul>
                        </div>
                    ),
                },
            ] }
        />
    );
}