<?php
/**
 * The template for displaying archive pages
 *
 * @package Sinaquant
 */

get_header();
?>

<main id="primary" class="site-main container section">

  <?php if ( have_posts() ) : ?>

    <header class="page-header">
      <?php
      the_archive_title( '<h1 class="page-title section-title">', '</h1>' );
      the_archive_description( '<div class="archive-description">', '</div>' );
      ?>
    </header>

    <div class="story-grid">
      <?php
      while ( have_posts() ) :
        the_post();
        get_template_part( 'template-parts/content', 'card' );
      endwhile;
      ?>
    </div>

    <?php
    the_posts_pagination(
      array(
        'mid_size'  => 2,
        'prev_text' => esc_html__( 'Previous', 'sinaquant' ),
        'next_text' => esc_html__( 'Next', 'sinaquant' ),
      )
    );

  else :
    get_template_part( 'template-parts/content', 'none' );
  endif;
  ?>

</main>

<?php
get_footer();
