<?php
/**
 * Sinaquant Theme Functions
 *
 * @package Sinaquant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme version for cache busting.
 */
define( 'SINAQUANT_VERSION', '1.0.0' );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function sinaquant_setup() {
	load_theme_textdomain( 'sinaquant', get_template_directory() . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'script', 'style' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'customize-selective-refresh-widgets' );

	// Featured image sizes.
	set_post_thumbnail_size( 800, 600, true );
	add_image_size( 'sinaquant-card', 800, 600, true );
	add_image_size( 'sinaquant-hero', 1600, 900, true );
	add_image_size( 'sinaquant-large', 1200, 675, true );

	// Navigation menus.
	register_nav_menus(
		array(
			'primary'    => __( 'Primary Menu', 'sinaquant' ),
			'categories' => __( 'Category Tabs', 'sinaquant' ),
			'mobile'     => __( 'Mobile Drawer', 'sinaquant' ),
			'footer'     => __( 'Footer Network', 'sinaquant' ),
		)
	);
}
add_action( 'after_setup_theme', 'sinaquant_setup' );

/**
 * Enqueue scripts and styles.
 */
function sinaquant_scripts() {
	wp_enqueue_style(
		'sinaquant-style',
		get_template_directory_uri() . '/assets/css/style.css',
		array(),
		SINAQUANT_VERSION
	);

	wp_enqueue_script(
		'sinaquant-main',
		get_template_directory_uri() . '/assets/js/main.js',
		array(),
		SINAQUANT_VERSION,
		true
	);

	wp_enqueue_script(
		'sinaquant-background',
		get_template_directory_uri() . '/assets/js/background.js',
		array( 'sinaquant-main' ),
		SINAQUANT_VERSION,
		true
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	// Pass theme URI and home URL to JS for any dynamic needs.
	wp_localize_script(
		'sinaquant-main',
		'sinaquantData',
		array(
			'themeUri' => get_template_directory_uri(),
			'homeUrl'  => home_url(),
			'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'sinaquant_scripts' );

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';
