<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Bounded from '$lib/components/Bounded.svelte';

	const rewardTiers = [
		{
			bottles: 10,
			title: 'Recycle 10 Bottles',
			rewards: [
				'Health Checkup / Basic Health Tests',
				'1 Reusable Bag'
			],
			color: 'from-emerald-400 to-green-500'
		},
		{
			bottles: 50,
			title: 'Recycle 50 Bottles',
			rewards: [
				'Reusable Cup or Terracotta Bottle',
				'3 Reusable Bags',
				'Advanced Health Tests'
			],
			color: 'from-green-500 to-emerald-600',
			featured: true
		},
		{
			bottles: 100,
			title: 'Recycle 100 Bottles',
			rewards: [
				'Movie Ticket Voucher',
				'Local Experience Pass (e.g., Ropeway)',
				'Food Vouchers'
			],
			color: 'from-emerald-600 to-green-700'
		}
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		gsap.fromTo('.reward-card',
			{ opacity: 0, scale: 0.9 },
			{
				opacity: 1,
				scale: 1,
				duration: 0.6,
				stagger: 0.2,
				scrollTrigger: {
					trigger: '.rewards-grid',
					start: 'top 80%',
				}
			}
		);
	});
</script>

<Bounded data-slice-type="rewards_section" data-slice-variation="default">
	<div class="mx-auto max-w-7xl">
		<h2 class="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900">
			Earn Amazing Rewards
		</h2>
		<p class="text-center text-gray-600 text-lg mb-16 max-w-3xl mx-auto">
			Your efforts in recycling plastic waste are valuable. Collect bottles and get rewarded for contributing to a cleaner environment.
		</p>

		<div class="rewards-grid grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each rewardTiers as tier}
				<div class="reward-card glass-container p-8 bg-white hover:shadow-2xl transition-all duration-300 {tier.featured ? 'md:scale-105 border-2 border-emerald-500' : ''}">
					<div class="text-center mb-6">
						<div class="inline-block px-6 py-3 bg-gradient-to-r {tier.color} text-white rounded-full font-bold text-lg mb-4 shadow-lg">
							{tier.bottles} Bottles
						</div>
						<h3 class="text-2xl font-bold text-gray-900 mb-2">{tier.title}</h3>
						{#if tier.featured}
							<span class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">Most Popular</span>
						{/if}
					</div>

					<div class="space-y-3">
						<p class="text-sm font-semibold text-gray-700 mb-3">Unlock these fantastic rewards:</p>
						{#each tier.rewards as reward}
							<div class="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
								<span class="text-emerald-600 text-xl flex-shrink-0">✓</span>
								<span class="text-gray-700">{reward}</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</Bounded>
