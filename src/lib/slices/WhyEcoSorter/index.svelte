<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Bounded from '$lib/components/Bounded.svelte';

	const features = [
		{
			title: 'Secure OTP Verification',
			description: 'Robust two-factor authentication via mobile OTP ensures secure access for all user roles, safeguarding platform integrity.',
			icon: '🔒'
		},
		{
			title: 'Admin Verified Centers',
			description: 'Collection Centers undergo stringent admin verification, building a trusted and reliable network for effective waste management.',
			icon: '✓'
		},
		{
			title: 'Serviceable Area Mapping',
			description: 'Centers precisely define operational zones by pincode, optimizing pickup routes and ensuring efficient service delivery.',
			icon: '🗺️'
		},
		{
			title: 'Streamlined Executive Onboarding',
			description: 'Intuitive process for Centers to add, verify, and manage pickup executives, integrating them directly into the operational workflow.',
			icon: '👤'
		},
		{
			title: 'Role-Based Dashboards',
			description: 'Tailored interfaces and feature sets for Households, Executives, and Centers, providing an optimal and relevant user experience.',
			icon: '📊'
		},
		{
			title: 'Real-time Pickup Tracking',
			description: 'Users gain live visibility into their pickup request status, from initial assignment through to executive arrival and final completion.',
			icon: '📍'
		},
		{
			title: 'Transparent Collection Proof',
			description: 'Executives submit verifiable collection evidence (weight, photos), fostering accountability and trust throughout the process.',
			icon: '📸'
		},
		{
			title: 'Flexible Rescheduling',
			description: 'Convenient options for users to request pickup rescheduling, with seamless reassignment managed by Collection Centers.',
			icon: '📅'
		},
		{
			title: 'Multi-Language Ready (Future)',
			description: 'Designed for future multilingual support, aiming to enhance accessibility and user experience across diverse regions.',
			icon: '🌐'
		}
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		gsap.fromTo('.feature-card',
			{ opacity: 0, y: 50 },
			{
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.1,
				scrollTrigger: {
					trigger: '.features-grid',
					start: 'top 80%',
				}
			}
		);
	});
</script>

<Bounded data-slice-type="why_eco_sorter" data-slice-variation="default">
	<div id="platform" class="mx-auto max-w-7xl">
		<h2 class="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900">
			Why Eco Sorter Excels
		</h2>
		<p class="text-center text-gray-600 text-lg mb-16 max-w-3xl mx-auto">
			Engineered with precision and a user-centric approach, our platform delivers unparalleled efficiency and reliability in plastic waste management.
		</p>

		<div class="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each features as feature}
				<div class="feature-card glass-container p-8 bg-white hover:shadow-xl transition-all duration-300 group hover:border-emerald-400">
					<div class="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">{feature.title}</h3>
					<p class="text-gray-600 leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</Bounded>
