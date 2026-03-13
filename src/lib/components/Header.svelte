<script>
	import IconClose from '~icons/ph/x-bold';
	import IconMenu from '~icons/ph/list-bold';
	import clsx from 'clsx';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let isOpen = false;
	let scrolled = false;
	
	const toggleOpen = () => (isOpen = !isOpen);
	const close = () => (isOpen = false);

	// Navigation items for Eco Sorter
	const navItems = [
		{ label: 'Home', href: '/#hero' },
		{ label: 'Platform', href: '/#platform' },
		{ label: 'How It Works', href: '/#how-it-works' },
		{ label: 'Centers', href: '/centers' },
		{ label: 'Benefits', href: '/benefits' },
		{ label: 'Partners', href: '/#partners' },
		{ label: 'FAQ', href: '/#faq' },
		{ label: 'Login', href: '/login' },
		{ label: 'Get Started', href: '/contact', cta: true }
	];

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 50;
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const isActive = (href) => {
		return $page.url.pathname === href || ($page.url.pathname.startsWith(href) && href !== '/');
	};
</script>

<header class="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 transition-all duration-300 {scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : ''}">
	<nav
		class="mx-auto flex max-w-7xl flex-col justify-between py-2 font-medium text-gray-900 md:flex-row md:items-center"
		aria-label="Main"
	>
		<div class="flex items-center justify-between">
			<a href="/" on:click={close} class="z-50 flex items-center gap-2">
				<div class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
					Eco Sorter
				</div>
			</a>

			<button
				type="button"
				class="block p-2 text-3xl text-gray-900 md:hidden"
				aria-expanded={isOpen}
				on:click={toggleOpen}
			>
				<IconMenu />
			</button>
		</div>

		<!-- Mobile Nav -->
		<div
			class={clsx(
				'fixed inset-0 z-40 flex flex-col items-end bg-white pr-4 pt-6 transition-transform duration-300 ease-in-out md:hidden',
				isOpen ? 'translate-x-0' : 'translate-x-[100%]'
			)}
		>
			<button
				aria-expanded={isOpen}
				type="button"
				class="block p-2 text-3xl text-gray-900 md:hidden"
				on:click={toggleOpen}
			>
				<IconClose />
			</button>
			<ul class="grid justify-items-end gap-8 mt-12">
				{#each navItems as item}
					<li>
						{#if item.cta}
							<a
								href={item.href}
								on:click={close}
								class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 text-2xl"
								aria-current={isActive(item.href) ? 'page' : undefined}
							>
								{item.label}
							</a>
						{:else}
							<a
								href={item.href}
								on:click={close}
								class="block text-3xl text-gray-900 hover:text-emerald-600 transition-colors duration-200"
								aria-current={isActive(item.href) ? 'page' : undefined}
							>
								{item.label}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>

		<!-- Desktop Nav -->
		<ul class="hidden gap-8 md:flex items-center">
			{#each navItems as item}
				<li>
					{#if item.cta}
						<a
							href={item.href}
							class="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
					{:else}
						<a
							href={item.href}
							class="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium"
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</nav>
</header>

<div class="h-20"></div> <!-- Spacer for fixed header -->
