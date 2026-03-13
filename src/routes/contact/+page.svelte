<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let formData = {
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: ''
	};

	let isSubmitting = false;
	let submitMessage = '';

	const contactInfo = [
		{
			icon: '✉️',
			title: 'Email Us',
			value: 'info@ecosorter.com',
			link: 'mailto:info@ecosorter.com',
			gradient: 'from-blue-500 to-cyan-500'
		},
		{
			icon: '☎️',
			title: 'Call Us',
			value: '+91 123 456 7890',
			link: 'tel:+911234567890',
			gradient: 'from-emerald-500 to-green-500'
		},
		{
			icon: '📌',
			title: 'Visit Us',
			value: 'Udaipur, Rajasthan, India',
			link: '#',
			gradient: 'from-purple-500 to-pink-500'
		},
		{
			icon: '🕐',
			title: 'Working Hours',
			value: 'Mon - Sat: 9AM - 6PM',
			link: '#',
			gradient: 'from-orange-500 to-red-500'
		}
	];

	const handleSubmit = async (e) => {
		e.preventDefault();
		isSubmitting = true;
		
		await new Promise(resolve => setTimeout(resolve, 1500));
		
		submitMessage = 'Thank you for contacting us! We\'ll get back to you soon.';
		isSubmitting = false;
		
		formData = { name: '', email: '', phone: '', subject: '', message: '' };
		
		setTimeout(() => {
			submitMessage = '';
		}, 5000);
	};

	onMount(() => {
		if (!browser) return;

		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		// Animate contact cards
		gsap.fromTo('.contact-info-card',
			{ opacity: 0, y: 50, scale: 0.9 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.6,
				stagger: 0.15,
				ease: 'back.out(1.7)',
				scrollTrigger: {
					trigger: '.contact-info-grid',
					start: 'top 80%',
				}
			}
		);

		// Animate form
		gsap.fromTo('.contact-form',
			{ opacity: 0, x: -50 },
			{
				opacity: 1,
				x: 0,
				duration: 1,
				scrollTrigger: {
					trigger: '.contact-form',
					start: 'top 80%',
				}
			}
		);

		// Floating animation for decorative elements
		gsap.to('.float-element', {
			y: -20,
			duration: 3,
			repeat: -1,
			yoyo: true,
			ease: 'power1.inOut',
			stagger: 0.5
		});
	});
</script>

<svelte:head>
	<title>Contact Us - Eco Sorter</title>
	<meta name="description" content="Get in touch with Eco Sorter. We're here to help with your plastic waste management needs." />
</svelte:head>

<div class="min-h-screen py-20 px-4 relative overflow-hidden">
	<!-- Animated Background Elements -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden">
		<div class="float-element absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
		<div class="float-element absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
		<div class="float-element absolute top-1/2 left-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
	</div>

	<div class="max-w-7xl mx-auto relative z-10">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
				Get In Touch
			</h1>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
			</p>
		</div>

		<!-- Contact Info Cards -->
		<div class="contact-info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
			{#each contactInfo as info}
				<a 
					href={info.link}
					class="contact-info-card group relative overflow-hidden rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-gray-200/50 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2"
				>
					<!-- Shiny overlay on hover -->
					<div class="absolute inset-0 bg-gradient-to-br {info.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
					
					<!-- Shine effect -->
					<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
						<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
					</div>

					<div class="relative z-10">
						<div class="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{info.icon}</div>
						<h3 class="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
						<p class="text-gray-600 text-sm">{info.value}</p>
					</div>
				</a>
			{/each}
		</div>

		<!-- Contact Form Section -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
			<!-- Form -->
			<div class="contact-form">
				<div class="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
					<!-- Animated gradient background -->
					<div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5"></div>
					
					<form on:submit={handleSubmit} class="relative z-10 space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="form-group">
								<label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
								<input
									type="text"
									id="name"
									bind:value={formData.name}
									required
									class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-900 hover:bg-white/80"
									placeholder=""
								/>
							</div>

							<div class="form-group">
								<label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
								<input
									type="email"
									id="email"
									bind:value={formData.email}
									required
									class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-900 hover:bg-white/80"
									placeholder=""
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div class="form-group">
								<label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
								<input
									type="tel"
									id="phone"
									bind:value={formData.phone}
									class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-900 hover:bg-white/80"
									placeholder=""
								/>
							</div>

							<div class="form-group">
								<label for="subject" class="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
								<input
									type="text"
									id="subject"
									bind:value={formData.subject}
									required
									class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-900 hover:bg-white/80"
									placeholder=""
								/>
							</div>
						</div>

						<div class="form-group">
							<label for="message" class="block text-sm font-semibold text-gray-700 mb-2">Message</label>
							<textarea
								id="message"
								bind:value={formData.message}
								required
								rows="6"
								class="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-gray-900 resize-none hover:bg-white/80"
								placeholder=""
							/>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							class="group relative w-full py-4 px-8 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 overflow-hidden"
						>
							<!-- Shine effect on button -->
							<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
							<span class="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
						</button>

						{#if submitMessage}
							<div class="text-center text-emerald-600 font-semibold bg-emerald-50 p-4 rounded-xl animate-pulse">
								{submitMessage}
							</div>
						{/if}
					</form>
				</div>
			</div>

			<!-- Info Section -->
			<div class="space-y-8">
				<!-- Why Contact Us -->
				<div class="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl">
					<div class="absolute inset-0 bg-black/10"></div>
					<div class="relative z-10">
						<h2 class="text-3xl font-bold mb-4">Why Contact Us?</h2>
						<ul class="space-y-4">
							<li class="flex items-start gap-3">
								<span class="text-2xl">✓</span>
								<span>Quick response within 24 hours</span>
							</li>
							<li class="flex items-start gap-3">
								<span class="text-2xl">✓</span>
								<span>Expert guidance on waste management</span>
							</li>
							<li class="flex items-start gap-3">
								<span class="text-2xl">✓</span>
								<span>Partnership opportunities</span>
							</li>
							<li class="flex items-start gap-3">
								<span class="text-2xl">✓</span>
								<span>Technical support available</span>
							</li>
						</ul>
					</div>
				</div>

				<!-- Social Links -->
				<div class="relative overflow-hidden rounded-3xl p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
					<h3 class="text-2xl font-bold text-gray-900 mb-6">Connect With Us</h3>
					<div class="grid grid-cols-2 gap-4">
						{#each [
							{ name: 'Instagram', icon: '📷', url: 'https://instagram.com/ecosorter' },
							{ name: 'Twitter', icon: '🐦', url: 'https://twitter.com/ecosorter' },
							{ name: 'Facebook', icon: '👥', url: 'https://facebook.com/ecosorter' },
							{ name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/company/ecosorter' }
						] as social}
							<a
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 hover:border-emerald-400"
							>
								<span class="text-3xl group-hover:scale-110 transition-transform duration-300">{social.icon}</span>
								<span class="font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">{social.name}</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
