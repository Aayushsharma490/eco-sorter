<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { authAPI } from '$lib/api';

	let selectedRole = 'user';
	let email = '';
	let password = '';
	let isLoading = false;
	let errorMessage = '';

	const roles = [
		{ id: 'user', label: 'User', icon: '👤', color: 'from-blue-500 to-cyan-500' },
		{ id: 'executive', label: 'Pickup Executive', icon: '🚚', color: 'from-emerald-500 to-green-500' },
		{ id: 'admin', label: 'Admin', icon: '👨‍💼', color: 'from-purple-500 to-pink-500' }
	];

	// Demo credentials
	const demoCredentials = {
		user: { email: 'user@demo.com', password: 'demo123' },
		executive: { email: 'executive@demo.com', password: 'demo123' },
		admin: { email: 'admin@demo.com', password: 'demo123' }
	};

	const handleLogin = async () => {
		errorMessage = '';
		isLoading = true;

		try {
			console.log('Attempting login with:', email);
			const response = await authAPI.login(email, password);
			
			console.log('Login response:', response);
			
			if (response.success) {
				// Verify the role is stored
				const storedRole = localStorage.getItem('userRole');
				const storedToken = localStorage.getItem('token');
				console.log('Login successful!');
				console.log('- Role:', response.data.role);
				console.log('- Stored role:', storedRole);
				console.log('- Token stored:', storedToken ? 'Yes' : 'No');
				
				// Small delay to ensure localStorage is updated
				await new Promise(resolve => setTimeout(resolve, 100));
				
				// Navigate to dashboard
				const dashboardPath = `/dashboard/${response.data.role}`;
				console.log('Navigating to:', dashboardPath);
				goto(dashboardPath);
			} else {
				errorMessage = response.message || 'Login failed';
			}
		} catch (error) {
			console.error('Login error:', error);
			errorMessage = error.message || 'Cannot connect to server. Please ensure backend is running on http://localhost:5000';
		} finally {
			isLoading = false;
		}
	};

	const quickDemoLogin = async (role) => {
		email = demoCredentials[role].email;
		password = demoCredentials[role].password;
		selectedRole = role;
		await handleLogin();
	};

	onMount(() => {
		if (!browser) return;

		gsap.fromTo('.login-card',
			{ opacity: 0, y: 50 },
			{ opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
		);

		gsap.fromTo('.role-card',
			{ opacity: 0, scale: 0.8 },
			{ opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }
		);
	});
</script>

<svelte:head>
	<title>Login - Eco Sorter</title>
</svelte:head>

<div class="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
	<!-- Animated Background -->
	<div class="absolute inset-0 pointer-events-none">
		<div class="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
	</div>

	<div class="max-w-6xl w-full relative z-10">
		<div class="text-center mb-12">
			<h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
				Welcome Back
			</h1>
			<p class="text-gray-600 text-lg">Select your role and login to continue</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
			<!-- Role Selection -->
			<div class="space-y-4">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">Select Your Role</h2>
				{#each roles as role}
					<button
						on:click={() => selectedRole = role.id}
						class="role-card w-full p-6 rounded-2xl border-2 transition-all duration-300 {selectedRole === role.id ? 'border-emerald-500 bg-emerald-50 shadow-lg' : 'border-gray-200 bg-white hover:border-emerald-300'}"
					>
						<div class="flex items-center gap-4">
							<div class="text-5xl">{role.icon}</div>
							<div class="text-left flex-1">
								<h3 class="text-xl font-bold text-gray-900">{role.label}</h3>
								<p class="text-sm text-gray-600">
									{#if role.id === 'user'}
										Schedule pickups and earn credits
									{:else if role.id === 'executive'}
										Manage collections and routes
									{:else}
										Full system administration
									{/if}
								</p>
							</div>
							{#if selectedRole === role.id}
								<div class="text-emerald-600 text-2xl">✓</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>

			<!-- Login Form -->
			<div class="login-card">
				<div class="relative overflow-hidden rounded-3xl p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
					<div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5"></div>
					
					<form on:submit|preventDefault={handleLogin} class="relative z-10 space-y-6">
						<div>
							<label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
							<input
								type="email"
								id="email"
								bind:value={email}
								required
								class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-900"
								placeholder=""
							/>
						</div>

						<div>
							<label for="password" class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
							<input
								type="password"
								id="password"
								bind:value={password}
								required
								class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-900"
								placeholder=""
							/>
						</div>

						{#if errorMessage}
							<div class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
								{errorMessage}
							</div>
						{/if}

						<button
							type="submit"
							disabled={isLoading}
							class="w-full py-4 px-8 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
						>
							{isLoading ? 'Logging in...' : 'Login'}
						</button>

						<!-- Quick Demo Login -->
						<div class="mt-6">
							<div class="relative">
								<div class="absolute inset-0 flex items-center">
									<div class="w-full border-t border-gray-300"></div>
								</div>
								<div class="relative flex justify-center text-sm">
									<span class="px-2 bg-white text-gray-500">Or quick demo login</span>
								</div>
							</div>

							<div class="mt-4 grid grid-cols-3 gap-2">
								<button
									type="button"
									on:click={() => quickDemoLogin('user')}
									disabled={isLoading}
									class="py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
								>
									👤 User
								</button>
								<button
									type="button"
									on:click={() => quickDemoLogin('executive')}
									disabled={isLoading}
									class="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
								>
									🚚 Executive
								</button>
								<button
									type="button"
									on:click={() => quickDemoLogin('admin')}
									disabled={isLoading}
									class="py-2 px-3 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
								>
									👨‍💼 Admin
								</button>
							</div>
						</div>

						<!-- Demo Credentials -->
						<div class="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
							<p class="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
							<div class="text-xs text-gray-600 space-y-1">
								<p><strong>Email:</strong> {demoCredentials[selectedRole].email}</p>
								<p><strong>Password:</strong> {demoCredentials[selectedRole].password}</p>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
