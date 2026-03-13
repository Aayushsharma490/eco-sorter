<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { centersAPI } from '$lib/api';

	let centers = [];
	let loading = true;

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('token');
			const role = localStorage.getItem('userRole');
			
			if (!token || role !== 'admin') {
				goto('/login');
				return;
			}

			await loadCenters();
		}
	});

	const loadCenters = async () => {
		try {
			const response = await centersAPI.getAll();
			if (response.success) {
				centers = response.data;
			}
		} catch (error) {
			console.error('Error fetching centers:', error);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Manage Centers - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<button 
					on:click={() => goto('/dashboard/admin')}
					class="text-emerald-600 hover:text-emerald-700 mb-2 flex items-center gap-2"
				>
					← Back to Dashboard
				</button>
				<h1 class="text-4xl font-bold text-gray-900">Collection Centers</h1>
				<p class="text-gray-600 mt-2">🏢 Where waste transforms into opportunity</p>
			</div>
		</div>

		<!-- Centers Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#if loading}
				<div class="col-span-full text-center py-12">
					<p class="text-gray-600">Loading centers...</p>
				</div>
			{:else if centers.length === 0}
				<div class="col-span-full text-center py-12">
					<p class="text-gray-600">No centers found</p>
				</div>
			{:else}
				{#each centers as center}
					<div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-purple-400 transition-all">
						<!-- Center Header -->
						<div class="flex items-center gap-4 mb-4">
							<div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-3xl text-white">
								🏢
							</div>
							<div class="flex-1">
								<h3 class="text-xl font-bold text-gray-900">{center.name}</h3>
								<p class="text-sm text-gray-600">📍 {center.address?.city || 'Location'}</p>
							</div>
						</div>

						<!-- Address -->
						<div class="bg-gray-50 rounded-lg p-4 mb-4">
							<p class="text-sm text-gray-700">
								{center.address?.street || ''}<br/>
								{center.address?.city || ''}, {center.address?.state || ''}<br/>
								{center.address?.pincode || ''}
							</p>
						</div>

						<!-- Contact -->
						{#if center.contact}
							<div class="mb-4">
								<p class="text-sm text-gray-600">📞 {center.contact.phone || 'N/A'}</p>
								<p class="text-sm text-gray-600">📧 {center.contact.email || 'N/A'}</p>
							</div>
						{/if}

						<!-- Serviceable Areas -->
						{#if center.serviceableAreas && center.serviceableAreas.length > 0}
							<div class="mb-4">
								<p class="text-sm font-semibold text-gray-700 mb-2">Serviceable Areas:</p>
								<div class="flex flex-wrap gap-2">
									{#each center.serviceableAreas as area}
										<span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
											{area}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Stats -->
						<div class="grid grid-cols-2 gap-3 mb-4">
							<div class="bg-emerald-50 rounded-lg p-3">
								<p class="text-xs text-gray-600">Status</p>
								<p class="text-sm font-bold text-emerald-600">✅ Active</p>
							</div>
							<div class="bg-blue-50 rounded-lg p-3">
								<p class="text-xs text-gray-600">Areas Covered</p>
								<p class="text-sm font-bold text-blue-600">{center.serviceableAreas?.length || 0}</p>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex gap-2">
							<button class="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-all">
								View Details
							</button>
							<button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-all">
								✏️
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
