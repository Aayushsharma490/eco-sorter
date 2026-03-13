<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { statsAPI, pickupsAPI, authAPI, locationAPI } from '$lib/api';
	import LiveMap from '$lib/components/LiveMap.svelte';

	let pendingPickups = 0;
	let completedToday = 0;
	let totalCollected = 0;
	let pickupRequests = [];
	let loading = true;
	let trackingLocation = false;
	let locationInterval;
	let activePickup = null;
	let executiveLocation = null;
	let userLocation = null;
	let isAvailable = true;

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('token');
			
			if (!token) {
				goto('/login');
				return;
			}

			// Load availability status from localStorage
			const savedAvailability = localStorage.getItem('executiveAvailable');
			if (savedAvailability !== null) {
				isAvailable = savedAvailability === 'true';
			}

			await loadData();
		}
	});

	onDestroy(() => {
		stopLocationTracking();
	});

	const loadData = async () => {
		try {
			const [statsResponse, pickupsResponse] = await Promise.all([
				statsAPI.getExecutiveStats(),
				pickupsAPI.getPending()
			]);

			if (statsResponse.success) {
				pendingPickups = statsResponse.data.pendingPickups;
				completedToday = statsResponse.data.completedToday;
				totalCollected = statsResponse.data.totalCollected;
			}

			if (pickupsResponse.success) {
				pickupRequests = pickupsResponse.data;
				
				// Check if there's an accepted pickup
				const accepted = pickupRequests.find(p => p.status === 'accepted');
				if (accepted) {
					activePickup = accepted;
					startLocationTracking();
				}
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			goto('/login');
		} finally {
			loading = false;
		}
	};

	const startLocationTracking = () => {
		if (!browser || !navigator.geolocation) return;

		trackingLocation = true;

		// Update location every 10 seconds
		locationInterval = setInterval(async () => {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					try {
						executiveLocation = {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude
						};

						await locationAPI.updateLocation(
							position.coords.latitude,
							position.coords.longitude,
							activePickup?.id
						);

						// Get user location if pickup is accepted
						if (activePickup?.userId) {
							const locResponse = await locationAPI.getPickupLocation(activePickup.id);
							if (locResponse.success) {
								userLocation = locResponse.data.userLocation;
							}
						}
					} catch (error) {
						console.error('Error updating location:', error);
					}
				},
				(error) => {
					console.error('Geolocation error:', error);
				}
			);
		}, 10000);

		// Initial location update
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					executiveLocation = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					};

					await locationAPI.updateLocation(
						position.coords.latitude,
						position.coords.longitude,
						activePickup?.id
					);
				} catch (error) {
					console.error('Error updating location:', error);
				}
			}
		);
	};

	const stopLocationTracking = () => {
		if (locationInterval) {
			clearInterval(locationInterval);
			locationInterval = null;
		}
		trackingLocation = false;
	};

	const handleAccept = async (pickupId) => {
		try {
			const response = await pickupsAPI.accept(pickupId);
			if (response.success) {
				// Generate OTP immediately after accepting
				const otpResponse = await pickupsAPI.complete(pickupId, 0); // 0 weight initially
				if (otpResponse.success) {
					alert(`Pickup accepted! ✅\n\nYour OTP: ${otpResponse.data.otp}\n\nShare this 6-digit OTP with the user to complete pickup.`);
					await loadData();
				}
			}
		} catch (error) {
			alert('Error accepting pickup: ' + error.message);
		}
	};

	const handleSkip = (pickupId) => {
		pickupRequests = pickupRequests.filter(p => p.id !== pickupId);
	};

	const handleLogout = () => {
		stopLocationTracking();
		if (browser) {
			authAPI.logout();
		}
		goto('/login');
	};

	const toggleAvailability = () => {
		isAvailable = !isAvailable;
		if (browser) {
			localStorage.setItem('executiveAvailable', isAvailable.toString());
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	};

	const formatTime = (dateString) => {
		return new Date(dateString).toLocaleTimeString('en-IN', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};
</script>

<svelte:head>
	<title>Executive Dashboard - Eco Sorter</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-4xl font-bold text-gray-900">Pickup Executive Dashboard</h1>
				<p class="text-gray-600 mt-2">🚚 Every pickup makes a difference. You're the hero of clean streets!</p>
			</div>
			<div class="flex gap-4 items-center">
				<!-- Availability Toggle -->
				<div class="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-md border border-gray-200">
					<span class="text-sm font-semibold text-gray-700">Available Today:</span>
					<button
						on:click={toggleAvailability}
						class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors {isAvailable ? 'bg-emerald-500' : 'bg-gray-300'}"
					>
						<span class="inline-block h-6 w-6 transform rounded-full bg-white transition-transform {isAvailable ? 'translate-x-7' : 'translate-x-1'}"></span>
					</button>
					<span class="text-sm font-bold {isAvailable ? 'text-emerald-600' : 'text-gray-500'}">
						{isAvailable ? 'YES' : 'NO'}
					</span>
				</div>
				<button
					on:click={handleLogout}
					class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300"
				>
					Logout
				</button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Pending Pickups</p>
						<p class="text-4xl font-bold text-orange-600 mt-2">{pendingPickups}</p>
					</div>
					<div class="text-5xl">📦</div>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Completed Today</p>
						<p class="text-4xl font-bold text-emerald-600 mt-2">{completedToday}</p>
					</div>
					<div class="text-5xl">✅</div>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Total Collected (kg)</p>
						<p class="text-4xl font-bold text-blue-600 mt-2">{totalCollected}</p>
					</div>
					<div class="text-5xl">⚖️</div>
				</div>
			</div>
		</div>

		<!-- Live Tracking Map -->
		{#if activePickup && trackingLocation}
			<div class="mb-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-lg text-white">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="text-3xl animate-pulse">🚚</div>
						<div>
							<h3 class="text-xl font-bold">Live Navigation Active</h3>
							<p class="text-blue-100 text-sm">Tracking to user location</p>
						</div>
					</div>
					<button 
						on:click={stopLocationTracking}
						class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
					>
						Stop Tracking
					</button>
				</div>

				<!-- Live Map -->
				<div class="bg-white rounded-xl overflow-hidden" style="height: 400px;">
					<LiveMap 
						userLocation={userLocation}
						executiveLocation={executiveLocation}
						showUserMarker={!!userLocation}
						showExecutiveMarker={true}
					/>
				</div>

				<!-- Location Info -->
				<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					{#if executiveLocation}
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<p class="text-sm text-blue-100 mb-2">🚚 Your Location:</p>
							<p class="font-mono text-sm">
								Lat: {executiveLocation.latitude.toFixed(6)}, 
								Lng: {executiveLocation.longitude.toFixed(6)}
							</p>
						</div>
					{/if}
					{#if userLocation}
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<p class="text-sm text-blue-100 mb-2">📍 User Location:</p>
							<p class="font-mono text-sm">
								Lat: {userLocation.latitude.toFixed(6)}, 
								Lng: {userLocation.longitude.toFixed(6)}
							</p>
							<p class="text-xs text-blue-100 mt-2">
								Last updated: {new Date(userLocation.lastUpdated || Date.now()).toLocaleTimeString()}
							</p>
						</div>
					{:else}
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<p class="text-blue-100 text-sm">Waiting for user location...</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Pickup Requests -->
		<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">🚚 Today's Pickup Requests</h2>
			
			{#if loading}
				<div class="text-center py-8">
					<p class="text-gray-600">Loading pickups...</p>
				</div>
			{:else if pickupRequests.length === 0}
				<div class="text-center py-8">
					<p class="text-gray-600">No pending pickups at the moment</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each pickupRequests as pickup}
						<div class="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-400 transition-all">
							<div class="flex-1 mb-4 md:mb-0">
								<h3 class="text-lg font-bold text-gray-900">{pickup.user?.name || 'User'}</h3>
								<p class="text-gray-600 text-sm mt-1">📍 {pickup.address?.street || pickup.address?.city || 'Address not provided'}</p>
								<div class="flex gap-4 mt-2">
									<span class="text-sm text-gray-600">⚖️ {pickup.estimatedWeight}kg</span>
									<span class="text-sm text-gray-600">🕐 {formatDate(pickup.scheduledDate)} at {formatTime(pickup.scheduledDate)}</span>
								</div>
								{#if pickup.notes}
									<p class="text-sm text-gray-500 mt-2">📝 {pickup.notes}</p>
								{/if}
							</div>
							<div class="flex gap-3">
								{#if pickup.status === 'accepted'}
									<div class="px-6 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg">
										✅ Accepted - OTP Sent
									</div>
								{:else}
									<button 
										on:click={() => handleAccept(pickup.id)}
										class="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
									>
										Accept
									</button>
									<button 
										on:click={() => handleSkip(pickup.id)}
										class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-all"
									>
										Skip
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
