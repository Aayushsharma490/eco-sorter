<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/landing');
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
	<div class="text-center">
		<div class="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
		<p class="text-gray-600 font-medium">Loading Eco Sorter...</p>
	</div>
</div>
