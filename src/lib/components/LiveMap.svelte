<script>
	import { onMount, onDestroy } from 'svelte';

	export let userLocation = null;
	export let executiveLocation = null;
	export let showUserMarker = true;
	export let showExecutiveMarker = true;

	let mapContainer;
	let map;
	let userMarker;
	let executiveMarker;
	let mapLoaded = false;

	onMount(() => {
		// Initialize map with Leaflet (using CDN)
		if (typeof window !== 'undefined') {
			loadLeaflet();
		}
	});

	const loadLeaflet = () => {
		// Add Leaflet CSS
		if (!document.getElementById('leaflet-css')) {
			const link = document.createElement('link');
			link.id = 'leaflet-css';
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);
		}

		// Add Leaflet JS
		if (!window.L) {
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
			script.onload = initMap;
			document.head.appendChild(script);
		} else {
			initMap();
		}
	};

	const initMap = () => {
		if (!mapContainer || mapLoaded) return;

		const defaultCenter = [28.6139, 77.2090]; // Delhi, India
		const defaultZoom = 13;

		map = window.L.map(mapContainer).setView(defaultCenter, defaultZoom);

		window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		mapLoaded = true;
		updateMarkers();
	};

	const updateMarkers = () => {
		if (!map || !window.L) return;

		// Update user marker
		if (showUserMarker && userLocation) {
			if (userMarker) {
				userMarker.setLatLng([userLocation.latitude, userLocation.longitude]);
			} else {
				const userIcon = window.L.divIcon({
					html: '<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">📍</div>',
					className: 'custom-marker',
					iconSize: [32, 32],
					iconAnchor: [16, 16]
				});

				userMarker = window.L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
					.addTo(map)
					.bindPopup('<b>Your Location</b>');
			}
		}

		// Update executive marker
		if (showExecutiveMarker && executiveLocation) {
			if (executiveMarker) {
				executiveMarker.setLatLng([executiveLocation.latitude, executiveLocation.longitude]);
			} else {
				const execIcon = window.L.divIcon({
					html: '<div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">🚚</div>',
					className: 'custom-marker',
					iconSize: [32, 32],
					iconAnchor: [16, 16]
				});

				executiveMarker = window.L.marker([executiveLocation.latitude, executiveLocation.longitude], { icon: execIcon })
					.addTo(map)
					.bindPopup('<b>Executive Location</b>');
			}
		}

		// Fit bounds to show both markers
		if (userMarker && executiveMarker) {
			const bounds = window.L.latLngBounds([
				userMarker.getLatLng(),
				executiveMarker.getLatLng()
			]);
			map.fitBounds(bounds, { padding: [50, 50] });
		} else if (userMarker) {
			map.setView(userMarker.getLatLng(), 15);
		} else if (executiveMarker) {
			map.setView(executiveMarker.getLatLng(), 15);
		}
	};

	$: if (mapLoaded && (userLocation || executiveLocation)) {
		updateMarkers();
	}

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<div bind:this={mapContainer} class="w-full h-full rounded-xl overflow-hidden shadow-lg" style="position: relative; z-index: 1;"></div>

<style>
	:global(.custom-marker) {
		background: transparent !important;
		border: none !important;
	}
</style>
