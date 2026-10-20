<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let showContactInfo = false;

	const handleEnterWebsite = () => {
		goto('/home');
	};

	const toggleContact = () => {
		showContactInfo = !showContactInfo;
	};

	onMount(() => {
		gsap.fromTo('.logo-text',
			{ opacity: 0, y: -50 },
			{ opacity: 1, y: 0, duration: 1, ease: 'back.out(1.7)' }
		);

		gsap.fromTo('.button-container',
			{ opacity: 0, y: 50 },
			{ opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)' }
		);
	});
</script>

<svelte:head>
	<title>Eco Sorter - Welcome</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
	<!-- Animated Background -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
	</div>

	<div class="relative z-10 text-center px-4">
		<!-- Logo/Brand Name -->
		<div class="logo-text mb-12">
			<h1 class="text-7xl md:text-9xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
				Eco Sorter
			</h1>
			<p class="text-xl md:text-2xl text-gray-600 font-medium">
				♻️ Transforming Waste into Worth
			</p>
		</div>

		<!-- Buttons -->
		<div class="button-container flex flex-col sm:flex-row gap-6 justify-center items-center">
			<!-- Contact Button -->
			<button
				on:click={toggleContact}
				class="group relative px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-emerald-500"
			>
				<div class="flex items-center gap-3">
					<span class="text-2xl">📞</span>
					<span class="text-lg">Contact Us</span>
				</div>
			</button>

			<!-- Enter Website Button -->
			<button
				on:click={handleEnterWebsite}
				class="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
			>
				<div class="flex items-center gap-3">
					<span class="text-2xl">🌐</span>
					<span class="text-lg">Enter Website</span>
				</div>
			</button>
		</div>

		<!-- Contact Info Modal -->
		{#if showContactInfo}
			<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" on:click={toggleContact}>
				<div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all" on:click|stopPropagation>
					<div class="text-center mb-6">
						<h2 class="text-3xl font-bold text-gray-900 mb-2">Contact Information</h2>
						<p class="text-gray-600">Get in touch with us</p>
					</div>

					<div class="space-y-6">
						<!-- Email -->
						<div class="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
							<div class="text-3xl">📧</div>
							<div class="flex-1 text-left">
								<p class="text-sm text-gray-600 font-semibold">Email</p>
								<a href="mailto:pathanshadabkhan31@gmail.com" class="text-emerald-600 hover:text-emerald-700 font-medium break-all">
									pathanshadabkhan31@gmail.com
								</a>
							</div>
						</div>

						<!-- Phone -->
						<div class="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
							<div class="text-3xl">📱</div>
							<div class="flex-1 text-left">
								<p class="text-sm text-gray-600 font-semibold">Phone</p>
								<a href="tel:+919929622048" class="text-green-600 hover:text-green-700 font-medium text-lg">
									+91 9929622048
								</a>
							</div>
						</div>
					</div>

					<button
						on:click={toggleContact}
						class="mt-6 w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all"
					>
						Close
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes pulse {
		0%, 100% {
			opacity: 0.3;
			transform: scale(1);
		}
		50% {
			opacity: 0.5;
			transform: scale(1.1);
		}
	}

	.animate-pulse {
		animation: pulse 4s ease-in-out infinite;
	}
</style>
