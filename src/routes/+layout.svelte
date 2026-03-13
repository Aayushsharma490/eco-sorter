<script>
	import '../app.css';
	import '@fontsource-variable/dm-sans';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Eco Sorter - Revolutionize Plastic Waste Management</title>
	<meta name="description" content="Streamline plastic collection process, connecting users, pickup executives, and collection centers for a cleaner tomorrow." />
</svelte:head>

<Header />
<main>
	<slot />
</main>
<Footer />
