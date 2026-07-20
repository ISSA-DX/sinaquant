<?php
/**
 * Template part for displaying a single post
 *
 * @package Sinaquant
 */
?>

<article <?php post_class( 'article' ); ?>>

  <header class="entry-header">
    <div class="entry-meta">
      <span class="card__category">
        <?php
        $categories = get_the_category();
        if ( ! empty( $categories ) ) {
          echo esc_html( $categories[0]->name );
        } else {
          esc_html_e( 'Intelligence', 'sinaquant' );
        }
        ?>
      </span>
      <span class="card__date"><?php echo esc_html( get_the_date() ); ?></span>
    </div>

    <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

    <?php if ( has_post_thumbnail() ) : ?>
      <figure class="entry-thumbnail">
        <?php the_post_thumbnail( 'sinaquant-featured', array( 'alt' => the_title_attribute( array( 'echo' => false ) ) ) ); ?>
      </figure>
    <?php endif; ?
  </header>

  <div class="entry-content">
    <?php
    the_content(
      sprintf(
        wp_kses(
          /* translators: %s: Name of current post. Only visible to screen readers */
          __( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'sinaquant' ),
          array(
            'span' => array(
              'class' => array(),
            ),
          )
        ),
        wp_kses_post( get_the_title() )
      )
    );

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
