<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Sinaquant
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function sinaquant_body_classes( $classes ) {
  // Adds a class of hfeed to non-singular pages.
  if ( ! is_singular() ) {
    $classes[] = 'hfeed';
  }

  // Adds a class of no-sidebar when there is no sidebar present.
  if ( ! is_active_sidebar( 'sidebar-1' ) ) {
    $classes[] = 'no-sidebar';
  }

  return $classes;
}
add_filter( 'body_class', 'sinaquant_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function sinaquant_pingback_header() {
  if ( is_singular() && pings_open() ) {
    printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
  }
}
add_action( 'wp_head', 'sinaquant_pingback_header' );

/**
 * Prints HTML with meta information for the categories, tags and comments.
 */
function sinaquant_entry_footer() {
  // Hide category and tag text for pages.
  if ( 'post' === get_post_type() ) {
    /* translators: used between list items, there is a space after the comma */
    $categories_list = get_the_category_list( esc_html__( ', ', 'sinaquant' ) );
    if ( $categories_list ) {
      printf( '<span class="cat-links">' . esc_html__( 'Posted in %1$s', 'sinaquant' ) . '</span>', $categories_list );
    }

    /* translators: used between list items, there is a space after the comma */
    $tags_list = get_the_tag_list( '', esc_html_x( ', ', 'list item separator', 'sinaquant' ) );
    if ( $tags_list ) {
      printf( '<span class="tags-links">' . esc_html__( 'Tagged %1$s', 'sinaquant' ) . '</span>', $tags_list );
    }
  }

  if ( ! is_single() && ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
    echo '<span class="comments-link">';
    comments_popup_link(
      sprintf(
        wp_kses(
          /* translators: %s: post title */
          __( 'Leave a Comment<span class="screen-reader-text"> on %s</span>', 'sinaquant' ),
          array(
            'span' => array(
              'class' => array(),
            ),
          )
        ),
        wp_kses_post( get_the_title() )
      )
    );
    echo '</span>';
  }

  edit_post_link(
    sprintf(
      wp_kses(
        /* translators: %s: Name of current post. Only visible to screen readers */
        __( 'Edit <span class="screen-reader-text">%s</span>', 'sinaquant' ),
        array(
          'span' => array(
            'class' => array(),
          ),
        )
      ),
      wp_kses_post( get_the_title() )
    ),
    '<span class="edit-link">',
    '</span>'
  );
}
