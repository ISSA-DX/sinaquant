<?php
/**
 * Template part for displaying a story card
 *
 * @package Sinaquant
 */

$card_class = is_sticky() ? 'card card--featured' : 'card';
?>

<article <?php post_class( $card_class ); ?>>

  <?php if ( has_post_thumbnail() ) : ?>
    <a href="<?php the_permalink(); ?>" class="card__image" aria-hidden="true" tabindex="-1">
      <?php the_post_thumbnail( 'sinaquant-card', array( 'alt' => the_title_attribute( array( 'echo' => false ) ) ) ); ?>
    </a>
  <?php endif; ?>

  <div class="card__body">
    <div class="card__meta">
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

    <h3 class="card__title">
      <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
    </h3>

    <div class="card__excerpt">
      <?php the_excerpt(); ?>
    </div>

    <a class="card__link" href="<?php the_permalink(); ?>">
      <?php esc_html_e( 'Read analysis', 'sinaquant' ); ?>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </a>
  </div>

</article>
