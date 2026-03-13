<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { statsAPI, authAPI, pickupsAPI, dustbinsAPI, centersAPI, usersAPI } from '$lib/api';

	let totalUsers = 0;
	let totalExecutives = 0;
	let totalCenters = 0;
	let totalCollections = 0;
	let dustbins = [];
	let recentActivity = [];
	let loading = true;
	let executivesData = [];
	let centersData = [];

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('token');
			const userRole = localStorage.getItem('userRole');
			
			console.log('Admin Dashboard - Token:', token ? 'exists' : 'missing');
			console.log('Admin Dashboard - Role:', userRole);
			
			if (!token) {
				console.log('No token found, redirecting to login');
				goto('/login');
				return;
			}

			// Don't redirect if not admin, just show message
			if (userRole !== 'admin') {
				console.warn('User is not admin, role:', userRole);
			}

			try {
				const [statsResponse, pickupsResponse, dustbinsResponse, centersResponse, usersResponse] = await Promise.all([
					statsAPI.getAdminStats(),
					pickupsAPI.getAll(),
					dustbinsAPI.getAll(),
					centersAPI.getAll(),
					usersAPI.getAll()
				]);

				console.log('Stats Response:', statsResponse);

				if (statsResponse.success) {
					totalUsers = statsResponse.data.totalUsers;
					totalExecutives = statsResponse.data.totalExecutives;
					totalCenters = statsResponse.data.totalCenters;
					totalCollections = statsResponse.data.totalCollections;
				}

				if (pickupsResponse.success) {
					recentActivity = pickupsResponse.data
						.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
						.slice(0, 6);
				}

				if (dustbinsResponse.success) {
					dustbins = dustbinsResponse.data.filter(d => d.level >= 70);
				}

				if (centersResponse.success) {
					centersData = centersResponse.data;
				}

				if (usersResponse.success) {
					executivesData = usersResponse.data.filter(u => u.role === 'executive');
				}
			} catch (error) {
				console.error('Error fetching stats:', error);
				// Don't redirect on API error, just show error
				alert('Error loading dashboard data: ' + error.message);
			} finally {
				loading = false;
			}
		}
	});

	const handleLogout = () => {
		if (browser) {
			authAPI.logout();
		}
		goto('/login');
	};

	const getStatusColor = (status) => {
		if (status === 'critical') return 'bg-red-500';
		if (status === 'moderate') return 'bg-yellow-500';
		return 'bg-green-500';
	};

	const getActivityIcon = (status) => {
		switch (status) {
			case 'completed': return '✅';
			case 'accepted': return '🚚';
			case 'pending': return '📅';
			default: return '📦';
		}
	};

	const getActivityBgColor = (status) => {
		switch (status) {
			case 'completed': return 'bg-emerald-50';
			case 'accepted': return 'bg-blue-50';
			case 'pending': return 'bg-yellow-50';
			default: return 'bg-gray-50';
		}
	};

	const getActivityText = (pickup) => {
		switch (pickup.status) {
			case 'completed':
				return `${pickup.actualWeight}kg collected • +${pickup.creditsEarned} credits`;
			case 'accepted':
				return `Executive: ${pickup.executive?.name || 'Assigned'}`;
			case 'pending':
				return `User: ${pickup.user?.name || 'Unknown'}`;
			default:
				return pickup.status;
		}
	};

	const getActivityTitle = (status) => {
		switch (status) {
			case 'completed': return 'Pickup Completed';
			case 'accepted': return 'Pickup In Progress';
			case 'pending': return 'Pickup Scheduled';
			default: return 'Pickup';
		}
	};

	const getRelativeTime = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 60) return `${diffMins} min ago`;
		if (diffHours < 24) return `${diffHours} hours ago`;
		return `${diffDays} days ago`;
	};
</script>

<svelte:head>
	<title>Admin Dashboard - Eco Sorter</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
				<p class="text-gray-600 mt-2">🌍 Managing the future of waste management, one pickup at a time</p>
			</div>
			<button
				on:click={handleLogout}
				class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300"
			>
				Logout
			</button>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Total Users</p>
						<p class="text-4xl font-bold text-blue-600 mt-2">{totalUsers}</p>
					</div>
					<div class="text-5xl">👥</div>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Pickup Executives</p>
						<p class="text-4xl font-bold text-emerald-600 mt-2">{totalExecutives}</p>
					</div>
					<div class="text-5xl">🚚</div>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Collection Centers</p>
						<p class="text-4xl font-bold text-purple-600 mt-2">{totalCenters}</p>
					</div>
					<div class="text-5xl">🏢</div>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Total Collections (kg)</p>
						<p class="text-4xl font-bold text-orange-600 mt-2">{totalCollections}</p>
					</div>
					<div class="text-5xl">♻️</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Dustbin Monitoring -->
			<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">🗑️ Dustbin Level Monitoring</h2>
				
				{#if loading}
					<div class="text-center py-8">
						<p class="text-gray-600">Loading dustbins...</p>
					</div>
				{:else if dustbins.length === 0}
					<div class="text-center py-8">
						<p class="text-gray-600">No critical dustbins at the moment</p>
					</div>
				{:else}
					<div class="space-y-4">
						{#each dustbins as dustbin}
							<div class="p-4 bg-gray-50 rounded-xl border border-gray-200">
								<div class="flex justify-between items-center mb-2">
									<h3 class="font-bold text-gray-900">{dustbin.location}</h3>
									<span class="px-3 py-1 rounded-full text-xs font-semibold {getStatusColor(dustbin.status)} text-white">
										{dustbin.status.toUpperCase()}
									</span>
								</div>
								{#if dustbin.user}
									<p class="text-sm text-gray-600 mb-2">👤 {dustbin.user.name}</p>
								{/if}
								<div class="flex items-center gap-3">
									<div class="flex-1 bg-gray-200 rounded-full h-3">
										<div class="{getStatusColor(dustbin.status)} h-3 rounded-full transition-all duration-500" style="width: {dustbin.level}%"></div>
									</div>
									<span class="text-sm font-bold text-gray-700">{dustbin.level}%</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Quick Actions -->
			<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">⚡ Quick Actions</h2>
				<div class="grid grid-cols-2 gap-4">
					<a 
						href="/dashboard/admin/users"
						class="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
					>
						<div class="text-4xl mb-2">👤</div>
						<p class="font-semibold">Manage Users</p>
						<p class="text-sm text-white/80 mt-1">{totalUsers} active users</p>
					</a>
					<a 
						href="/dashboard/admin/executives"
						class="p-6 bg-gradient-to-br from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
					>
						<div class="text-4xl mb-2">🚚</div>
						<p class="font-semibold">Manage Executives</p>
						<p class="text-sm text-white/80 mt-1">{totalExecutives} on duty</p>
					</a>
					<a 
						href="/dashboard/admin/centers"
						class="p-6 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
					>
						<div class="text-4xl mb-2">🏢</div>
						<p class="font-semibold">Manage Centers</p>
						<p class="text-sm text-white/80 mt-1">{totalCenters} collection points</p>
					</a>
					<a 
						href="/dashboard/admin/reports"
						class="p-6 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
					>
						<div class="text-4xl mb-2">📊</div>
						<p class="font-semibold">View Reports</p>
						<p class="text-sm text-white/80 mt-1">{totalCollections}kg recycled</p>
					</a>
				</div>
			</div>
		</div>

		<!-- Recent System Activity -->
		<div class="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">📊 Recent System Activity</h2>
			{#if loading}
				<div class="text-center py-8">
					<p class="text-gray-600">Loading activity...</p>
				</div>
			{:else if recentActivity.length === 0}
				<div class="text-center py-8">
					<p class="text-gray-600">No recent activity</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each recentActivity as activity}
						<div class="flex items-center gap-4 p-4 {getActivityBgColor(activity.status)} rounded-xl">
							<div class="text-2xl">{getActivityIcon(activity.status)}</div>
							<div class="flex-1">
								<p class="font-semibold text-gray-900">{getActivityTitle(activity.status)}</p>
								<p class="text-sm text-gray-600">{getActivityText(activity)}</p>
								<p class="text-xs text-gray-500 mt-1">{getRelativeTime(activity.createdAt)}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
