<?php
/**
 * The header for our theme
 *
 * @package Sinaquant
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="dark">
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="stylesheet" crossorigin="anonymous" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap">
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Living neural-network background. -->
<canvas id="sinaquant-bg" aria-hidden="true"></canvas>

<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'sinaquant' ); ?></a>

<header class="site-header">
	<div class="container">
		<div class="header-left">
			<a class="site-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'Sinaquant home', 'sinaquant' ); ?>">
				<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/sinaquant-logo.svg' ); ?>" alt="" aria-hidden="true" width="32" height="32">
				<span><?php bloginfo( 'name' ); ?></span>
			</a>

			<?php if ( has_nav_menu( 'primary' ) ) : ?>
			<nav class="primary-nav" aria-label="<?php esc_attr_e( 'Primary', 'sinaquant' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'items_wrap'     => '%3$s',
						'depth'          => 1,
					)
				);
				?>
			</nav>
			<?php endif; ?>
		</div>

		<div class="header-actions">
			<a class="btn btn-ghost btn-pill hidden-mobile" href="#" style="padding:8px 16px;font-size:13px"><?php esc_html_e( 'Terminal', 'sinaquant' ); ?></a>
			<a class="btn btn-primary btn-pill hidden-mobile" href="#" style="padding:8px 16px;font-size:13px"><?php esc_html_e( 'Subscribe', 'sinaquant' ); ?></a>
			<button class="icon-btn" id="searchTrigger" aria-label="<?php esc_attr_e( 'Open search', 'sinaquant' ); ?>" aria-expanded="false">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
			</button>
			<button class="icon-btn" id="themeToggle" aria-label="<?php esc_attr_e( 'Toggle dark / light mode', 'sinaquant' ); ?>">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
			</button>

			<nav class="mobile-icon-nav" aria-label="<?php esc_attr_e( 'Quick navigation', 'sinaquant' ); ?>">
				<a class="icon-btn" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'Home', 'sinaquant' ); ?>">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
				</a>
				<a class="icon-btn" href="<?php echo esc_url( get_post_type_archive_link( 'post' ) ); ?>" aria-label="<?php esc_attr_e( 'News', 'sinaquant' ); ?>">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>
				</a>
				<a class="icon-btn" href="#" aria-label="<?php esc_attr_e( 'Tools', 'sinaquant' ); ?>">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
				</a>
				<a class="icon-btn" href="#" aria-label="<?php esc_attr_e( 'Pricing', 'sinaquant' ); ?>">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
				</a>
				<button class="icon-btn" id="menuOpen" aria-label="<?php esc_attr_e( 'More menu', 'sinaquant' ); ?>" aria-expanded="false" aria-controls="mobileDrawer">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
				</button>
			</nav>
		</div>
	</div>
</header>

<?php if ( has_nav_menu( 'categories' ) ) : ?>
<nav class="category-tabs" aria-label="<?php esc_attr_e( 'Topic categories', 'sinaquant' ); ?>">
	<div class="container">
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'categories',
				'container'      => false,
				'items_wrap'     => '%3$s',
				'depth'          => 1,
			)
		);
		?>
	</div>
</nav>
<?php endif; ?>

<div class="drawer-backdrop" id="drawerBackdrop" aria-hidden="true"></div>
<nav class="mobile-drawer" id="mobileDrawer" aria-label="<?php esc_attr_e( 'Mobile navigation', 'sinaquant' ); ?>">
	<div class="drawer-header">
		<div class="site-brand">
			<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/sinaquant-logo.svg' ); ?>" alt="" aria-hidden="true" width="32" height="32">
			<span><?php esc_html_e( 'Menu', 'sinaquant' ); ?></span>
		</div>
		<button class="icon-btn" id="menuClose" aria-label="<?php esc_attr_e( 'Close menu', 'sinaquant' ); ?>">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
		</button>
	</div>
	<div class="drawer-body">
		<div>
			<div class="drawer-section-label"><?php esc_html_e( 'General', 'sinaquant' ); ?></div>
			<?php if ( has_nav_menu( 'mobile' ) ) : ?>
			<div class="drawer-nav">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'mobile',
						'container'      => false,
						'items_wrap'     => '%3$s',
						'depth'          => 1,
					)
				);
				?>
			</div>
			<?php endif; ?>
		</div>
		<div>
			<div class="drawer-section-label"><?php esc_html_e( 'Categories', 'sinaquant' ); ?></div>
			<?php if ( has_nav_menu( 'categories' ) ) : ?>
			<div class="drawer-categories">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'categories',
						'container'      => false,
						'items_wrap'     => '%3$s',
						'depth'          => 1,
					)
				);
				?>
			</div>
			<?php endif; ?>
		</div>
		<div class="drawer-cta">
			<h3><?php esc_html_e( 'Weekly Insight', 'sinaquant' ); ?></h3>
			<p><?php esc_html_e( 'Get the latest AI breakthroughs delivered to your terminal.', 'sinaquant' ); ?></p>
			<a class="btn btn-primary btn-pill w-full" href="#"><?php esc_html_e( 'Subscribe', 'sinaquant' ); ?></a>
		</div>
	</div>
	<div class="drawer-footer">
		<span><?php echo esc_html( '&copy; ' . gmdate( 'Y' ) . ' ' . get_bloginfo( 'name' ) ); ?></span>
		<div class="drawer-footer-actions">
			<button class="icon-btn" aria-label="<?php esc_attr_e( 'Dark mode toggle', 'sinaquant' ); ?>">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
			</button>
			<a class="icon-btn" href="#" aria-label="<?php esc_attr_e( 'Share Sinaquant', 'sinaquant' ); ?>">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
			</a>
		</div>
	</div>
</nav>

<div class="search-overlay" id="searchOverlay" role="search">
	<div class="container">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22" style="color:var(--cyan);flex-shrink:0" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
		<?php get_search_form(); ?>
		<button class="icon-btn" id="searchClose" aria-label="<?php esc_attr_e( 'Close search', 'sinaquant' ); ?>">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
		</button>
	</div>
</div>

<div class="modal-backdrop" id="newsletterModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
	<div class="modal">
		<button class="modal__close" data-modal-close aria-label="<?php esc_attr_e( 'Close', 'sinaquant' ); ?>">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
		</button>
		<div class="modal__body">
			<h2 id="modalTitle"><?php esc_html_e( 'The Intelligence Brief', 'sinaquant' ); ?></h2>
			<p><?php esc_html_e( 'Join 50k+ AI professionals receiving daily technical deep-dives into the agentic future.', 'sinaquant' ); ?> <span class="accent"><?php esc_html_e( 'Precision insights, zero noise.', 'sinaquant' ); ?></span></p>
			<?php echo do_shortcode( '[sinaquant_newsletter_form]' ); ?>
			<p class="modal__disclaimer"><?php esc_html_e( 'No spam. High-density data only. Opt-out anytime.', 'sinaquant' ); ?></p>
		</div>
		<div class="modal__glow" aria-hidden="true"></div>
	</div>
</div>
