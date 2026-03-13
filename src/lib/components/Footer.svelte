<script>
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	const navLinks = [
		{ label: 'Home', href: '/#hero' },
		{ label: 'Platform', href: '/#platform' },
		{ label: 'How It Works', href: '/#how-it-works' },
		{ label: 'Centers', href: '/centers' },
		{ label: 'Partners', href: '/#partners' },
		{ label: 'FAQ', href: '/#faq' }
	];

	const socialLinks = [
		{ name: 'Instagram', icon: '📸', url: 'https://instagram.com/ecosorter', handle: '@ecosorter' },
		{ name: 'Twitter', icon: '🐦', url: 'https://twitter.com/ecosorter', handle: '@ecosorter' },
		{ name: 'Facebook', icon: '👍', url: 'https://facebook.com/ecosorter', handle: '/ecosorter' },
		{ name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/company/ecosorter', handle: '/ecosorter' }
	];

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
		if (prefersReducedMotion) return;

		// Animate footer on scroll into view
		gsap.fromTo('footer',
			{ opacity: 0, y: 50 },
			{
				opacity: 1,
				y: 0,
				duration: 1,
				scrollTrigger: {
					trigger: 'footer',
					start: 'top 90%',
				}
			}
		);

		// Animate social icons
		gsap.fromTo('.social-icon',
			{ scale: 0, rotation: -180 },
			{
				scale: 1,
				rotation: 0,
				duration: 0.5,
				stagger: 0.1,
				ease: 'back.out(1.7)',
				scrollTrigger: {
					trigger: '.social-icons',
					start: 'top 90%',
				}
			}
		);

		// Animated glow effects
		gsap.to('.footer-glow-1', {
			x: 300,
			y: -200,
			duration: 8,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});

		gsap.to('.footer-glow-2', {
			x: -250,
			y: 150,
			duration: 10,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});

		gsap.to('.footer-glow-3', {
			x: 200,
			y: 100,
			duration: 12,
			repeat: -1,
			yoyo: true,
			ease: 'sine.inOut'
		});
	});
</script>

<footer class="relative mt-20 border-t border-emerald-200 bg-gradient-to-b from-white to-emerald-50 overflow-hidden">
	<!-- Animated Glow Effect -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden">
		<div class="footer-glow footer-glow-1 absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
		<div class="footer-glow footer-glow-2 absolute w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
		<div class="footer-glow footer-glow-3 absolute w-80 h-80 bg-teal-500/15 rounded-full blur-3xl"></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-8 py-12">
		<!-- Main Footer Content -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
			<!-- Brand Section -->
			<div class="md:col-span-2">
				<div class="inline-block mb-4">
					<div class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
						Eco Sorter
					</div>
				</div>
				<p class="text-gray-600 text-sm leading-relaxed mb-6">
					Revolutionizing plastic waste management through innovative technology. Join us in creating a cleaner, greener future for generations to come.
				</p>
				<div class="flex items-center gap-2 text-sm text-gray-600">
					<span>📧</span>
					<a href="mailto:info@ecosorter.com" class="hover:text-emerald-600 transition-colors">info@ecosorter.com</a>
				</div>
				<div class="flex items-center gap-2 text-sm text-gray-600 mt-2">
					<span>📞</span>
					<a href="tel:+911234567890" class="hover:text-emerald-600 transition-colors">+91 123 456 7890</a>
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h3 class="text-gray-900 font-bold mb-4 text-lg">Quick Links</h3>
				<ul class="space-y-2">
					{#each navLinks as link}
						<li>
							<a 
								href={link.href} 
								class="text-gray-600 hover:text-emerald-600 transition-colors duration-200 text-sm block"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<h3 class="text-gray-900 font-bold mb-4 text-lg">Resources</h3>
				<ul class="space-y-2">
					<li><a href="/about" class="text-gray-600 hover:text-emerald-600 transition-colors text-sm block">About Us</a></li>
					<li><a href="/blog" class="text-gray-600 hover:text-emerald-600 transition-colors text-sm block">Blog</a></li>
					<li><a href="/contact" class="text-gray-600 hover:text-emerald-600 transition-colors text-sm block">Contact</a></li>
					<li><a href="/careers" class="text-gray-600 hover:text-emerald-600 transition-colors text-sm block">Careers</a></li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-emerald-200 pt-8">
			<!-- App Download Button -->
			<div class="text-center mb-8">
				<a 
					href="https://play.google.com/store/apps/details?id=com.ecocredit"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
				>
					<span class="text-3xl">📱</span>
					<div class="text-left">
						<div class="text-xs opacity-90">Get it on</div>
						<div class="text-lg">Google Play</div>
					</div>
				</a>
			</div>

			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-gray-600 text-sm text-center md:text-left">
					© {new Date().getFullYear()} Eco Sorter. All rights reserved. Building a sustainable future together.
				</p>
				<div class="flex flex-wrap justify-center gap-6 text-sm">
					<a href="/privacy" class="text-gray-600 hover:text-emerald-600 transition-colors">Privacy Policy</a>
					<a href="/terms" class="text-gray-600 hover:text-emerald-600 transition-colors">Terms of Service</a>
					<a href="/cookies" class="text-gray-600 hover:text-emerald-600 transition-colors">Cookie Policy</a>
				</div>
			</div>
		</div>
	</div>
</footer>
