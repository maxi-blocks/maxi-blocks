<?php

/**
 * Intellectual Property rights, and copyright, reserved by Todd Lahman, LLC as allowed by law include,
 * but are not limited to, the working concept, function, and behavior of this software,
 * the logical code structure and expression as written.
 *
 * @package     WooCommerce API Manager plugin and theme library
 * @author      Todd Lahman LLC https://www.toddlahman.com/
 * @copyright   Copyright (c) Todd Lahman LLC (support@toddlahman.com)
 * @since       1.0
 * @license     http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$report_for_email = '';


if ( ! class_exists( 'gx_layout_library_Main' ) ) {
	class gx_layout_library_Main {

		/**
		 * Class args.
		 *
		 * @var string
		 */
		public $file             = '';
		public $software_title   = '';
		public $software_version = '';
		public $plugin_or_theme  = '';
		public $api_url          = '';
		public $data_prefix      = '';
		public $slug             = '';
		public $plugin_name      = '';
		public $text_domain      = '';
		public $extra            = '';

		/**
		 * @var null
		 */
		protected static $_instance = null;

		/**
		 * @param string $file             Must be $this->file from the root plugin file, or theme functions file.
		 * @param string $software_title   Must be exactly the same as the Software Title in the product.
		 * @param string $software_version This products current software version.
		 * @param string $plugin_or_theme  'plugin' or 'theme'
		 * @param string $api_url          The URL to the site that is running the API Manager. Example: https://www.toddlahman.com/ Must have a trailing slash.
		 * @param string $text_domain      The text domain for translation. Hardcoding this string is preferred rather than using this argument.
		 * @param string $extra            Extra data. Whatever you want.
		 *
		 * @return \AM_License_Menu|null
		 */
		public static function instance( $file, $software_title, $software_version, $plugin_or_theme, $api_url, $text_domain = '', $extra = '' ) {
			if ( is_null( self::$_instance ) ) {
				self::$_instance = new self( $file, $software_title, $software_version, $plugin_or_theme, $api_url, $text_domain, $extra );
			}

			return self::$_instance;
		}

		public function __construct( $file, $software_title, $software_version, $plugin_or_theme, $api_url, $text_domain, $extra ) {
			$this->file            = $file;
			$this->software_title  = $software_title;
			$this->version         = $software_version;
			$this->plugin_or_theme = $plugin_or_theme;
			$this->api_url         = $api_url;
			$this->text_domain     = $text_domain;
			$this->extra           = $extra;
			$this->data_prefix     = str_ireplace( array( ' ', '_', '&', '?' ), '_', strtolower( $this->software_title ) );

			if ( is_admin() ) {
				
                register_activation_hook( $this->file, array( $this, 'activation' ) );

				add_action( 'admin_menu', array( $this, 'gx_layout_library_register_menu' ) );

				
				$this->ame_software_product_id = $this->software_title;

				$this->ame_deactivate_checkbox         = $this->data_prefix . '_deactivate_checkbox';
				$this->ame_activation_tab_key          = $this->data_prefix . '_dashboard';
				$this->ame_deactivation_tab_key        = $this->data_prefix . '_deactivation';
				$this->ame_settings_menu_title         = $this->software_title;
				$this->ame_plugin_name       = $this->plugin_or_theme == 'plugin' ? untrailingslashit( plugin_basename( $this->file ) ) : get_stylesheet(); 
				$this->ame_domain           = str_ireplace( array( 'http://', 'https://' ), '', home_url() ); // blog domain name
				$this->ame_software_version = $this->version; // The software version
				//$options                    = get_option( $this->ame_data_key );

			}
		}

		/**
		 * Register submenu specific to this product.
		 */
		public function gx_layout_library_register_menu() {
            add_menu_page( __( $this->ame_settings_menu_title, $this->text_domain ), __( $this->ame_settings_menu_title, $this->text_domain ), 'manage_options', $this->ame_activation_tab_key, array(
             $this,
             'gx_layout_library_config_page'
            ), plugins_url( 'gx_layout_library/include/gx_layout_library-icon.png' ) );

		}

    /** 
    * Generate report
    */

    /**
     * helper function for number conversions
     *
     * @access public
     * @param mixed $v
     * @return void
     */
    public function gx_layout_library_num_convt( $v ) {
        $l   = substr( $v, -1 );
        $ret = substr( $v, 0, -1 );

        switch ( strtoupper( $l ) ) {
            case 'P': 
            case 'T': 
            case 'G': 
            case 'M': 
            case 'K': 
                $ret *= 1024;
                break;
            default:
                break;
        }

        return $ret;
    }

    public function gx_layout_library_report_data($warning_flag) {

        // call WP database
        global $wpdb;

        // data checks for later
    
        $mu_plugins = get_mu_plugins();
        $plugins    = get_plugins();
        $active     = get_option( 'active_plugins', array() );

        $theme_data = wp_get_theme();
        $theme      = $theme_data->Name . ' ' . $theme_data->Version;
        $style_parent_theme = wp_get_theme(get_template());
        $parent_theme = $style_parent_theme->get( 'Name' )." ".$style_parent_theme->get( 'Version' );
        //print_r($theme_data);

        // multisite details
        $nt_plugins = is_multisite() ? wp_get_active_network_plugins() : array();
        $nt_active  = is_multisite() ? get_site_option( 'active_sitewide_plugins', array() ) : array();
        $ms_sites   = is_multisite() ? get_blog_list() : null;

        // yes / no specifics
        $ismulti    = is_multisite() ? __( 'Yes', 'gx_layout_library-report' ) : __( 'No', 'gx_layout_library-report' );
        $safemode   = ini_get( 'safe_mode' ) ? __( 'Yes', 'gx_layout_library-report' ) : __( 'No', 'gx_layout_library-report' );
        $wpdebug    = defined( 'WP_DEBUG' ) ? WP_DEBUG ? __( 'Enabled', 'gx_layout_library-report' ) : __( 'Disabled', 'gx_layout_library-report' ) : __( 'Not Set', 'gx_layout_library-report' );
        $errdisp    = ini_get( 'display_errors' ) != false ? __( 'On', 'gx_layout_library-report' ) : __( 'Off', 'gx_layout_library-report' );

        $jquchk     = wp_script_is( 'jquery', 'registered' ) ? $GLOBALS['wp_scripts']->registered['jquery']->ver : __( 'n/a', 'gx_layout_library-report' );

        $sessenb    = isset( $_SESSION ) ? __( 'Enabled', 'gx_layout_library-report' ) : __( 'Disabled', 'gx_layout_library-report' );
        $usecck     = ini_get( 'session.use_cookies' ) ? __( 'On', 'gx_layout_library-report' ) : __( 'Off', 'gx_layout_library-report' );
        $hascurl    = function_exists( 'curl_init' ) ? __( 'Supports cURL.', 'gx_layout_library-report' ) : __( 'Does not support cURL.', 'gx_layout_library-report' );
        $openssl    = extension_loaded('openssl') ? __( 'OpenSSL installed.', 'gx_layout_library-report' ) : __( 'OpenSSL not installed.', 'gx_layout_library-report' );

        // language

        $site_lang = get_bloginfo('language');
        if (is_rtl()) $site_text_dir = 'rtl';
            else $site_text_dir = 'ltr';

        // start generating report

        $report = '<div id="gx_layout_library-report">';
        $report .= '<h2>Understanding The System Status Report</h2>';
        $report .= '<p><h4>Self Help</h4> The system report contains useful technical information to predict problems. If you see an orange "Warning" notice, it can indicate a potential issue. To ensure optimal performance of the plugin, please work with your hosting company support. Update server settings to match the "Recommended Values" tab. You can take a screenshot or copy/paste the recommended and actual values and ask your hosting company to update the setting/s for you. </p>';
        $report .= '<input data-clipboard-action="copy" data-clipboard-target="#gx_layout_library-report-textarea" id="gx_layout_library-copy-report" type="button" value="Copy Report to Clipboard" class="et-core-modal-action">';
        $report .= '<p id="gx_layout_library-success-report" class="notice notice-success" style="max-width: 150px; margin-top: 10px; margin-bottom: 0;">Done: Copied to clipboard</p>';
        $report .= '<textarea readonly="readonly" id="gx_layout_library-report-textarea" name="gx_layout_library-report-textarea" style="width:0; height: 0; margin 0; padding: 0 !important; margin-top: -15px; position: absolute; z-index: -1; ">';
        $report .= '====== BEGIN REPORT ======'."\n";

        $report .= "\n".'--- WORDPRESS DATA ---'."\n";
        $report .= 'Multisite:'." ".$ismulti."\n";
        $report .= 'SITE_URL:'." ".site_url()."\n";
        $report .= 'HOME_URL:'." ".home_url()."\n";
        $report .= 'WP Version:'." ".get_bloginfo( 'version' )."\n";
        $report .= 'Permalink:'." ".get_option( 'permalink_structure' )."\n";
        $report .= 'Current Theme:'." ".$theme."\n";
        $report .= 'Parent Theme:'." ".$parent_theme."\n";

        $report .= "\n".'--- WORDPRESS CONFIG ---'."\n";
        $report .= 'WP_DEBUG:'." ".$wpdebug."\n";
        $report .= 'WP Memory Limit:'." ".$this->gx_layout_library_num_convt( WP_MEMORY_LIMIT )/( 1024 ).'MB'."\n";
        $report .= 'jQuery Version:'." ".$jquchk."\n";
        $report .= 'Site Language:'." ".$site_lang."\n";
        $report .= 'Site Text Direction:'." ".$site_text_dir."\n";

        if ( is_multisite() ) :
            $report .= "\n".'--- MULTISITE INFORMATION ---'."\n";
            $report .= 'Total Sites:'." ".get_blog_count()."\n";
            $report .= 'Base Site:'." ".$ms_sites[0]['domain']."\n";
            $report .= 'All Sites:'."\n";
            foreach ( $ms_sites as $site ) :
                if ( $site['path'] != '/' )
                    $report .= " ".'- '. $site['domain'].$site['path']."\n";

            endforeach;
            $report .= "\n";
        endif;

        $report .= "\n".'--- SERVER DATA ---'."\n";
        $report .= 'PHP Version:'." ".PHP_VERSION."\n";
        $report .= 'Server Software:'." ".$_SERVER['SERVER_SOFTWARE']."\n";

        $report .= "\n".'--- PHP CONFIGURATION ---'."\n";
        $report .= 'Safe Mode:'." ".$safemode."\n";
        $report .= 'memory_limit:'." ".ini_get( 'memory_limit' )."\n";
        $report .= 'upload_max_filesize:'." ".ini_get( 'upload_max_filesize' )."\n";
        $report .= 'post_max_size:'." ".ini_get( 'post_max_size' )."\n";
        $report .= 'max_execution_time:'." ".ini_get( 'max_execution_time' )."\n";
        $report .= 'max_input_vars:'." ".ini_get( 'max_input_vars' )."\n";
        $report .= 'max_input_time:'." ".ini_get( 'max_input_time' )."\n";
        $report .= 'Display Errors:'." ".$errdisp."\n";
        $report .= 'Cookie Path:'." ".esc_html( ini_get( 'session.cookie_path' ) )."\n";
        $report .= 'Save Path:'." ".esc_html( ini_get( 'session.save_path' ) )."\n";
        $report .= 'Use Cookies:'." ".$usecck."\n";
        $report .= 'cURL:'." ".$hascurl."\n";
        $report .= 'OpenSSL:'." ".$openssl."\n";

        $report .= "\n".'--- PLUGIN INFORMATION ---'."\n";
        if ( $plugins && $mu_plugins ) :
            $report .= 'Total Plugins:'." ".( count( $plugins ) + count( $mu_plugins ) + count( $nt_plugins ) )."\n";
        endif;

        // output must-use plugins
        if ( $mu_plugins ) :
            $report .= 'Must-Use Plugins: ('.count( $mu_plugins ).')'. "\n";
            foreach ( $mu_plugins as $mu_path => $mu_plugin ) :
                $report .= "\t".'- '.$mu_plugin['Name'] . ' ' . $mu_plugin['Version'] ."\n";
            endforeach;
            $report .= "\n";
        endif;

        // if multisite, grab active network as well
        if ( is_multisite() ) :
            // active network
            $report .= 'Network Active Plugins: ('.count( $nt_plugins ).')'. "\n";

            foreach ( $nt_plugins as $plugin_path ) :
                if ( array_key_exists( $plugin_base, $nt_plugins ) )
                    continue;

                $plugin = get_plugin_data( $plugin_path );

                $report .= "\t".'- '.$plugin['Name'] . ' ' . $plugin['Version'] ."\n";
            endforeach;
            $report .= "\n";

        endif;

        // output active plugins
        if ( $plugins ) :
            $report .= 'Active Plugins: ('.count( $active ).')'. "\n";
            foreach ( $plugins as $plugin_path => $plugin ) :
                if ( ! in_array( $plugin_path, $active ) )
                    continue;
                $report .= "\t".'- '.$plugin['Name'] . ' ' . $plugin['Version'] ."\n";
            endforeach;
            $report .= "\n";
        endif;

        // output inactive plugins
        if ( $plugins ) :
            $report .= 'Inactive Plugins: ('.( count( $plugins ) - count( $active ) ).')'. "\n";
            foreach ( $plugins as $plugin_path => $plugin ) :
                if ( in_array( $plugin_path, $active ) )
                    continue;
                $report .= "\t".'- '.$plugin['Name'] . ' ' . $plugin['Version'] ."\n";
            endforeach;
            $report .= "\n";
        endif;

        // end it all
        $report .= "\n".'====== END REPORT ======';

        $GLOBALS['$report_for_email'] = strstr(str_replace("\n", "      ", $report), '====== BEGIN REPORT');
        $report .= '</textarea></div>';

        $gx_layout_library_warning_status = '<td class="gx_layout_library_warning"><span>Warning</span></td>';
        $gx_layout_library_ok_status = '<td class="gx_layout_library_ok"><span>OK</span></td>';

        $report_table = '';

        $report_table .= '<table class="gx_layout_library-report-table"><tr><th colspan="4">Server Environment</th><tr class="gx_layout_library-header-row"><td>Config Option</td><td>Recommended Value</td><td>Actual Value</td><td>Status</td></tr>';

        $report_table .= '<tr><td>PHP Version</td><td>5.2+ (7.0+ is better)</td><td>'.PHP_VERSION.'</td>';
        if((int)str_replace(".", "",PHP_VERSION) >= 52) $gx_layout_library_php_status = $gx_layout_library_ok_status;
            else $gx_layout_library_php_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_php_status.'</tr>';

        $report_table .= '<tr><td>Server Software</td><td>-</td><td>'.$_SERVER['SERVER_SOFTWARE'].'</td>'.$gx_layout_library_ok_status.'</tr>';

        $report_table .= '<tr><td>Safe Mode</td><td>No</td><td>'.$safemode.'</td>';
        if($safemode == 'No') $gx_layout_library_safe_mode_status = $gx_layout_library_ok_status;
            else $gx_layout_library_safe_mode_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_safe_mode_status.'</tr>';

        $report_table .= '<tr><td>memory_limit</td><td>256+ MB</td><td>'.ini_get( 'memory_limit' ).'B</td>';
        if((int)str_replace("M", "",ini_get( 'memory_limit' )) >= 256) $gx_layout_library_memory_limit_status = $gx_layout_library_ok_status;
            else $gx_layout_library_memory_limit_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_memory_limit_status.'</tr>';

        $report_table .= '<tr><td>post_max_size</td><td>64+ MB</td><td>'.ini_get( 'post_max_size' ).'B</td>';
        if((int)str_replace("M", "",ini_get( 'post_max_size' )) >= 64) $gx_layout_library_post_max_size_status = $gx_layout_library_ok_status;
            else $gx_layout_library_post_max_size_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_post_max_size_status.'</tr>';

        $report_table .= '<tr><td>max_execution_time</td><td>60+</td><td>'.ini_get( 'max_execution_time' ).'</td>';
        if((int)ini_get( 'max_execution_time') >= 60) $gx_layout_library_max_execution_time_status = $gx_layout_library_ok_status;
            else $gx_layout_library_max_execution_time_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_max_execution_time_status.'</tr>';

         $report_table .= '<tr><td>upload_max_filesize</td><td>64+ MB</td><td>'.ini_get( 'upload_max_filesize' ).'B</td>';
        if((int)str_replace("M", "",ini_get( 'upload_max_filesize' )) >= 64) $gx_layout_library_upload_max_status = $gx_layout_library_ok_status;
            else $gx_layout_library_upload_max_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_upload_max_status.'</tr>';

        $report_table .= '<tr><td>max_input_time</td><td>60+</td><td>'.ini_get( 'max_input_time' ).'</td>';
        if((int)ini_get( 'max_input_time') >= 60) $gx_layout_library_max_input_time_status = $gx_layout_library_ok_status;
            else $gx_layout_library_max_input_time_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_max_input_time_status.'</tr>';

        $report_table .= '<tr><td>max_input_vars</td><td>1000+</td><td>'.ini_get( 'max_input_vars' ).'</td>';
        if((int)ini_get( 'max_input_vars') >= 1000) $gx_layout_library_max_input_vars_status = $gx_layout_library_ok_status;
            else $gx_layout_library_max_input_vars_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_max_input_vars_status.'</tr>';

        $report_table .= '<tr><td>Display Errors</td><td>Off</td><td>'.$errdisp.'</td>';
        if($errdisp == 'Off') $gx_layout_library_display_errors_status = $gx_layout_library_ok_status;
            else $gx_layout_library_display_errors_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_display_errors_status.'</tr>';

        $report_table .= '<tr><td>Cookie Path</td><td>-</td>'.'<td>'.esc_html( ini_get( 'session.cookie_path' ) ).'</td>'.$gx_layout_library_ok_status.'</tr>';

        $report_table .= '<tr><td>Save Path</td><td>-</td>'.'<td>'.esc_html( ini_get( 'session.save_path' ) ).'</td>'.$gx_layout_library_ok_status.'</tr>';

        $report_table .= '<tr><td>Use Cookies</td><td>On</td><td>'.$usecck.'</td>';
        if($usecck == 'On') $gx_layout_library_use_cookies_status = $gx_layout_library_ok_status;
            else $gx_layout_library_use_cookies_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_use_cookies_status.'</tr>';

        $report_table .= '<tr><td>cURL</td><td>Supports cURL.</td><td>'.$hascurl.'</td>';
        if($hascurl == 'Supports cURL.') $gx_layout_library_curl_status = $gx_layout_library_ok_status;
            else $gx_layout_library_curl_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_curl_status.'</tr>';

        $report_table .= '<th colspan="4">WordPress Environment</th></tr><tr class="gx_layout_library-header-row"><td>Config Option</td><td>Recommended Value</td><td>Actual Value</td><td>Status</td></tr>';
        $report_table .= '<tr><td>Multisite</td><td>-</td>';
        $report_table .= '<td>'.$ismulti.'</td>'.$gx_layout_library_ok_status.'</tr>';
        $report_table .= '<td>Site url</td><td>-</td>'.'<td>'.site_url().'</td>'.$gx_layout_library_ok_status.'</tr>';
        $report_table .= '<td>Home url</td><td>-</td>'.'<td>'.home_url().'</td>'.$gx_layout_library_ok_status.'</tr>';
        $report_table .= '<td>WP Version</td><td>4.2+</td><td>'.get_bloginfo( 'version' ).'</td>';
        if ( (int)str_replace(".", "", get_bloginfo( 'version' )) < 42) {$wp_version_status = $gx_layout_library_warning_status;}
            else {$wp_version_status = $gx_layout_library_ok_status;}
        $report_table .= $wp_version_status.'</tr>';
        
        $report_table .= '<td>Permalink</td><td>-</td>'.'<td>'.get_option( 'permalink_structure' ).'</td>'.$gx_layout_library_ok_status.'</tr><tr>';
        $report_table .= '<td>Current Theme</td><td>-</td>'.'<td>'.$theme.'</td>'.$gx_layout_library_ok_status.'</tr><tr>';
       
        $report_table .= '<td>Parent Theme</td><td>Divi 3.0.0+</td>'.'<td>'.$parent_theme.'</td>';
        $parent_theme_version = (int)str_replace(".", "", $style_parent_theme->get( 'Version' ));
         if ( $style_parent_theme->get( 'Name' ) != 'Divi' || ($parent_theme_version < 300 && $parent_theme_version > 50)) {$wp_parent_theme_status = $gx_layout_library_warning_status;}
            else {$wp_parent_theme_status = $gx_layout_library_ok_status;}
        $report_table .= $wp_parent_theme_status.'</tr>';
        
        $report_table .= '<tr><td>WP debug</td><td>Disabled</td><td>'.$wpdebug.'</td>';
        if($wpdebug == 'Disabled') $gx_layout_library_wpdebug_status = $gx_layout_library_ok_status;
            else $gx_layout_library_wpdebug_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_wpdebug_status.'</tr>';

        $report_table .= '<tr><td>WP Memory Limit</td><td>30+ MB</td><td>'.$this->gx_layout_library_num_convt( WP_MEMORY_LIMIT )/( 1024 ).' MB</td>';
             if($this->gx_layout_library_num_convt( WP_MEMORY_LIMIT )/( 1024 ) > 30) $gx_layout_library_wp_memory_status = $gx_layout_library_ok_status;
            else $gx_layout_library_wp_memory_status = $gx_layout_library_warning_status;
        $report_table .= $gx_layout_library_wp_memory_status.'</tr>';

        $report_table .= '<tr><td>jQuery Version</td><td>1.1.0+</td><td>'.$jquchk.'</td>';
        if((int)str_replace(".", "",$jquchk) >= 110) $gx_layout_library_jquery_status = $gx_layout_library_ok_status;
            else $gx_layout_library_jquery_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_jquery_status.'</tr>';

        $report_table .= '<td>Site Language</td><td>-</td>'.'<td>'.$site_lang.'</td>'.$gx_layout_library_ok_status.'</tr><tr>';

        $report_table .= '<td>Site Text Direction</td><td>ltr (left-to-right)</td>'.'<td>'.$site_text_dir.'</td>';

        if($site_text_dir == 'ltr') $gx_layout_library_mtd_status = $gx_layout_library_ok_status;
            else $gx_layout_library_mtd_status = $gx_layout_library_warning_status;
            $report_table .= $gx_layout_library_mtd_status.'</tr>';


            // multisite info
		if ( is_multisite() ) :
			$report_table .= '<th colspan="4">Multisite</th></tr><tr class="gx_layout_library-header-row"><td>Config Option</td><td>Recommended Value</td><td>Actual Value</td><td>Status</td></tr>';
        $report_table .= '<tr><td>Total Sites</td><td>-</td>';
        $report_table .= '<td>'.get_blog_count().'</td>'.$gx_layout_library_ok_status.'</tr>';
        $report_table .= '<td>Base Site</td><td>-</td>'.'<td>'.$ms_sites[0]['domain'].'</td>'.$gx_layout_library_ok_status.'</tr>';
        $report_table .= '<td colspan="2">All Sites</td>'.'<td colspan="2">';
        	foreach ( $ms_sites as $site ) :
                if ( $site['path'] != '/' ) {
                    $report_table .= $site['domain'];
                	$report_table .= $site['path'];
                	$report_table .= "<br/>";
                }
          	endforeach;
        $report_table .='</td></tr>';
   
        endif;      // is_multisite()  

         // output active plugins
        if ($plugins ):

        	$report_table .= '<th colspan="4">Active plugins</th>';

        	$report_table .= '<tr><td colspan="2">';
        	$report_table .= count( $active );
        	$report_table .= ' active plugins</td><td colspan="2">';
         	foreach ( $plugins as $plugin_path => $plugin ) :
                if ( ! in_array( $plugin_path, $active ) )
                    continue;
                $report_table .= $plugin['Name'];
                $report_table .= ' ';
                $report_table .= $plugin['Version'];
                $report_table .= "<br>";
         	endforeach;
         	$report_table .= '</td></tr>';

        endif;

         // output inctive plugins
        if ($plugins ):

        	$report_table .= '<th colspan="4">Inactive Plugins</th>';

        	$report_table .= '<tr><td colspan="2">';
        	$report_table .=  count( $plugins ) - count( $active );
        	$report_table .= ' inactive plugins</td><td colspan="2">';
         	foreach ( $plugins as $plugin_path => $plugin ) :
                if ( in_array( $plugin_path, $active ) )
                    continue;
                $report_table .= $plugin['Name'];
                $report_table .= ' ';
                $report_table .= $plugin['Version'];
                $report_table .= "<br>";
         	endforeach;
         	$report_table .= '</td></tr></table>';

        endif;

        if (strpos($report_table, $gx_layout_library_warning_status) !== false) {
        	$class = 'notice notice-error is-dismissible';
			$message = 'Action Required: Please review Divi Layout Library system status report. Setting update may be required for best results. <a href=?page=' . $this->ame_activation_tab_key . '&tab=gx_layout_library_assistant_system_status>Go to system status tab</a>.';

	if($warning_flag == 1 && PAnD::is_admin_notice_active( 'disable-gx_layout_library-status-report-notice-forever' )) printf( '<div data-dismissible="disable-gx_layout_library-status-report-notice-forever" class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), $message ); 
        }

        return $report.$report_table;
    }

    public function gx_layout_library_start_here_function()
        {   
            $gx_layout_library_start_here_content = '<h1>Get the best results from your efforts by watching these short video tutorials</h1>';

            $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion closed"><div class="gx_layout_library-accordion-header"><h3>Watch this before you begin <span>+</span></h3><p>Important things to do before you start building pages</p></div>';
            $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion-content"><p>Learn how to deactivate Divi local caching and JS minification, plugin caching and server caching.</p><iframe width="560" height="315" src="https://www.youtube.com/embed/4cw-qWRaVVY?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="gx_layout_library-youtube"></iframe></div></div>';

            $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion closed"><div class="gx_layout_library-accordion-header"><h3>The "Save" button does not show. <span>+</span></h3><p>I only see "Try For Free"</p></div>';
            $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion-content"><p>Just activated the API Key but unable to load/save layouts? Try this</p><iframe width="560" height="315" src="https://www.youtube.com/embed/31jZuOCBSw8?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="gx_layout_library-youtube"></iframe></div></div>';

             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion closed"><div class="gx_layout_library-accordion-header"><h3>Finding & loading layouts <span>+</span></h3><p>Tips for finding relevant layouts fast</p></div>';
             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion-content"><p>How to search by keyword. Using filter options, collections, bundles, page types and topics. Saving to the library or loading direct to a page.</p><iframe width="560" height="315" src="https://www.youtube.com/embed/pGzfBpRzbz0?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="gx_layout_library-youtube"></iframe></div></div>';

             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion closed"><div class="gx_layout_library-accordion-header"><h3>Finding & loading modules <span>+</span></h3><p>Load the right module from the right place</p></div>';
             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion-content"><p>How to filter by modules and save to library. Adding modules to a page.</p><iframe width="560" height="315" src="https://www.youtube.com/embed/efsWabPOaqs?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="gx_layout_library-youtube"></iframe></div></div>';

             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion closed"><div class="gx_layout_library-accordion-header"><h3>Making content & style updates <span>+</span></h3><p>Modify content and design to suit your needs</p></div>';
             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion-content"><p>How to make updates using Divi module settings. Content, design and custom tab options.</p><iframe width="560" height="315" src="https://www.youtube.com/embed/ZiX28JWsTYA?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="gx_layout_library-youtube"></iframe></div></div>';

             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion closed"><div class="gx_layout_library-accordion-header"><h3>Common problems and troubleshooting tips <span>+</span></h3><p>Missing options or not able to save/load layouts?</p></div>';
             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion-content"><p>Some tips for troubleshooting...</p><iframe width="560" height="315" src="https://www.youtube.com/embed/YS-C6n-mFII?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="gx_layout_library-youtube"></iframe></div></div>';

             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion closed"><div class="gx_layout_library-accordion-header"><h3>Advanced updates - custom CSS <span>+</span></h3><p>Where to find additional CSS or write your own</p></div>';
             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion-content"><p>Finding and using custom CSS files.</p><iframe width="560" height="315" src="https://www.youtube.com/embed/-7FVSRndhxs?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="gx_layout_library-youtube"></iframe></div></div>';

             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion closed"><div class="gx_layout_library-accordion-header"><h3>Setting up blog layouts & blog modules <span>+</span></h3><p>Assign posts, categories, featured images and more</p></div>';
             $gx_layout_library_start_here_content .= '<div class="gx_layout_library-accordion-content"><p>Tips for setting up posts, image sizes, image optimization, tick which categories to display on page & dummy posts if needed.</p><iframe width="560" height="315" src="https://www.youtube.com/embed/7COeB5hejrY?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen class="gx_layout_library-youtube"></iframe></div></div>';

            return $gx_layout_library_start_here_content;
        }

    public function gx_layout_library_getting_started() {
        add_option( 'gx_layout_library_enable', 'enabled' );
    	$gx_layout_library_starting = '';
    	$gx_layout_library_starting .= '<div class="et-epanel-box gx-button"><div class="et-box-title"><h3>Enable/Disable Divi Layout Library Service</h3><p class="et-box-subtitle">(removes gx_layout_library tab from "Load Layouts" window)</p></div><div class="et-box-content"><input type="checkbox" class="et-checkbox yes_no_button" name="gx_layout_library_enable" id="gx_layout_library_enable" style="display: none;"><div class="et_pb_yes_no_button ';
        $gx_layout_library_option_template = get_option('gx_layout_library_enable');
        if ($gx_layout_library_option_template == 'enabled')
                $gx_layout_library_starting .= 'et_pb_on_state';
            else $gx_layout_library_starting .= 'et_pb_off_state';
    	$gx_layout_library_starting .='"><!-- .et_pb_on_state || .et_pb_off_state -->
				<span class="et_pb_value_text et_pb_on_value">Enabled</span>
				<span class="et_pb_button_slider"></span>
				<span class="et_pb_value_text et_pb_off_value">Disabled</span>
			</div></div></div><hr style="clear: both;">';
            if ($gx_layout_library_option_template == 'enabled') { $gx_layout_library_starting .= '<iframe id="ondemanIframe" name="ondemandIframe" class="settingsIframe" src="https://ondemand.gx-den.com/search-everything/"></iframe><div class="loaded_message"><h3 class="sectionSaved">Success! Saved to Divi Library<br>The layout or section has been saved to your Divi Library.<br>Use the "Add From Library" tab in Divi Builder to load it onto a new page.</h3><span class="close">&#x2715;</span><div>'; }
            return $gx_layout_library_starting;
    }

    public function gx_layout_library_assistant_help_faq() {
    	$gx_layout_library_help_faq = '<a class="et-core-modal-action" target="_blank" href="https://seku.re/ondemand-kb">Browse Knowledge Base</a>
            <br/>
            <h3>Submit your feedback</h3><iframe id="supportIframe" src="https://gx-den.com/gx-den-support-for-plugins-iframe?systemreport='.$GLOBALS['$report_for_email'].'"/></iframe>';
             // echo '$report_for_email: '.$GLOBALS['$report_for_email'];
    	return $gx_layout_library_help_faq;
    }

		// Draw option page
	public function gx_layout_library_config_page() {
		$this->gx_layout_library_report_data($warning_flag = 1);
			$settings_tabs = array( 
				'gx_layout_library_assistant_getting_started' => 'Find Layouts', 
                'gx_layout_library_start_here' => 'Start Here',
				'gx_layout_library_assistant_system_status' => 'System Status',
				'gx_layout_library_assistant_help_faq' => 'Give Plugin Feedback'
			);
			
				if(isset( $_GET[ 'tab' ] )) $current_tab = $tab = $_GET[ 'tab' ];
					else $current_tab = $tab = 'gx_layout_library_assistant_getting_started';
			?>
            <div class='wrap gx_layout_library-assistant'>
            	<h1>Divi Layout Library Dashboard</h1>
                <h2 class="nav-tab-wrapper">
					<?php
					foreach ( $settings_tabs as $tab_page => $tab_name ) {
						$active_tab = $current_tab == $tab_page ? 'nav-tab-active' : '';
						echo '<a class="nav-tab '. $tab_page . ' ' .$active_tab . '" href="?page=' . $this->ame_activation_tab_key . '&tab=' . $tab_page . '">' . $tab_name . '</a>';
					}
					?>
                </h2>
                <form action='options.php' method='post'>
                    <div class="main">
						<?php
						if ( $tab == 'gx_layout_library_assistant_system_status') {
							echo $this->gx_layout_library_report_data($warning_flag = 0);
						}
						else if ( $tab == 'gx_layout_library_assistant_getting_started') {
							echo $this->gx_layout_library_getting_started();
						}
						else if ( $tab == 'gx_layout_library_assistant_help_faq') {
							echo $this->gx_layout_library_assistant_help_faq();
						}
                         else if ($tab == 'gx_layout_library_start_here') {
                            echo $this->gx_layout_library_start_here_function();
            }
						?>
                    </div>
                </form>
            </div>
			<?php
		}

	}
}