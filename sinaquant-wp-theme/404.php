<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package Sinaquant
 */

get_header();
?>

<main id="primary" class="site-main container section" style="text-align:center; padding: 80px 20px;">

  <h1 class="page-title section-title"><?php esc_html_e( '404 — Signal Lost', 'sinaquant' ); ?></h1>

  <p style="max-width: 560px; margin: 0 auto 32px;">
    <?php esc_html_e( 'The intelligence you requested has either moved, been declassified, or never existed. Try searching below or return to the front page.', 'sinaquant' ); ?>
  </p>

  <?php get_search_form(); ?>

  <div style="margin-top: 32px;">
    <a class="btn btn-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>">
      <?php esc_html_e( 'Return to Sinaquant', 'sinaquant' ); ?>
    </a>
  </div>

</main>

<?php
get_footer();
