<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Bounded from '$lib/components/Bounded.svelte';

	let activeTab = 'users';

	const tabs = [
		{ id: 'users', label: 'For Users' },
		{ id: 'executives', label: 'For Pickup Executives' },
		{ id: 'centers', label: 'For Collection Centers' }
	];

	const steps = {
		users: [
			{
				title: 'Login & Setup',
				description: 'Securely log in via OTP. Add your name and address for seamless pickups.',
				icon: '🔐'
			},
			{
				title: 'Request Pickup',
				description: 'Select plastic items, estimate weight (min 5kg), and choose a pickup date.',
				icon: '📱'
			},
			{
				title: 'Track Your Request',
				description: 'Monitor your pickup status in real-time, from assignment to completion.',
				icon: '📍'
			},
			{
				title: 'Contribute & Earn',
				description: 'Dispose of plastic responsibly and potentially earn rewards or credits.',
				icon: '🎁'
			}
		],
		executives: [
			{
				title: 'Register & Verify',
				description: 'Join through a collection center and complete verification process.',
				icon: '✅'
			},
			{
				title: 'Receive Assignments',
				description: 'Get notified of pickup requests in your service area.',
				icon: '📬'
			},
			{
				title: 'Collect & Document',
				description: 'Pick up plastic waste and document with photos and weight.',
				icon: '📸'
			},
			{
				title: 'Deliver to Center',
				description: 'Transport collected plastic to designated collection centers.',
				icon: '🚚'
			}
		],
		centers: [
			{
				title: 'Admin Verification',
				description: 'Complete registration and undergo admin verification process.',
				icon: '🏢'
			},
			{
				title: 'Define Service Area',
				description: 'Set your operational zones by pincode for efficient coverage.',
				icon: '🗺️'
			},
			{
				title: 'Manage Executives',
				description: 'Onboard and manage pickup executives in your network.',
				icon: '👥'
			},
			{
				title: 'Process Collections',
				description: 'Receive, sort, and process plastic waste for recycling.',
				icon: '♻️'
			}
		]
	};

	onMount(() => {
		if (!browser) return;

		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		gsap.fromTo('.journey-title',
			{ opacity: 0, y: 30 },
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				scrollTrigger: {
					trigger: '.journey-section',
					start: 'top 80%',
				}
			}
		);
	});

	function animateSteps() {
		if (!browser) return;
		
		gsap.fromTo('.step-card',
			{ opacity: 0, x: -30 },
			{
				opacity: 1,
				x: 0,
				duration: 0.5,
				stagger: 0.15
			}
		);
	}

	$: if (activeTab && browser) {
		setTimeout(animateSteps, 50);
	}
</script>

<Bounded data-slice-type="journey_steps" data-slice-variation="default">
	<div id="how-it-works" class="journey-section mx-auto max-w-7xl">
		<h2 class="journey-title text-4xl md:text-6xl font-bold text-center mb-4 text-gray-900">
			Your Journey with Eco Sorter
		</h2>
		<p class="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto">
			A clear, step-by-step process tailored for each participant in our plastic recycling ecosystem.
		</p>

		<!-- Tabs -->
		<div class="flex flex-wrap justify-center gap-4 mb-12">
			{#each tabs as tab}
				<button
					on:click={() => activeTab = tab.id}
					class="px-6 py-3 rounded-lg font-semibold transition-all duration-300 {activeTab === tab.id ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Steps Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each steps[activeTab] as step, index}
				<div class="step-card glass-container p-6 bg-white hover:shadow-xl transition-all duration-300 group">
					<div class="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
					<div class="flex items-center gap-3 mb-3">
						<div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
							{index + 1}
						</div>
						<h3 class="text-xl font-bold text-gray-900">{step.title}</h3>
					</div>
					<p class="text-gray-600 leading-relaxed">{step.description}</p>
				</div>
			{/each}
		</div>
	</div>
</Bounded>
