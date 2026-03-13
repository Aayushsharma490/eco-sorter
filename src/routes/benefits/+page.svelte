<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { statsAPI } from '$lib/api';

	let userCredits = 0;
	let loading = true;
	let isLoggedIn = false;

	const rewardTiers = [
		{
			tier: 'Bronze',
			minCredits: 500,
			color: 'from-amber-600 to-orange-700',
			bgColor: 'bg-amber-50',
			borderColor: 'border-amber-300',
			icon: '🥉',
			benefits: [
				{ icon: '🎬', title: '20% Off Movie Tickets', description: 'Valid at PVR, INOX, Cinepolis' },
				{ icon: '🍕', title: '15% Off Food Delivery', description: 'Zomato & Swiggy orders' },
				{ icon: '📱', title: '₹100 Mobile Recharge', description: 'Any operator' },
				{ icon: '☕', title: '10% Off Cafes', description: 'Starbucks, CCD, Barista' },
				{ icon: '📚', title: '15% Off Books', description: 'Amazon Kindle & physical books' }
			]
		},
		{
			tier: 'Silver',
			minCredits: 1000,
			color: 'from-gray-400 to-gray-600',
			bgColor: 'bg-gray-50',
			borderColor: 'border-gray-300',
			icon: '🥈',
			benefits: [
				{ icon: '🎬', title: '30% Off Movie Tickets', description: 'Valid at all major chains' },
				{ icon: '🍕', title: '25% Off Food Delivery', description: 'Unlimited orders' },
				{ icon: '🛒', title: '20% Off Grocery', description: 'BigBasket, Blinkit, Zepto' },
				{ icon: '📱', title: '₹200 Mobile Recharge', description: 'Any operator' },
				{ icon: '⛽', title: '₹150 Fuel Voucher', description: 'Indian Oil, HP, Bharat' },
				{ icon: '☕', title: '20% Off Cafes', description: 'Premium coffee chains' },
				{ icon: '🎮', title: '15% Off Gaming', description: 'Steam, PlayStation, Xbox' },
				{ icon: '💊', title: '10% Off Medicines', description: '1mg, PharmEasy, Netmeds' }
			]
		},
		{
			tier: 'Gold',
			minCredits: 2000,
			color: 'from-yellow-400 to-yellow-600',
			bgColor: 'bg-yellow-50',
			borderColor: 'border-yellow-300',
			icon: '🥇',
			benefits: [
				{ icon: '🎬', title: '50% Off Movie Tickets', description: 'Premium seats included' },
				{ icon: '🍕', title: '35% Off Food Delivery', description: 'Free delivery on all orders' },
				{ icon: '🛒', title: '30% Off Grocery', description: 'All platforms' },
				{ icon: '📱', title: '₹500 Mobile Recharge', description: 'Any operator' },
				{ icon: '⛽', title: '₹300 Fuel Voucher', description: 'All fuel stations' },
				{ icon: '🏨', title: '25% Off Hotels', description: 'MakeMyTrip, Goibibo' },
				{ icon: '🛍️', title: '₹500 Shopping Voucher', description: 'Amazon, Flipkart' },
				{ icon: '💇', title: '20% Off Salon & Spa', description: 'Urban Company services' },
				{ icon: '🎓', title: '20% Off Courses', description: 'Udemy, Coursera, Skillshare' },
				{ icon: '🏋️', title: '15% Off Fitness', description: 'Gym memberships & equipment' }
			]
		},
		{
			tier: 'Platinum',
			minCredits: 5000,
			color: 'from-purple-500 to-indigo-600',
			bgColor: 'bg-purple-50',
			borderColor: 'border-purple-300',
			icon: '💎',
			benefits: [
				{ icon: '🎬', title: 'Free Movie Tickets', description: '2 tickets per month' },
				{ icon: '🍕', title: '50% Off Food Delivery', description: 'Unlimited premium access' },
				{ icon: '🛒', title: '40% Off Grocery', description: 'Priority delivery' },
				{ icon: '📱', title: '₹1000 Mobile Recharge', description: 'Any operator' },
				{ icon: '⛽', title: '₹750 Fuel Voucher', description: 'Monthly benefit' },
				{ icon: '🏨', title: '40% Off Hotels', description: 'Luxury stays included' },
				{ icon: '🛍️', title: '₹1500 Shopping Voucher', description: 'All e-commerce platforms' },
				{ icon: '✈️', title: '₹2000 Travel Voucher', description: 'Flights & trains' },
				{ icon: '🎁', title: 'Exclusive Gifts', description: 'Eco-friendly products' },
				{ icon: '🎵', title: 'Free Music Streaming', description: 'Spotify, Apple Music (3 months)' },
				{ icon: '📺', title: '20% Off OTT', description: 'Netflix, Prime, Disney+' },
				{ icon: '🚗', title: '₹500 Cab Voucher', description: 'Uber, Ola rides' }
			]
		},
		{
			tier: 'Diamond',
			minCredits: 10000,
			color: 'from-cyan-400 to-blue-600',
			bgColor: 'bg-cyan-50',
			borderColor: 'border-cyan-300',
			icon: '💠',
			benefits: [
				{ icon: '🎬', title: 'Unlimited Movie Tickets', description: 'Premium seats anytime' },
				{ icon: '🍕', title: '60% Off Food Delivery', description: 'VIP membership' },
				{ icon: '🛒', title: '50% Off Grocery', description: 'Free express delivery' },
				{ icon: '📱', title: '₹2000 Mobile Recharge', description: 'Quarterly benefit' },
				{ icon: '⛽', title: '₹1500 Fuel Voucher', description: 'Monthly benefit' },
				{ icon: '🏨', title: '50% Off Hotels', description: '5-star properties' },
				{ icon: '🛍️', title: '₹3000 Shopping Voucher', description: 'Premium brands' },
				{ icon: '✈️', title: '₹5000 Travel Voucher', description: 'International flights' },
				{ icon: '🎁', title: 'Premium Gifts', description: 'Exclusive eco products' },
				{ icon: '🏆', title: 'VIP Status', description: 'Priority support & events' },
				{ icon: '🎵', title: 'Free Music & OTT', description: 'All platforms (1 year)' },
				{ icon: '🚗', title: '₹2000 Cab Voucher', description: 'Monthly rides' },
				{ icon: '💳', title: 'Cashback Card', description: '5% on all purchases' },
				{ icon: '🌟', title: 'Concierge Service', description: '24/7 personal assistance' }
			]
		}
	];

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('token');
			isLoggedIn = !!token;
			
			if (token) {
				try {
					const response = await statsAPI.getUserStats();
					if (response.success) {
						userCredits = response.data.credits;
					}
				} catch (error) {
					console.error('Error fetching credits:', error);
				}
			}
			loading = false;
		}
	});

	const getCurrentTier = () => {
		for (let i = rewardTiers.length - 1; i >= 0; i--) {
			if (userCredits >= rewardTiers[i].minCredits) {
				return rewardTiers[i];
			}
		}
		return null;
	};

	const getNextTier = () => {
		const currentTier = getCurrentTier();
		if (!currentTier) return rewardTiers[0];
		
		const currentIndex = rewardTiers.findIndex(t => t.tier === currentTier.tier);
		if (currentIndex < rewardTiers.length - 1) {
			return rewardTiers[currentIndex + 1];
		}
		return null;
	};

	const getProgressToNextTier = () => {
		const nextTier = getNextTier();
		if (!nextTier) return 100;
		
		const currentTier = getCurrentTier();
		const currentMin = currentTier ? currentTier.minCredits : 0;
		const nextMin = nextTier.minCredits;
		
		const progress = ((userCredits - currentMin) / (nextMin - currentMin)) * 100;
		return Math.min(Math.max(progress, 0), 100);
	};

	const isTierUnlocked = (tier) => {
		return userCredits >= tier.minCredits;
	};

	const handleLogin = () => {
		goto('/login');
	};
</script>

<svelte:head>
	<title>Benefits & Rewards - Eco Sorter</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
	<!-- Header -->
	<div class="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-16 px-4">
		<div class="max-w-7xl mx-auto text-center">
			<h1 class="text-5xl font-bold mb-4">🎁 Benefits & Rewards</h1>
			<p class="text-xl text-emerald-100 mb-2">Turn your garbage into gold! Recycle plastic, earn credits, unlock VIP perks.</p>
			<p class="text-lg text-emerald-200">♻️ Every kg of plastic = 10 credits. Your waste, your wealth!</p>
			
			{#if isLoggedIn && !loading}
				<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
					<div class="flex items-center justify-between mb-4">
						<div>
							<p class="text-emerald-100 text-sm">Your Credits</p>
							<p class="text-4xl font-bold">{userCredits}</p>
						</div>
						{#if getCurrentTier()}
							<div class="text-right">
								<p class="text-emerald-100 text-sm">Current Tier</p>
								<p class="text-3xl font-bold">{getCurrentTier().icon} {getCurrentTier().tier}</p>
							</div>
						{/if}
					</div>
					
					{#if getNextTier()}
						<div class="mt-4">
							<div class="flex justify-between text-sm text-emerald-100 mb-2">
								<span>Progress to {getNextTier().tier}</span>
								<span>{getNextTier().minCredits - userCredits} credits needed</span>
							</div>
							<div class="bg-white/20 rounded-full h-3">
								<div 
									class="bg-white h-3 rounded-full transition-all duration-500"
									style="width: {getProgressToNextTier()}%"
								></div>
							</div>
						</div>
					{:else}
						<div class="mt-4 text-center">
							<p class="text-emerald-100">🏆 You've reached the highest tier!</p>
						</div>
					{/if}
				</div>
			{:else if !isLoggedIn && !loading}
				<button 
					on:click={handleLogin}
					class="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105"
				>
					Login to View Your Credits
				</button>
			{/if}
		</div>
	</div>

	<!-- Reward Tiers -->
	<div class="max-w-7xl mx-auto px-4 py-16">
		<div class="text-center mb-12">
			<h2 class="text-4xl font-bold text-gray-900 mb-4">Reward Tiers</h2>
			<p class="text-gray-600 text-lg">Unlock more benefits as you earn more credits</p>
		</div>

		<div class="space-y-8">
			{#each rewardTiers as tier}
				<div class="relative">
					<div class="bg-white rounded-2xl shadow-xl border-2 {tier.borderColor} overflow-hidden transition-all duration-300 hover:shadow-2xl {isTierUnlocked(tier) ? 'opacity-100' : 'opacity-60'}">
						<!-- Tier Header -->
						<div class="bg-gradient-to-r {tier.color} text-white p-6">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4">
									<div class="text-6xl">{tier.icon}</div>
									<div>
										<h3 class="text-3xl font-bold">{tier.tier} Tier</h3>
										<p class="text-white/90">Unlock at {tier.minCredits} credits</p>
									</div>
								</div>
								{#if isTierUnlocked(tier)}
									<div class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
										<p class="text-sm font-semibold">✅ UNLOCKED</p>
									</div>
								{:else}
									<div class="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-xl">
										<p class="text-sm font-semibold">🔒 LOCKED</p>
									</div>
								{/if}
							</div>
						</div>

						<!-- Benefits Grid -->
						<div class="p-8 {tier.bgColor}">
							<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{#each tier.benefits as benefit}
									<div class="bg-white rounded-xl p-5 shadow-md border-2 border-gray-100 hover:border-{tier.borderColor} hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
										<div class="text-4xl mb-3 text-center">{benefit.icon}</div>
										<h4 class="font-bold text-gray-900 mb-2 text-center text-sm">{benefit.title}</h4>
										<p class="text-xs text-gray-600 text-center leading-relaxed">{benefit.description}</p>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Unlocked Badge -->
					{#if isTierUnlocked(tier)}
						<div class="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-full shadow-lg transform rotate-12">
							<p class="font-bold">✨ Active</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- How to Earn -->
		<div class="mt-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-8 text-white">
			<h3 class="text-3xl font-bold mb-6 text-center">💡 How to Earn Credits</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
					<div class="text-5xl mb-4">♻️</div>
					<h4 class="font-bold text-xl mb-2">Recycle Plastic</h4>
					<p class="text-emerald-100">Earn 10 credits per kg of plastic waste collected</p>
				</div>
				<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
					<div class="text-5xl mb-4">📅</div>
					<h4 class="font-bold text-xl mb-2">Regular Pickups</h4>
					<p class="text-emerald-100">Schedule regular pickups to maximize your earnings</p>
				</div>
				<div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
					<div class="text-5xl mb-4">🎯</div>
					<h4 class="font-bold text-xl mb-2">Reach Milestones</h4>
					<p class="text-emerald-100">Unlock higher tiers for better rewards</p>
				</div>
			</div>
		</div>

		<!-- CTA -->
		{#if !isLoggedIn && !loading}
			<div class="mt-16 text-center">
				<h3 class="text-3xl font-bold text-gray-900 mb-4">Ready to Start Earning?</h3>
				<p class="text-gray-600 mb-8">Join Eco Sorter today and start your journey towards amazing rewards!</p>
				<button 
					on:click={handleLogin}
					class="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
				>
					Get Started Now
				</button>
			</div>
		{/if}
	</div>
</div>
