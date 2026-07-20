<?php
/**
 * Template part for displaying page content in page.php
 *
 * @package Sinaquant
 */
?>

<article <?php post_class( 'article' ); ?>>

  <header class="entry-header">
    <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
  </header>

  <div class="entry-content">
    <?php
    the_content();

    wp_link_pages(
      array(
        'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'sinaquant' ),
        'after'  => '</div>',
      )
    );
    ?>
  </div>

  <footer class="entry-footer">
    <?php sinaquant_entry_footer(); ?>
  </footer>

</article>
