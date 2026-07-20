<?php
/**
 * The template for displaying all single posts
 *
 * @package Sinaquant
 */

get_header();
?>

<main id="primary" class="site-main container section">

  <?php
  while ( have_posts() ) :
    the_post();
    get_template_part( 'template-parts/content', 'single' );

    the_post_navigation(
      array(
        'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'sinaquant' ) . '</span> <span class="nav-title">%title</span>',
        'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'sinaquant' ) . '</span> <span class="nav-title">%title</span>',
      )
    );

    if ( comments_open() || get_comments_number() ) :
      comments_template();
    endif;
  endwhile;
  ?>

</main>

<?php
get_footer();
