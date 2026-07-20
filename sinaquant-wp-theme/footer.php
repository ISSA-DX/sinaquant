<?php
/**
 * The template for displaying the footer
 *
 * @package Sinaquant
 */

?>

</main>

<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">

      <div class="footer-brand">
        <a class="site-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'Sinaquant home', 'sinaquant' ); ?>">
          <img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/sinaquant-logo.svg' ); ?>" alt="" aria-hidden="true" width="32" height="32">
          <span><?php bloginfo( 'name' ); ?></span>
        </a>
        <p><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
        <div class="footer-socials" aria-label="<?php esc_attr_e( 'Social channels', 'sinaquant' ); ?>">
          <a href="#" aria-label="<?php esc_attr_e( 'Sinaquant on X', 'sinaquant' ); ?>">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2H21.5l-7.5 8.57L22.94 22H16.06l-5.39-6.86L4.6 22H1.34l8.04-9.2L1.06 2H8.1l4.86 6.27L18.24 2zm-1.18 18h1.85L7.06 4H5.1l11.96 16z"/></svg>
          </a>
          <a href="#" aria-label="<?php esc_attr_e( 'Sinaquant on LinkedIn', 'sinaquant' ); ?>">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11.25H3V9.75zM10 9.75h3.84v1.54h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V21h-4v-5.04c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65V21H10V9.75z"/></svg>
          </a>
          <a href="#" aria-label="<?php esc_attr_e( 'Sinaquant on YouTube', 'sinaquant' ); ?>">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
          </a>
          <a href="#" aria-label="<?php esc_attr_e( 'Sinaquant on Instagram', 'sinaquant' ); ?>">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="<?php bloginfo( 'rss2_url' ); ?>" aria-label="<?php esc_attr_e( 'Sinaquant RSS feed', 'sinaquant' ); ?>">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
          </a>
        </div>
      </div>

      <div class="footer-col">
        <h4><?php esc_html_e( 'Network', 'sinaquant' ); ?></h4>
        <?php if ( has_nav_menu( 'footer' ) ) : ?>
          <?php
          wp_nav_menu(
            array(
              'theme_location' => 'footer',
              'container'      => false,
              'menu_class'     => '',
              'items_wrap'     => '<ul>%3$s</ul>',
              'depth'          => 1,
            )
          );
          ?>
        <?php else : ?>
          <ul>
            <li><a href="<?php echo esc_url( get_post_type_archive_link( 'post' ) ); ?>"><?php esc_html_e( 'News Feed', 'sinaquant' ); ?></a></li>
            <li><a href="#"><?php esc_html_e( 'Research Portal', 'sinaquant' ); ?></a></li>
            <li><a href="#"><?php esc_html_e( 'Tools Directory', 'sinaquant' ); ?></a></li>
            <li><a href="#"><?php esc_html_e( 'Data Terminal', 'sinaquant' ); ?></a></li>
            <li><a href="#"><?php esc_html_e( 'API Docs', 'sinaquant' ); ?></a></li>
          </ul>
        <?php endif; ?>
      </div>

      <div class="footer-col">
        <h4><?php esc_html_e( 'Company', 'sinaquant' ); ?></h4>
        <ul>
          <li><a href="#"><?php esc_html_e( 'About Us', 'sinaquant' ); ?></a></li>
          <li><a href="#"><?php esc_html_e( 'Careers', 'sinaquant' ); ?></a></li>
          <li><a href="#"><?php esc_html_e( 'Editorial Guidelines', 'sinaquant' ); ?></a></li>
          <li><a href="#"><?php esc_html_e( 'Press Kit', 'sinaquant' ); ?></a></li>
          <li><a href="#"><?php esc_html_e( 'Contact', 'sinaquant' ); ?></a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4><?php esc_html_e( 'Subscribe', 'sinaquant' ); ?></h4>
        <p style="font-size:13px;margin-bottom:12px;color:var(--text-2)"><?php esc_html_e( 'Get the daily intelligence brief in your inbox.', 'sinaquant' ); ?></p>
        <?php echo do_shortcode( '[sinaquant_newsletter_form compact="true"]' ); ?>
        <h4 style="margin-top:24px"><?php esc_html_e( 'Legal', 'sinaquant' ); ?></h4>
        <ul>
          <li><a href="#"><?php esc_html_e( 'Privacy Policy', 'sinaquant' ); ?></a></li>
          <li><a href="#"><?php esc_html_e( 'Terms of Service', 'sinaquant' ); ?></a></li>
          <li><a href="#"><?php esc_html_e( 'Cookie Policy', 'sinaquant' ); ?></a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>&copy; <?php echo esc_html( gmdate( 'Y' ) . ' ' . get_bloginfo( 'name' ) ); ?>. <?php esc_html_e( 'All rights reserved. Precision data terminal for AI professionals.', 'sinaquant' ); ?></span>
      <span class="status"><?php esc_html_e( 'System Status: Operational', 'sinaquant' ); ?> &middot; <span style="opacity:.6">v<?php echo esc_html( SINAQUANT_VERSION ); ?></span></span>
    </div>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
