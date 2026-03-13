<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { centersAPI } from '$lib/api';

	let centers = [];
	let loading = true;

	onMount(async () => {
		if (!browser) return;

		// Fetch centers from backend
		try {
			const response = await centersAPI.getAll();
			if (response.success) {
				centers = response.data.map(center => ({
					name: center.name,
					address: center.address?.fullAddress || `${center.address?.city}, ${center.address?.state}`,
					areas: center.serviceableAreas || []
				}));
			}
		} catch (error) {
			console.error('Error fetching centers:', error);
		} finally {
			loading = false;
		}

		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		gsap.fromTo('.center-card',
			{ opacity: 0, y: 50 },
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.2,
				scrollTrigger: {
					trigger: '.centers-grid',
					start: 'top 80%',
				}
			}
		);
	});
</script>

<svelte:head>
	<title>Collection Centers - Eco Sorter</title>
	<meta name="description" content="Find verified collection centers actively participating in our plastic waste management program." />
</svelte:head>

<div class="min-h-screen py-20 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
				Our Network of Collection Centers
			</h1>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				Find verified centers actively participating in our plastic waste management program.
			</p>
		</div>

		<!-- Centers Grid -->
		<div class="centers-grid space-y-8">
			{#if loading}
				<div class="text-center py-16">
					<p class="text-xl text-gray-600">Loading collection centers...</p>
				</div>
			{:else if centers.length === 0}
				<div class="text-center py-16">
					<p class="text-xl text-gray-600">No collection centers available at the moment.</p>
				</div>
			{:else}
				{#each centers as center}
					<div class="center-card glass-container p-8 bg-white hover:shadow-2xl transition-all duration-300">
						<div class="flex flex-col md:flex-row gap-6">
							<!-- Center Icon -->
							<div class="flex-shrink-0">
								<div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-4xl shadow-lg">
									🏢
								</div>
							</div>

							<!-- Center Details -->
							<div class="flex-1">
								<h2 class="text-3xl font-bold text-gray-900 mb-3">{center.name}</h2>
								<div class="flex items-start gap-2 text-gray-600 mb-6">
									<span class="text-xl mt-1">📍</span>
									<p class="text-lg">{center.address}</p>
								</div>

								<!-- Serviceable Areas -->
								{#if center.areas && center.areas.length > 0}
									<div>
										<h3 class="text-xl font-semibold text-emerald-600 mb-4">Serviceable Areas:</h3>
										<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
											{#each center.areas as area}
												<div class="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 hover:border-emerald-400 transition-colors">
													<span class="text-emerald-600 font-semibold">{area.areaName}</span>
													<span class="text-gray-600 text-sm">(Pincode: {area.pincode})</span>
												</div>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<!-- CTA Section -->
		<div class="mt-16 text-center glass-container p-12 bg-gradient-to-br from-emerald-50 to-green-50">
			<h2 class="text-3xl font-bold text-gray-900 mb-4">Want to become a Collection Center?</h2>
			<p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
				Join our network and help make a difference in plastic waste management. Contact us to learn about the verification process.
			</p>
			<a href="/contact" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
				Contact Us
			</a>
		</div>
	</div>
</div>
