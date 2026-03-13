<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { PrismicText } from '@prismicio/svelte';

	import Bounded from '$lib/components/Bounded.svelte';
	import TriangleGrid from '$lib/components/TriangleGrid.svelte';

	/** @type {import("@prismicio/client").Content.HeroSlice} */
	export let slice;

	let particlesContainer;

	onMount(() => {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;

		if (prefersReducedMotion) {
			gsap.set('.hero__heading, .hero__body, .hero__button, .hero__image', {
				opacity: 1
			});

			return;
		}

		// Particle animation - plastic waste transforming to leaves
		const createParticles = () => {
			if (!particlesContainer) return;
			
			for (let i = 0; i < 30; i++) {
				const particle = document.createElement('div');
				particle.className = 'particle';
				particle.style.cssText = `
					position: absolute;
					width: ${Math.random() * 8 + 4}px;
					height: ${Math.random() * 8 + 4}px;
					background: ${Math.random() > 0.5 ? '#10b981' : '#059669'};
					border-radius: 50%;
					opacity: ${Math.random() * 0.5 + 0.3};
					left: ${Math.random() * 100}%;
					top: ${Math.random() * 100}%;
				`;
				particlesContainer.appendChild(particle);

				gsap.to(particle, {
					y: `${Math.random() * 200 - 100}`,
					x: `${Math.random() * 200 - 100}`,
					opacity: 0,
					duration: Math.random() * 3 + 2,
					repeat: -1,
					ease: 'power1.inOut'
				});
			}
		};

		createParticles();

		const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

		tl.fromTo('.hero__heading', { scale: 0.5 }, { scale: 1, opacity: 1, duration: 1.4 });
		tl.fromTo('.hero__body', { y: 20 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.6');
		tl.fromTo('.hero__button', { scale: 1.5 }, { scale: 1, opacity: 1, duration: 1.3 }, '-=0.8');
		tl.fromTo('.hero__image', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.4');
	});
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div id="hero" class="relative py-12 md:py-20">
		<!-- Particle Background -->
		<div bind:this={particlesContainer} class="absolute inset-0 overflow-hidden pointer-events-none -z-10" />
		
		<TriangleGrid />

		<div class="max-w-7xl mx-auto px-4">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
				<!-- Left: Text Content -->
				<div class="text-center lg:text-left">
					<h1
						class="hero__heading text-balance text-4xl font-bold opacity-0 md:text-5xl lg:text-6xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent"
					>
						Revolutionize Plastic Waste Management with Eco Sorter
					</h1>

					<p class="hero__body mt-6 text-balance text-base text-gray-700 opacity-0 md:text-lg leading-relaxed">
						Our app streamlines the entire plastic collection process, connecting users, pickup executives, and collection centers for a cleaner tomorrow.
					</p>
					
					<div class="hero__button mt-8 opacity-0 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
						<a href="/contact" class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30 text-sm md:text-base">
							Get Started Now
						</a>
						<a href="/#how-it-works" class="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-semibold rounded-lg transition-all duration-300 text-sm md:text-base">
							Learn How It Works
						</a>
					</div>
				</div>

				<!-- Right: Hero Image -->
				<div class="hero__image opacity-0">
					<div class="relative">
						<img 
							src="/image.png" 
							alt="Eco Sorter Platform" 
							class="w-full h-auto rounded-xl md:rounded-2xl shadow-2xl"
						/>
						<!-- Decorative glow -->
						<div class="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-2xl md:blur-3xl -z-10 rounded-2xl md:rounded-3xl"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</Bounded>

