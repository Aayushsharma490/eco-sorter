<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { statsAPI, pickupsAPI, usersAPI } from '$lib/api';

	let loading = true;
	let totalPickups = 0;
	let completedPickups = 0;
	let totalWeight = 0;
	let totalCredits = 0;
	let topUsers = [];
	let topExecutives = [];
	let monthlyData = [];

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('token');
			const role = localStorage.getItem('userRole');
			
			if (!token || role !== 'admin') {
				goto('/login');
				return;
			}

			await loadReports();
		}
	});

	const loadReports = async () => {
		try {
			const [pickupsResponse, usersResponse] = await Promise.all([
				pickupsAPI.getAll(),
				usersAPI.getAll()
			]);

			if (pickupsResponse.success) {
				const pickups = pickupsResponse.data;
				totalPickups = pickups.length;
				completedPickups = pickups.filter(p => p.status === 'completed').length;
				totalWeight = pickups
					.filter(p => p.status === 'completed')
					.reduce((sum, p) => sum + (p.actualWeight || 0), 0);
				totalCredits = pickups
					.filter(p => p.status === 'completed')
					.reduce((sum, p) => sum + (p.creditsEarned || 0), 0);
			}

			if (usersResponse.success) {
				const users = usersResponse.data.filter(u => u.role === 'user');
				topUsers = users
					.sort((a, b) => (b.credits || 0) - (a.credits || 0))
					.slice(0, 5);

				const executives = usersResponse.data.filter(u => u.role === 'executive');
				topExecutives = executives.slice(0, 5);
			}
		} catch (error) {
			console.error('Error fetching reports:', error);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Reports & Analytics - Admin Dashboard</title>
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
				<h1 class="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
				<p class="text-gray-600 mt-2">📊 Data-driven insights for a greener tomorrow</p>
			</div>
		</div>

		{#if loading}
			<div class="text-center py-12">
				<p class="text-gray-600">Loading reports...</p>
			</div>
		{:else}
			<!-- Key Metrics -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
					<div class="text-4xl mb-2">📦</div>
					<p class="text-white/80 text-sm">Total Pickups</p>
					<p class="text-4xl font-bold mt-2">{totalPickups}</p>
				</div>

				<div class="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg">
					<div class="text-4xl mb-2">✅</div>
					<p class="text-white/80 text-sm">Completed</p>
					<p class="text-4xl font-bold mt-2">{completedPickups}</p>
				</div>

				<div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
					<div class="text-4xl mb-2">⚖️</div>
					<p class="text-white/80 text-sm">Total Weight</p>
					<p class="text-4xl font-bold mt-2">{totalWeight}kg</p>
				</div>

				<div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
					<div class="text-4xl mb-2">💰</div>
					<p class="text-white/80 text-sm">Credits Earned</p>
					<p class="text-4xl font-bold mt-2">{totalCredits}</p>
				</div>
			</div>

			<!-- Leaderboards -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<!-- Top Users -->
				<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
					<h3 class="text-xl font-bold text-gray-900 mb-4">🏆 Top Users by Credits</h3>
					<div class="space-y-3">
						{#each topUsers as user, index}
							<div class="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
								<div class="text-2xl font-bold text-emerald-600">#{index + 1}</div>
								<div class="flex-1">
									<p class="font-semibold text-gray-900">{user.name}</p>
									<p class="text-sm text-gray-600">{user.email}</p>
								</div>
								<div class="text-right">
									<p class="text-2xl font-bold text-emerald-600">{user.credits || 0}</p>
									<p class="text-xs text-gray-600">credits</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Top Executives -->
				<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
					<h3 class="text-xl font-bold text-gray-900 mb-4">🚚 Active Executives</h3>
					<div class="space-y-3">
						{#each topExecutives as executive, index}
							<div class="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
								<div class="text-2xl font-bold text-blue-600">#{index + 1}</div>
								<div class="flex-1">
									<p class="font-semibold text-gray-900">{executive.name}</p>
									<p class="text-sm text-gray-600">{executive.email}</p>
								</div>
								<div class="text-right">
									<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
										Active
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Impact Stats -->
			<div class="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-white">
				<h3 class="text-3xl font-bold mb-6 text-center">🌍 Environmental Impact</h3>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="text-center">
						<div class="text-5xl mb-2">♻️</div>
						<p class="text-4xl font-bold">{totalWeight}kg</p>
						<p class="text-emerald-100 mt-2">Plastic Recycled</p>
					</div>
					<div class="text-center">
						<div class="text-5xl mb-2">🌳</div>
						<p class="text-4xl font-bold">{Math.floor(totalWeight / 10)}</p>
						<p class="text-emerald-100 mt-2">Trees Saved</p>
					</div>
					<div class="text-center">
						<div class="text-5xl mb-2">💧</div>
						<p class="text-4xl font-bold">{Math.floor(totalWeight * 5)}L</p>
						<p class="text-emerald-100 mt-2">Water Conserved</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
