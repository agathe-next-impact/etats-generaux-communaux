<?php
/**
 * Template Name: Les EGC
 * Description: Template pour la page Les États Généraux Communaux
 */

get_header(); ?>

<div class="min-h-screen">
    <?php
    // Récupération des champs ACF
    $hero = get_field('hero_section');
    $what = get_field('what_section');
    $who = get_field('who_section');
    $context = get_field('context_section');
    $why_commune = get_field('why_commune_section');
    $how_to_act = get_field('how_to_act_section');
    $doleances = get_field('doleances_section');
    $who_can_organize = get_field('who_can_organize_section');
    $after_elections = get_field('after_elections_section');
    $link_egc_acc = get_field('link_egc_acc_section');
    $help = get_field('help_section');
    $cta = get_field('cta_section');
    ?>

    <!-- Hero Section -->
    <?php if ($hero): ?>
    <section class="relative py-20 lg:py-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center space-y-8">
                <div class="space-y-4">
                    <?php if ($hero['badge']): ?>
                    <span class="inline-block px-3 py-1 text-sm bg-secondary/20 text-secondary-foreground rounded-full mb-4">
                        <?php echo esc_html($hero['badge']); ?>
                    </span>
                    <?php endif; ?>
                    
                    <?php if ($hero['title']): ?>
                    <h1 class="magazine-title text-4xl md:text-6xl lg:text-7xl font-light text-foreground">
                        <?php echo esc_html($hero['title']); ?>
                    </h1>
                    <?php endif; ?>
                    
                    <?php if ($hero['subtitle']): ?>
                    <p class="magazine-subtitle text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                        <?php echo esc_html($hero['subtitle']); ?>
                    </p>
                    <?php endif; ?>
                </div>

                <?php if ($hero['description']): ?>
                <div class="max-w-4xl mx-auto">
                    <p class="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        <?php echo esc_html($hero['description']); ?>
                    </p>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- What Section -->
    <?php if ($what): ?>
    <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div class="space-y-6">
                    <?php if ($what['title']): ?>
                    <h2 class="text-3xl md:text-4xl font-semibold text-foreground">
                        <?php echo esc_html($what['title']); ?>
                    </h2>
                    <?php endif; ?>
                    
                    <?php if ($what['content']): ?>
                    <div class="text-lg text-muted-foreground leading-relaxed">
                        <?php echo wp_kses_post($what['content']); ?>
                    </div>
                    <?php endif; ?>
                </div>
                
                <?php if ($what['image']): ?>
                <div class="relative">
                    <img src="<?php echo esc_url($what['image']['url']); ?>" 
                         alt="<?php echo esc_attr($what['image']['alt']); ?>"
                         class="rounded-lg shadow-lg w-full h-auto">
                </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Who Section -->
    <?php if ($who): ?>
    <section class="py-16 lg:py-24 bg-muted/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <?php if ($who['image']): ?>
                <div class="relative order-2 lg:order-1">
                    <img src="<?php echo esc_url($who['image']['url']); ?>" 
                         alt="<?php echo esc_attr($who['image']['alt']); ?>"
                         class="rounded-lg shadow-lg w-full h-auto">
                </div>
                <?php endif; ?>
                
                <div class="space-y-6 order-1 lg:order-2">
                    <?php if ($who['title']): ?>
                    <h2 class="text-3xl md:text-4xl font-semibold text-foreground">
                        <?php echo esc_html($who['title']); ?>
                    </h2>
                    <?php endif; ?>
                    
                    <?php if ($who['content']): ?>
                    <div class="text-lg text-muted-foreground leading-relaxed">
                        <?php echo wp_kses_post($who['content']); ?>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Context Section -->
    <?php if ($context): ?>
    <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <?php if ($context['title']): ?>
                <h2 class="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                    <?php echo esc_html($context['title']); ?>
                </h2>
                <?php endif; ?>
                
                <?php if ($context['subtitle']): ?>
                <p class="text-lg text-muted-foreground max-w-3xl mx-auto">
                    <?php echo esc_html($context['subtitle']); ?>
                </p>
                <?php endif; ?>
            </div>

            <div class="max-w-4xl mx-auto bg-card rounded-lg border p-8">
                <div class="flex items-start gap-4 mb-6">
                    <svg class="h-8 w-8 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                        <?php if ($context['election_title']): ?>
                        <h3 class="text-xl font-semibold mb-2"><?php echo esc_html($context['election_title']); ?></h3>
                        <?php endif; ?>
                        
                        <?php if ($context['election_content']): ?>
                        <p class="text-muted-foreground leading-relaxed">
                            <?php echo esc_html($context['election_content']); ?>
                        </p>
                        <?php endif; ?>
                    </div>
                </div>
                
                <?php if ($context['highlight']): ?>
                <div class="bg-primary/5 p-6 rounded-lg">
                    <p class="text-foreground font-medium">
                        <?php echo esc_html($context['highlight']); ?>
                    </p>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Why Commune Section -->
    <?php if ($why_commune && $why_commune['cards']): ?>
    <section class="py-16 lg:py-24 bg-muted/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <?php if ($why_commune['title']): ?>
                <h2 class="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                    <?php echo esc_html($why_commune['title']); ?>
                </h2>
                <?php endif; ?>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <?php foreach ($why_commune['cards'] as $card): ?>
                <div class="bg-card rounded-lg border p-6 text-center">
                    <?php
                    $icon_map = [
                        'MapPin' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>',
                        'Heart' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>',
                        'Users' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>'
                    ];
                    ?>
                    <svg class="h-12 w-12 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <?php echo $icon_map[$card['icon']] ?? ''; ?>
                    </svg>
                    
                    <?php if ($card['title']): ?>
                    <h3 class="text-xl font-semibold mb-3"><?php echo esc_html($card['title']); ?></h3>
                    <?php endif; ?>
                    
                    <?php if ($card['content']): ?>
                    <p class="text-muted-foreground"><?php echo esc_html($card['content']); ?></p>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- CTA Section -->
    <?php if ($cta): ?>
    <section class="py-16 lg:py-24">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="space-y-8">
                <?php if ($cta['title']): ?>
                <h2 class="text-3xl md:text-4xl font-semibold text-foreground">
                    <?php echo esc_html($cta['title']); ?>
                </h2>
                <?php endif; ?>
                
                <?php if ($cta['description']): ?>
                <p class="text-lg text-muted-foreground leading-relaxed">
                    <?php echo esc_html($cta['description']); ?>
                </p>
                <?php endif; ?>
                
                <?php if ($cta['buttons']): ?>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <?php foreach ($cta['buttons'] as $button): ?>
                    <a href="<?php echo esc_url($button['url']); ?>" 
                       class="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md transition-colors <?php echo $button['style'] === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'; ?>">
                        <?php echo esc_html($button['text']); ?>
                    </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>
</div>

<?php get_footer(); ?>
