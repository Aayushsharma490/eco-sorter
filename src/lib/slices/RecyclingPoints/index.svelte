<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Bounded from '$lib/components/Bounded.svelte';

	const locations = [
		{
			name: 'Bombay Market',
			address: 'Fateh Sagar Road, Near Bombay Market, Udaipur, Rajasthan 313001',
			icon: '📍'
		},
		{
			name: 'Dudh Talai',
			address: 'Dudh Talai, Near Pichola Lake, Udaipur, Rajasthan 313001',
			icon: '📍'
		},
		{
			name: 'Saheliyon ki Bari',
			address: 'Saheliyon ki bari, Main Entry gate, Udaipur, Rajasthan 313001',
			icon: '📍'
		},
		{
			name: 'Sukhadia Circle',
			address: 'Sukhadia Cir, Near Bombay Market, Udaipur, Rajasthan 313001',
			icon: '📍'
		},
		{
			name: 'Jaisamand Pal',
			address: 'Jaisamand Pal, Near Ticket Counter',
			icon: '📍'
		},
		{
			name: 'Sajjangarh Vividhata Park',
			address: 'Sajjangarh Vividhata park',
			icon: '📍'
		}
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		gsap.fromTo('.location-card',
			{ opacity: 0, y: 30 },
			{
				opacity: 1,
				y: 0,
				duration: 0.5,
				stagger: 0.1,
				scrollTrigger: {
					trigger: '.locations-grid',
					start: 'top 80%',
				}
			}
		);
	});
</script>

<Bounded data-slice-type="recycling_points" data-slice-variation="default">
	<div class="mx-auto max-w-7xl">
		<h2 class="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900">
			Find Our Recycling Points
		</h2>
		<p class="text-center text-gray-600 text-lg mb-4 max-w-3xl mx-auto">
			Locate your nearest recycling point and start contributing to a cleaner environment
		</p>
		<div class="text-center mb-12">
			<a href="/centers" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
				View All Collection Centers
			</a>
		</div>

		<div class="locations-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each locations as location}
				<div class="location-card glass-container p-6 bg-white hover:shadow-xl transition-all duration-300 group hover:border-emerald-400">
					<div class="flex items-start gap-4">
						<div class="text-3xl group-hover:scale-110 transition-transform duration-300">{location.icon}</div>
						<div class="flex-1">
							<h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{location.name}</h3>
							<p class="text-gray-600 text-sm mb-4 leading-relaxed">{location.address}</p>
							<a href="/contact" class="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold text-sm group/link">
								Directions
								<svg class="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-12">
			<p class="text-gray-600 mb-4">Need help finding a location?</p>
			<a href="/contact" class="text-emerald-600 hover:text-emerald-700 font-semibold underline">Contact us</a>
		</div>
	</div>
</Bounded>
