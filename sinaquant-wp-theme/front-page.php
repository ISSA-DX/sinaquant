<?php
/**
 * The front page template
 *
 * @package Sinaquant
 */

get_header();
?>

<main id="main">

<!-- Hero slider: intro video + 5 featured-story image slides -->
<section class="container" style="padding-top:24px">
  <div class="hero-slider hero-slider--media" aria-roledescription="carousel" aria-label="<?php esc_attr_e( 'Featured stories', 'sinaquant' ); ?>">
    <div class="hero-slider__viewport">

      <!-- Slide 1: Sinaquant intro video -->
      <article class="hero-slider__slide is-active hero-slider__slide--video" data-slide-type="video">
        <video class="hero-slider__media" id="heroIntroVideo" autoplay muted playsinline loop preload="auto">
          <source src="<?php echo esc_url( get_template_directory_uri() . '/assets/videos/sinaquant-intro.mp4' ); ?>" type="video/mp4">
        </video>
        <div class="hero-slider__content">
          <span class="tag tag--solid-electric"><?php esc_html_e( 'Welcome', 'sinaquant' ); ?></span>
          <h1 class="hero-slider__title"><?php esc_html_e( 'Sinaquant — Intelligent Future AI News', 'sinaquant' ); ?></h1>
          <p class="hero-slider__excerpt"><?php esc_html_e( 'Daily intelligence on Agentic AI, LLMs, hardware, policy and the agentic future. Precision data for the architects of tomorrow.', 'sinaquant' ); ?></p>
          <div class="hero-slider__actions">
            <a class="btn btn-primary" href="<?php echo esc_url( get_post_type_archive_link( 'post' ) ); ?>">
              <?php esc_html_e( 'Explore Intelligence', 'sinaquant' ); ?>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a class="btn btn-ghost" href="#featured"><?php esc_html_e( 'View Data Map', 'sinaquant' ); ?></a>
          </div>
        </div>
      </article>

      <!-- Slide 2 -->
      <article class="hero-slider__slide hero-slider__slide--image" data-slide-type="image" style="background-image:url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80')">
        <div class="hero-slider__content">
          <span class="tag tag--solid-electric"><?php esc_html_e( 'Exclusive Report', 'sinaquant' ); ?></span>
          <h1 class="hero-slider__title"><?php esc_html_e( 'The Singularity Shift: How Agentic AI Is Rewriting the Global Economic Ledger', 'sinaquant' ); ?></h1>
          <p class="hero-slider__excerpt"><?php esc_html_e( 'New research from Sinaquant Intelligence reveals that 40% of financial transactions will be autonomous by 2026 — and three sectors are already there.', 'sinaquant' ); ?></p>
          <div class="hero-slider__actions">
            <a class="btn btn-primary" href="#"><?php esc_html_e( 'Read Investigation', 'sinaquant' ); ?></a>
          </div>
        </div>
      </article>

      <!-- Slide 3 -->
      <article class="hero-slider__slide hero-slider__slide--image" data-slide-type="image" style="background-image:url('https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=1600&q=80')">
        <div class="hero-slider__content">
          <span class="tag tag--cyan"><?php esc_html_e( 'Hardware', 'sinaquant' ); ?></span>
          <h1 class="hero-slider__title"><?php esc_html_e( 'Photonic Computing Hits Commercial Scale', 'sinaquant' ); ?></h1>
          <p class="hero-slider__excerpt"><?php esc_html_e( 'Light-based processors promise 100× efficiency gains for training next-generation models — and a Texas fab is the first to ship at scale.', 'sinaquant' ); ?></p>
          <div class="hero-slider__actions">
            <a class="btn btn-primary" href="#"><?php esc_html_e( 'Read Analysis', 'sinaquant' ); ?></a>
          </div>
        </div>
      </article>

      <!-- Slide 4 -->
      <article class="hero-slider__slide hero-slider__slide--image" data-slide-type="image" style="background-image:url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80')">
        <div class="hero-slider__content">
          <span class="tag"><?php esc_html_e( 'Agentic AI', 'sinaquant' ); ?></span>
          <h1 class="hero-slider__title"><?php esc_html_e( 'The Sovereign Agent: How LLMs Are Becoming Autonomous Digital Entities', 'sinaquant' ); ?></h1>
          <p class="hero-slider__excerpt"><?php esc_html_e( 'Breakthrough protocols allow large language models to manage complex, multi-step tasks across isolated environments without human intervention.', 'sinaquant' ); ?></p>
          <div class="hero-slider__actions">
            <a class="btn btn-primary" href="#"><?php esc_html_e( 'Read Report', 'sinaquant' ); ?></a>
          </div>
        </div>
      </article>

      <!-- Slide 5 -->
      <article class="hero-slider__slide hero-slider__slide--image" data-slide-type="image" style="background-image:url('https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=1600&q=80')">
        <div class="hero-slider__content">
          <span class="tag"><?php esc_html_e( 'Research', 'sinaquant' ); ?></span>
          <h1 class="hero-slider__title"><?php esc_html_e( 'Bio-Digital Convergence: LLMs in Drug Discovery', 'sinaquant' ); ?></h1>
          <p class="hero-slider__excerpt"><?php esc_html_e( 'How generative chemistry is cutting the R&D timeline for rare-disease therapeutics by up to 70% — and what it means for the FDA pipeline.', 'sinaquant' ); ?></p>
          <div class="hero-slider__actions">
            <a class="btn btn-primary" href="#"><?php esc_html_e( 'Read Story', 'sinaquant' ); ?></a>
          </div>
        </div>
      </article>

      <!-- Slide 6 -->
      <article class="hero-slider__slide hero-slider__slide--image" data-slide-type="image" style="background-image:url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80')">
        <div class="hero-slider__content">
          <span class="tag tag--sky"><?php esc_html_e( 'Policy', 'sinaquant' ); ?></span>
          <h1 class="hero-slider__title"><?php esc_html_e( 'EU AI Act v2.0: The Compliance Paradox for Seed-Stage Startups', 'sinaquant' ); ?></h1>
          <p class="hero-slider__excerpt"><?php esc_html_e( 'New regulatory frameworks are inadvertently favoring incumbent tech giants over emerging architectural innovators. A Sinaquant special report.', 'sinaquant' ); ?></p>
          <div class="hero-slider__actions">
            <a class="btn btn-primary" href="#"><?php esc_html_e( 'Read Brief', 'sinaquant' ); ?></a>
          </div>
        </div>
      </article>

    </div>

    <div class="hero-slider__dots" role="tablist" aria-label="<?php esc_attr_e( 'Slide navigation', 'sinaquant' ); ?>">
      <button class="is-active" aria-label="<?php esc_attr_e( 'Intro video', 'sinaquant' ); ?>"></button>
      <button aria-label="<?php esc_attr_e( 'Economic ledger', 'sinaquant' ); ?>"></button>
      <button aria-label="<?php esc_attr_e( 'Photonic computing', 'sinaquant' ); ?>"></button>
      <button aria-label="<?php esc_attr_e( 'Sovereign agent', 'sinaquant' ); ?>"></button>
      <button aria-label="<?php esc_attr_e( 'Drug discovery', 'sinaquant' ); ?>"></button>
      <button aria-label="<?php esc_attr_e( 'EU AI Act', 'sinaquant' ); ?>"></button>
    </div>

    <div class="hero-slider__nav">
      <button data-slider-prev aria-label="<?php esc_attr_e( 'Previous slide', 'sinaquant' ); ?>">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button data-slider-next aria-label="<?php esc_attr_e( 'Next slide', 'sinaquant' ); ?>">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  </div>
</section>

<!-- Just-In ticker -->
<div class="just-in" aria-label="<?php esc_attr_e( 'Latest headlines', 'sinaquant' ); ?>">
  <div class="just-in__inner">
    <div class="just-in__label">
      <span class="just-in__pulse" aria-hidden="true"></span>
      <?php esc_html_e( 'Just In', 'sinaquant' ); ?>
    </div>
    <div class="ticker">
      <div class="ticker__track">
        <span><?php esc_html_e( 'OpenAI confirms GPT-5 training clusters are live in Nevada', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'Nvidia market cap breaks $4T as AI demand surges', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'EU Parliament passes updated AI Liability Act', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'Mistral releases Large-3 with 500k context window', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'DeepMind solves fundamental protein folding paradox', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'Anthropic partners with global telcos for localized LLMs', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'OpenAI confirms GPT-5 training clusters are live in Nevada', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'Nvidia market cap breaks $4T as AI demand surges', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'EU Parliament passes updated AI Liability Act', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'Mistral releases Large-3 with 500k context window', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'DeepMind solves fundamental protein folding paradox', 'sinaquant' ); ?></span>
        <span><?php esc_html_e( 'Anthropic partners with global telcos for localized LLMs', 'sinaquant' ); ?></span>
      </div>
    </div>
  </div>
</div>

<!-- Featured stories grid -->
<section class="container section" id="featured">
  <h2 class="section-title"><?php esc_html_e( 'Featured Intelligence', 'sinaquant' ); ?></h2>

  <div class="story-grid">
    <?php
    $featured = new WP_Query(
      array(
        'posts_per_page' => 6,
        'post_status'    => 'publish',
      )
    );

    if ( $featured->have_posts() ) :
      while ( $featured->have_posts() ) :
        $featured->the_post();
        get_template_part( 'template-parts/content', 'card' );
      endwhile;
      wp_reset_postdata();
    else :
      ?>
      <div class="card">
        <p><?php esc_html_e( 'No stories published yet. Start writing in WordPress to populate the grid.', 'sinaquant' ); ?></p>
      </div>
      <?php
    endif;
    ?>
  </div>
</section>

<!-- Newsletter block -->
<section class="container section" id="newsletter">
  <div class="newsletter" style="padding:48px 32px;text-align:center">
    <h3 style="font-size:32px;margin-bottom:8px"><?php esc_html_e( "Don't miss the next breakthrough.", 'sinaquant' ); ?></h3>
    <p style="max-width:560px;margin:0 auto 24px"><?php esc_html_e( "Sinaquant's intelligence brief is read by 50,000+ founders, researchers, and policy professionals. Get the daily signal — no noise.", 'sinaquant' ); ?></p>
    <?php echo do_shortcode( '[sinaquant_newsletter_form]' ); ?>
    <p class="disclaimer" style="margin-top:16px"><?php esc_html_e( 'No spam · Unsubscribe in one click', 'sinaquant' ); ?></p>
  </div>
</section>

</main>

<?php
get_footer();
