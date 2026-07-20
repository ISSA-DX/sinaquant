<?php
/**
 * The main template file
 *
 * @package Sinaquant
 */

get_header();
?>

<?php if ( is_home() && ! is_front_page() ) : ?>
  <section class="container section">
    <header class="page-header">
      <h1 class="page-title"><?php single_post_title(); ?></h1>
    </header>

    <div class="story-grid">
      <?php
      if ( have_posts() ) :
        while ( have_posts() ) :
          the_post();
          get_template_part( 'template-parts/content', 'card' );
        endwhile;
      else :
        get_template_part( 'template-parts/content', 'none' );
      endif;
      ?>
    </div>

    <?php the_posts_pagination(); ?>
  </section>
<?php else : ?
  <section class="container section">
    <div class="story-grid">
      <?php
      if ( have_posts() ) :
        while ( have_posts() ) :
          the_post();
          get_template_part( 'template-parts/content', 'card' );
        endwhile;
      else :
        get_template_part( 'template-parts/content', 'none' );
      endif;
      ?>
    </div>

    <?php the_posts_pagination(); ?>
  </section>
<?php endif; ?>

<?php
get_footer();
