<script>
	import Hero from '$lib/slices/Hero/index.svelte';
	import JourneySteps from '$lib/slices/JourneySteps/index.svelte';
	import WhyEcoSorter from '$lib/slices/WhyEcoSorter/index.svelte';
	import RewardsSection from '$lib/slices/RewardsSection/index.svelte';
	import RecyclingPoints from '$lib/slices/RecyclingPoints/index.svelte';
	import FAQSection from '$lib/slices/FAQSection/index.svelte';
	import PartnersSection from '$lib/slices/PartnersSection/index.svelte';

	// Mock slice data for static rendering
	const heroSlice = {
		slice_type: 'hero',
		variation: 'default'
	};
</script>

<svelte:head>
	<title>Eco Sorter - Revolutionize Plastic Waste Management</title>
	<meta name="description" content="Streamline plastic collection process, connecting users, pickup executives, and collection centers for a cleaner tomorrow." />
</svelte:head>

<Hero slice={heroSlice} />
<JourneySteps />
<WhyEcoSorter />
<RewardsSection />
<RecyclingPoints />
<FAQSection />
<PartnersSection />
