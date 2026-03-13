<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { statsAPI, pickupsAPI, authAPI, locationAPI } from '$lib/api';
	import LiveMap from '$lib/components/LiveMap.svelte';

	let dustbinLevel = 0;
	let credits = 0;
	let scheduledPickups = 0;
	let loading = true;
	let submitting = false;
	let trackingLocation = false;
	let locationInterval;
	let activePickup = null;
	let executiveLocation = null;
	let userLocation = null;
	let recentActivity = [];
	let showOTPModal = false;
	let otpInput = '';
	let weightInput = '';
	let verifyingOTP = false;
	let checkOTPInterval;

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('token');
			
			if (!token) {
				goto('/login');
				return;
			}

			try {
				const [statsResponse, pickupsResponse] = await Promise.all([
					statsAPI.getUserStats(),
					pickupsAPI.getAll()
				]);

				if (statsResponse.success) {
					dustbinLevel = statsResponse.data.dustbinLevel;
					credits = statsResponse.data.credits;
					scheduledPickups = statsResponse.data.scheduledPickups;
				}

				if (pickupsResponse.success) {
					recentActivity = pickupsResponse.data
						.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
						.slice(0, 5);
					
					// Check if there's an active pickup with OTP
					const acceptedWithOTP = pickupsResponse.data.find(p => p.status === 'accepted' && p.otp);
					if (acceptedWithOTP) {
						activePickup = acceptedWithOTP;
						showOTPModal = true;
						startLocationTracking();
					} else {
						// Check for accepted pickup without OTP
						const acceptedNoOTP = pickupsResponse.data.find(p => p.status === 'accepted');
						if (acceptedNoOTP) {
							activePickup = acceptedNoOTP;
							startLocationTracking();
							// Start polling for OTP
							startOTPPolling();
						}
					}
				}
			} catch (error) {
				console.error('Error fetching stats:', error);
				goto('/login');
			} finally {
				loading = false;
			}
		}
	});

	onDestroy(() => {
		stopLocationTracking();
		stopOTPPolling();
	});

	const startOTPPolling = () => {
		// Check every 5 seconds if OTP has been generated
		checkOTPInterval = setInterval(async () => {
			if (!activePickup) return;
			
			try {
				const response = await pickupsAPI.getAll();
				if (response.success) {
					const pickup = response.data.find(p => p.id === activePickup.id);
					if (pickup && pickup.otp && !showOTPModal) {
						activePickup = pickup;
						showOTPModal = true;
						stopOTPPolling();
					}
				}
			} catch (error) {
				console.error('Error checking OTP:', error);
			}
		}, 5000); // Check every 5 seconds
	};

	const stopOTPPolling = () => {
		if (checkOTPInterval) {
			clearInterval(checkOTPInterval);
			checkOTPInterval = null;
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
						userLocation = {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude
						};

						await locationAPI.updateLocation(
							position.coords.latitude,
							position.coords.longitude,
							activePickup?.id
						);

						// Get executive location if pickup is accepted
						if (activePickup?.executiveId) {
							const locResponse = await locationAPI.getPickupLocation(activePickup.id);
							if (locResponse.success) {
								executiveLocation = locResponse.data.executiveLocation;
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
		}, 10000); // Every 10 seconds

		// Initial location update
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					userLocation = {
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

	const handleSchedulePickup = async (event) => {
		event.preventDefault();
		submitting = true;

		const formData = new FormData(event.target);
		
		try {
			const response = await pickupsAPI.create({
				scheduledDate: formData.get('date'),
				estimatedWeight: parseInt(formData.get('weight')),
				notes: formData.get('notes') || ''
			});

			if (response.success) {
				alert('Pickup scheduled successfully! ✅');
				// Refresh stats
				const statsResponse = await statsAPI.getUserStats();
				if (statsResponse.success) {
					scheduledPickups = statsResponse.data.scheduledPickups;
				}
				event.target.reset();
			}
		} catch (error) {
			alert('Error scheduling pickup: ' + error.message);
		} finally {
			submitting = false;
		}
	};

	const handleVerifyOTP = async () => {
		if (!otpInput || otpInput.length !== 6) {
			alert('Please enter a valid 6-digit OTP');
			return;
		}

		if (!weightInput || weightInput < 5) {
			alert('Please enter actual weight (minimum 5kg)');
			return;
		}

		verifyingOTP = true;
		try {
			const response = await pickupsAPI.verifyOTP(activePickup.id, otpInput, parseInt(weightInput));
			if (response.success) {
				alert(`✅ Pickup completed successfully!\n+${response.data.creditsEarned} credits earned`);
				showOTPModal = false;
				otpInput = '';
				weightInput = '';
				activePickup = null;
				stopLocationTracking();
				stopOTPPolling();
				
				// Refresh data
				const [statsResponse, pickupsResponse] = await Promise.all([
					statsAPI.getUserStats(),
					pickupsAPI.getAll()
				]);

				if (statsResponse.success) {
					credits = statsResponse.data.credits;
					scheduledPickups = statsResponse.data.scheduledPickups;
				}

				if (pickupsResponse.success) {
					recentActivity = pickupsResponse.data
						.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
						.slice(0, 5);
				}
			}
		} catch (error) {
			alert('Error verifying OTP: ' + error.message);
		} finally {
			verifyingOTP = false;
		}
	};

	const handleLogout = () => {
		stopLocationTracking();
		stopOTPPolling();
		if (browser) {
			authAPI.logout();
		}
		goto('/login');
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
				return 'Executive on the way';
			case 'pending':
				return `Scheduled for ${formatDate(pickup.scheduledDate)}`;
			default:
				return pickup.status;
		}
	};

	const getActivityTitle = (status) => {
		switch (status) {
			case 'completed': return 'Pickup Completed';
			case 'accepted': return 'Pickup Accepted';
			case 'pending': return 'Pickup Scheduled';
			default: return 'Pickup';
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'short'
		});
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
	<title>User Dashboard - Eco Sorter</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<h1 class="text-4xl font-bold text-gray-900">User Dashboard</h1>
				<p class="text-gray-600 mt-2">♻️ Your plastic today, your rewards tomorrow. Keep recycling!</p>
			</div>
			<button
				on:click={handleLogout}
				class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300"
			>
				Logout
			</button>
		</div>

		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Dustbin Level</p>
						<p class="text-4xl font-bold text-emerald-600 mt-2">{dustbinLevel}%</p>
					</div>
					<div class="text-5xl">🗑️</div>
				</div>
				<div class="mt-4 bg-gray-200 rounded-full h-2">
					<div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: {dustbinLevel}%"></div>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Total Credits</p>
						<p class="text-4xl font-bold text-blue-600 mt-2">{credits}</p>
					</div>
					<div class="text-5xl">💰</div>
				</div>
			</div>

			<div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium">Scheduled Pickups</p>
						<p class="text-4xl font-bold text-purple-600 mt-2">{scheduledPickups}</p>
					</div>
					<div class="text-5xl">📅</div>
				</div>
			</div>
		</div>

		<!-- Live Tracking Card -->
		{#if activePickup && trackingLocation}
			<div class="mb-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 shadow-lg text-white">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="text-3xl animate-pulse">📍</div>
						<div>
							<h3 class="text-xl font-bold">Live Tracking Active</h3>
							<p class="text-emerald-100 text-sm">
								{#if activePickup.otp}
									🔔 Executive has generated OTP! Check below to verify.
								{:else}
									Executive is on the way to your location
								{/if}
							</p>
						</div>
					</div>
					<button 
						on:click={stopLocationTracking}
						class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
					>
						Stop Tracking
					</button>
				</div>

				<!-- OTP Ready Notification -->
				{#if activePickup.otp && !showOTPModal}
					<div class="mb-4 bg-yellow-500 text-yellow-900 p-4 rounded-xl font-semibold animate-pulse">
						🔔 OTP is ready! Click below to enter OTP and complete pickup.
						<button 
							on:click={() => showOTPModal = true}
							class="ml-4 px-4 py-2 bg-yellow-900 text-yellow-100 rounded-lg hover:bg-yellow-800 transition-all"
						>
							Enter OTP Now
						</button>
					</div>
				{/if}

				<!-- Live Map -->
				<div class="bg-white rounded-xl overflow-hidden" style="height: 400px;">
					<LiveMap 
						userLocation={userLocation}
						executiveLocation={executiveLocation}
						showUserMarker={true}
						showExecutiveMarker={!!executiveLocation}
					/>
				</div>

				<!-- Location Info -->
				<div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					{#if userLocation}
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<p class="text-sm text-emerald-100 mb-2">📍 Your Location:</p>
							<p class="font-mono text-sm">
								Lat: {userLocation.latitude.toFixed(6)}, 
								Lng: {userLocation.longitude.toFixed(6)}
							</p>
						</div>
					{/if}
					{#if executiveLocation}
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<p class="text-sm text-emerald-100 mb-2">🚚 Executive Location:</p>
							<p class="font-mono text-sm">
								Lat: {executiveLocation.latitude.toFixed(6)}, 
								Lng: {executiveLocation.longitude.toFixed(6)}
							</p>
							<p class="text-xs text-emerald-100 mt-2">
								Last updated: {new Date(executiveLocation.lastUpdated).toLocaleTimeString()}
							</p>
						</div>
					{:else}
						<div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
							<p class="text-emerald-100 text-sm">Waiting for executive to share location...</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Actions -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Schedule Pickup -->
			<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">📍 Schedule Pickup</h2>
				<form on:submit={handleSchedulePickup} class="space-y-4">
					<div>
						<label for="date" class="block text-sm font-semibold text-gray-700 mb-2">Pickup Date</label>
						<input 
							type="date" 
							id="date"
							name="date"
							required
							min={new Date().toISOString().split('T')[0]}
							class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" 
						/>
					</div>
					<div>
						<label for="weight" class="block text-sm font-semibold text-gray-700 mb-2">Estimated Weight (kg)</label>
						<input 
							type="number" 
							id="weight"
							name="weight"
							min="5" 
							required
							placeholder="Minimum 5kg" 
							class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none" 
						/>
					</div>
					<div>
						<label for="notes" class="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
						<textarea 
							id="notes"
							name="notes"
							rows="2"
							placeholder="Any special instructions..."
							class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
						></textarea>
					</div>
					<button 
						type="submit" 
						disabled={submitting}
						class="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{submitting ? 'Scheduling...' : 'Schedule Pickup'}
					</button>
				</form>
			</div>

			<!-- Recent Activity -->
			<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">📊 Recent Activity</h2>
				{#if loading}
					<div class="text-center py-8">
						<p class="text-gray-600">Loading activity...</p>
					</div>
				{:else if recentActivity.length === 0}
					<div class="text-center py-8">
						<p class="text-gray-600">No recent activity</p>
					</div>
				{:else}
					<div class="space-y-4">
						{#each recentActivity as activity}
							<div class="flex items-center gap-4 p-4 {getActivityBgColor(activity.status)} rounded-xl">
								<div class="text-2xl">{getActivityIcon(activity.status)}</div>
								<div class="flex-1">
									<p class="font-semibold text-gray-900">{getActivityTitle(activity.status)}</p>
									<p class="text-sm text-gray-600">{getActivityText(activity)}</p>
								</div>
								<p class="text-xs text-gray-500">{getRelativeTime(activity.createdAt)}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- OTP Verification Modal -->
{#if showOTPModal && activePickup}
	<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style="z-index: 9999;">
		<div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative" style="z-index: 10000;">
			<h3 class="text-2xl font-bold text-gray-900 mb-4">Complete Pickup</h3>
			<p class="text-gray-600 mb-6">Enter the 6-digit OTP provided by the executive and confirm the actual weight collected.</p>
			
			<div class="space-y-4">
				<div>
					<label for="weightInput" class="block text-sm font-semibold text-gray-700 mb-2">
						Actual Weight Collected (kg)
					</label>
					<input 
						type="number" 
						id="weightInput"
						bind:value={weightInput}
						min="5"
						placeholder="Enter weight in kg"
						class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
					/>
				</div>

				<div>
					<label for="otpInput" class="block text-sm font-semibold text-gray-700 mb-2">
						Enter OTP
					</label>
					<input 
						type="text" 
						id="otpInput"
						bind:value={otpInput}
						maxlength="6"
						placeholder="000000"
						class="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
					/>
				</div>

				{#if activePickup.otp}
					<div class="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center">
						<p class="text-sm text-gray-600 mb-2">Your OTP:</p>
						<p class="text-4xl font-bold text-emerald-600 tracking-wider font-mono">{activePickup.otp}</p>
						<p class="text-xs text-gray-500 mt-2">Valid for 10 minutes</p>
					</div>
				{/if}

				<div class="flex gap-3 mt-6">
					<button 
						on:click={handleVerifyOTP}
						disabled={verifyingOTP || otpInput.length !== 6 || !weightInput}
						class="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{verifyingOTP ? 'Verifying...' : 'Complete Pickup'}
					</button>
					<button 
						on:click={() => { showOTPModal = false; otpInput = ''; weightInput = ''; }}
						disabled={verifyingOTP}
						class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
