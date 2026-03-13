<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { usersAPI, pickupsAPI } from '$lib/api';

	let executives = [];
	let loading = true;
	let executiveStats = {};

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('token');
			const role = localStorage.getItem('userRole');
			
			if (!token || role !== 'admin') {
				goto('/login');
				return;
			}

			await loadExecutives();
		}
	});

	const loadExecutives = async () => {
		try {
			const [usersResponse, pickupsResponse] = await Promise.all([
				usersAPI.getAll(),
				pickupsAPI.getAll()
			]);

			if (usersResponse.success) {
				executives = usersResponse.data.filter(u => u.role === 'executive');
				
				// Calculate stats for each executive
				if (pickupsResponse.success) {
					executives.forEach(exec => {
						const execPickups = pickupsResponse.data.filter(p => p.executiveId === exec.id);
						const completed = execPickups.filter(p => p.status === 'completed');
						const totalWeight = completed.reduce((sum, p) => sum + (p.actualWeight || 0), 0);
						
						executiveStats[exec.id] = {
							totalPickups: execPickups.length,
							completed: completed.length,
							pending: execPickups.filter(p => p.status === 'accepted').length,
							totalWeight: totalWeight
						};
					});
				}
			}
		} catch (error) {
			console.error('Error fetching executives:', error);
		} finally {
			loading = false;
		}
	};

	const getAvailabilityStatus = (execId) => {
		// Check localStorage for availability (in real app, this would be from backend)
		return 'Available';
	};
</script>

<svelte:head>
	<title>Manage Executives - Admin Dashboard</title>
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
				<h1 class="text-4xl font-bold text-gray-900">Manage Executives</h1>
				<p class="text-gray-600 mt-2">🚚 Our heroes on wheels, making the planet cleaner</p>
			</div>
		</div>

		<!-- Executives Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#if loading}
				<div class="col-span-full text-center py-12">
					<p class="text-gray-600">Loading executives...</p>
				</div>
			{:else if executives.length === 0}
				<div class="col-span-full text-center py-12">
					<p class="text-gray-600">No executives found</p>
				</div>
			{:else}
				{#each executives as executive}
					{@const stats = executiveStats[executive.id] || {}}
					<div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:border-emerald-400 transition-all">
						<!-- Executive Header -->
						<div class="flex items-center gap-4 mb-4">
							<div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-3xl text-white">
								🚚
							</div>
							<div class="flex-1">
								<h3 class="text-xl font-bold text-gray-900">{executive.name}</h3>
								<p class="text-sm text-gray-600">{executive.email}</p>
							</div>
						</div>

						<!-- Status Badge -->
						<div class="mb-4">
							<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
								✅ {getAvailabilityStatus(executive.id)}
							</span>
						</div>

						<!-- Stats Grid -->
						<div class="grid grid-cols-2 gap-3 mb-4">
							<div class="bg-blue-50 rounded-lg p-3">
								<p class="text-xs text-gray-600">Total Pickups</p>
								<p class="text-2xl font-bold text-blue-600">{stats.totalPickups || 0}</p>
							</div>
							<div class="bg-emerald-50 rounded-lg p-3">
								<p class="text-xs text-gray-600">Completed</p>
								<p class="text-2xl font-bold text-emerald-600">{stats.completed || 0}</p>
							</div>
							<div class="bg-orange-50 rounded-lg p-3">
								<p class="text-xs text-gray-600">In Progress</p>
								<p class="text-2xl font-bold text-orange-600">{stats.pending || 0}</p>
							</div>
							<div class="bg-purple-50 rounded-lg p-3">
								<p class="text-xs text-gray-600">Total Weight</p>
								<p class="text-2xl font-bold text-purple-600">{stats.totalWeight || 0}kg</p>
							</div>
						</div>

						<!-- Contact Info -->
						{#if executive.phone}
							<div class="text-sm text-gray-600 mb-2">
								📞 {executive.phone}
							</div>
						{/if}

						<!-- Actions -->
						<div class="flex gap-2 mt-4">
							<button class="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-all">
								View Details
							</button>
							<button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-all">
								📊
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
