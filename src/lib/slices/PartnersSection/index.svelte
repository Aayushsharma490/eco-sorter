<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Bounded from '$lib/components/Bounded.svelte';

	const partners = [
		{ name: 'Pacific Institute of Medical Sciences (PIMS)', logo: '🏥' },
		{ name: 'RO-RPCB Udaipur', logo: '🏛️' },
		{ name: 'Sai Tirupati University', logo: '🎓' },
		{ name: 'Environmental Partners', logo: '🌱' },
		{ name: 'Recycling Initiatives', logo: '♻️' },
		{ name: 'Community Organizations', logo: '🤝' }
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		gsap.fromTo('.partner-card',
			{ opacity: 0, scale: 0.8 },
			{
				opacity: 1,
				scale: 1,
				duration: 0.5,
				stagger: 0.1,
				scrollTrigger: {
					trigger: '.partners-grid',
					start: 'top 80%',
				}
			}
		);
	});
</script>

<Bounded data-slice-type="partners_section" data-slice-variation="default">
	<div id="partners" class="mx-auto max-w-7xl">
		<h2 class="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900">
			Our Valued Partners & Supporters
		</h2>
		<p class="text-center text-gray-600 text-lg mb-16 max-w-3xl mx-auto">
			We are proud to collaborate with organizations that share our vision for a sustainable future.
		</p>

		<div class="partners-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
			{#each partners as partner}
				<div class="partner-card glass-container p-6 bg-white hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center group hover:border-emerald-400">
					<div class="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{partner.logo}</div>
					<p class="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">{partner.name}</p>
				</div>
			{/each}
		</div>

		<!-- PIMS Health Rewards Section -->
		<div class="mt-20 glass-container p-8 md:p-12 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
			<div class="max-w-4xl mx-auto text-center">
				<h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
					Eco Sorter Health Rewards
				</h3>
				<p class="text-xl text-gray-700 mb-6">
					Recycle plastic, earn PIMS health vouchers. An RO-RPCB Udaipur initiative.
				</p>
				<div class="bg-white rounded-lg p-6 mb-6 shadow-md">
					<h4 class="text-2xl font-bold text-emerald-600 mb-4">Turn Plastic Waste into Wellness</h4>
					<p class="text-gray-700 leading-relaxed mb-4">
						Join Eco Sorter, Pacific Institute of Medical Sciences (PIMS), Udaipur, and RO-RPCB. Recycle your plastic bottles to earn valuable PIMS health vouchers—a smart step for our planet and your health.
					</p>
				</div>

				<div class="grid md:grid-cols-2 gap-6 mb-6">
					<div class="bg-white rounded-lg p-6 shadow-md text-left">
						<h5 class="font-bold text-gray-900 mb-2">📞 Contact PIMS</h5>
						<p class="text-gray-700">0294-3510000</p>
					</div>
					<div class="bg-white rounded-lg p-6 shadow-md text-left">
						<h5 class="font-bold text-gray-900 mb-2">🌐 Visit Website</h5>
						<a href="https://www.saitirupatiuniversity.ac.in" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-700 underline">
							www.saitirupatiuniversity.ac.in
						</a>
					</div>
				</div>

				<p class="text-gray-600 italic">
					Let's make a difference, one bottle at a time. Start collecting and recycling today!
				</p>
			</div>
		</div>
	</div>
</Bounded>
