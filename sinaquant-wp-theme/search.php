<?php
/**
 * The template for displaying search results pages
 *
 * @package Sinaquant
 */

get_header();
?>

<main id="primary" class="site-main container section">

  <?php if ( have_posts() ) : ?>

    <header class="page-header">
      <h1 class="page-title section-title">
        <?php
        printf(
          /* translators: %s: search query. */
          esc_html__( 'Search Results for: %s', 'sinaquant' ),
          '<span>' . get_search_query() . '</span>'
        );
        ?>
      </h1>
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
