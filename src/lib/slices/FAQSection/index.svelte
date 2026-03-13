<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Bounded from '$lib/components/Bounded.svelte';

	let openIndex = null;

	const faqs = [
		{
			question: 'How do I request a plastic waste pickup?',
			answer: 'Simply log in to the Eco Sorter app, select the plastic items you want to dispose of, estimate the weight (minimum 5kg required), choose a convenient pickup date, and submit your request. You\'ll receive confirmation and can track the status in real-time.'
		},
		{
			question: 'Is there a minimum amount of plastic required for pickup?',
			answer: 'Yes, we require a minimum of 5kg of plastic waste for pickup requests. This helps us optimize routes and ensure efficient collection operations while maintaining service quality for all users.'
		},
		{
			question: 'How can I become a Pickup Executive?',
			answer: 'To become a Pickup Executive, you need to register through a verified Collection Center in your area. The center will guide you through the onboarding process, including verification and training on using the Eco Sorter platform.'
		},
		{
			question: 'What types of plastic do you collect?',
			answer: 'We collect various types of recyclable plastic including PET bottles, HDPE containers, plastic bags, and other common household plastic waste. Our pickup executives can guide you on acceptable items during collection.'
		},
		{
			question: 'How are Collection Centers verified?',
			answer: 'All Collection Centers undergo a stringent admin verification process. This includes documentation review, facility inspection, and compliance checks to ensure they meet our standards for responsible plastic waste management and recycling.'
		}
	];

	function toggleFAQ(index) {
		openIndex = openIndex === index ? null : index;
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		gsap.fromTo('.faq-item',
			{ opacity: 0, x: -20 },
			{
				opacity: 1,
				x: 0,
				duration: 0.5,
				stagger: 0.1,
				scrollTrigger: {
					trigger: '.faq-list',
					start: 'top 80%',
				}
			}
		);
	});
</script>

<Bounded data-slice-type="faq_section" data-slice-variation="default">
	<div id="faq" class="mx-auto max-w-4xl">
		<h2 class="text-4xl md:text-6xl font-bold text-center mb-6 text-gray-900">
			Frequently Asked Questions
		</h2>
		<p class="text-center text-gray-600 text-lg mb-12">
			Find answers to common queries about Eco Sorter and our services.
		</p>

		<div class="faq-list space-y-4">
			{#each faqs as faq, index}
				<div class="faq-item glass-container bg-white overflow-hidden transition-all duration-300 {openIndex === index ? 'shadow-lg border-emerald-400' : ''}">
					<button
						on:click={() => toggleFAQ(index)}
						class="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-emerald-50 transition-colors duration-200"
					>
						<span class="font-semibold text-gray-900 text-lg pr-4">{faq.question}</span>
						<svg
							class="w-6 h-6 flex-shrink-0 text-emerald-600 transition-transform duration-300 {openIndex === index ? 'rotate-180' : ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
						</svg>
					</button>
					{#if openIndex === index}
						<div class="px-6 pb-6 text-gray-600 leading-relaxed animate-fadeIn">
							{faq.answer}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Bounded>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.3s ease-out;
	}
</style>
