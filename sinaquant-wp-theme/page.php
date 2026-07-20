<?php
/**
 * The template for displaying all pages
 *
 * @package Sinaquant
 */

get_header();
?>

<main id="primary" class="site-main container section">

  <?php
  while ( have_posts() ) :
    the_post();
    get_template_part( 'template-parts/content', 'page' );

    // If comments are open or we have at least one comment, load up the comment template.
    if ( comments_open() || get_comments_number() ) :
      comments_template();
    endif;
  endwhile;
  ?>

</main>

<?php
get_footer();
