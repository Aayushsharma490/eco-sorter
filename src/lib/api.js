// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Configuration:', API_URL);

// Helper function to get auth token
const getToken = () => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('token');
	}
	return null;
};

/**
 * Helper function to make API requests
 * @param {string} endpoint - API endpoint
 * @param {RequestInit} [options={}] - Fetch options
 * @returns {Promise<any>}
 */
const apiRequest = async (endpoint, options = {}) => {
	const token = getToken();
	
	const config = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token && { Authorization: `Bearer ${token}` }),
			...(options.headers || {})
		}
	};

	try {
		const url = `${API_URL}${endpoint}`;
		console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
		
		const response = await fetch(url, config);
		
		// Check if response is JSON
		const contentType = response.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			console.error('❌ API returned non-JSON response:', contentType);
			throw new Error('Backend server is not responding correctly. Please ensure it is running on http://localhost:5000');
		}
		
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Something went wrong');
		}

		return data;
	} catch (error) {
		console.error('❌ API Error:', error);
		throw error;
	}
};

// Authentication API
export const authAPI = {
	/**
	 * Login user
	 * @param {string} email - User email
	 * @param {string} password - User password
	 * @returns {Promise<any>}
	 */
	login: async (email, password) => {
		const data = await apiRequest('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});
		
		if (data.success && data.data.token) {
			if (typeof window !== 'undefined') {
				localStorage.setItem('token', data.data.token);
				localStorage.setItem('userRole', data.data.role);
				localStorage.setItem('userId', data.data.id);
				localStorage.setItem('userName', data.data.name);
				localStorage.setItem('isLoggedIn', 'true');
			}
		}
		
		return data;
	},

	/**
	 * Register new user
	 * @param {Object} userData - User registration data
	 * @returns {Promise<any>}
	 */
	register: async (userData) => {
		const data = await apiRequest('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData)
		});
		
		if (data.success && data.data.token) {
			localStorage.setItem('token', data.data.token);
			localStorage.setItem('userRole', data.data.role);
			localStorage.setItem('isLoggedIn', 'true');
		}
		
		return data;
	},

	/**
	 * Get current user
	 * @returns {Promise<any>}
	 */
	getMe: async () => {
		return await apiRequest('/auth/me');
	},

	/**
	 * Logout user
	 */
	logout: () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userRole');
		localStorage.removeItem('isLoggedIn');
	}
};

// Pickups API
export const pickupsAPI = {
	/**
	 * Get all pickups
	 * @returns {Promise<any>}
	 */
	getAll: async () => {
		return await apiRequest('/pickups');
	},

	/**
	 * Get pending pickups
	 * @returns {Promise<any>}
	 */
	getPending: async () => {
		return await apiRequest('/pickups/pending');
	},

	/**
	 * Create new pickup
	 * @param {Object} pickupData - Pickup data
	 * @returns {Promise<any>}
	 */
	create: async (pickupData) => {
		return await apiRequest('/pickups', {
			method: 'POST',
			body: JSON.stringify(pickupData)
		});
	},

	/**
	 * Accept a pickup
	 * @param {string} id - Pickup ID
	 * @returns {Promise<any>}
	 */
	accept: async (id) => {
		return await apiRequest(`/pickups/${id}/accept`, {
			method: 'PUT'
		});
	},

	/**
	 * Complete a pickup
	 * @param {string} id - Pickup ID
	 * @param {number} actualWeight - Actual weight collected
	 * @returns {Promise<any>}
	 */
	complete: async (id, actualWeight) => {
		return await apiRequest(`/pickups/${id}/complete`, {
			method: 'PUT',
			body: JSON.stringify({ actualWeight })
		});
	},

	/**
	 * Verify OTP and complete pickup
	 * @param {string} id - Pickup ID
	 * @param {string} otp - OTP code
	 * @param {number} actualWeight - Actual weight collected
	 * @returns {Promise<any>}
	 */
	verifyOTP: async (id, otp, actualWeight) => {
		return await apiRequest(`/pickups/${id}/verify-otp`, {
			method: 'PUT',
			body: JSON.stringify({ otp, actualWeight })
		});
	},

	/**
	 * Cancel a pickup
	 * @param {string} id - Pickup ID
	 * @returns {Promise<any>}
	 */
	cancel: async (id) => {
		return await apiRequest(`/pickups/${id}`, {
			method: 'DELETE'
		});
	}
};

// Dustbins API
export const dustbinsAPI = {
	/**
	 * Get all dustbins
	 * @returns {Promise<any>}
	 */
	getAll: async () => {
		return await apiRequest('/dustbins');
	},

	/**
	 * Get critical dustbins
	 * @returns {Promise<any>}
	 */
	getCritical: async () => {
		return await apiRequest('/dustbins/critical');
	},

	/**
	 * Create new dustbin
	 * @param {string} location - Dustbin location
	 * @returns {Promise<any>}
	 */
	create: async (location) => {
		return await apiRequest('/dustbins', {
			method: 'POST',
			body: JSON.stringify({ location })
		});
	},

	/**
	 * Update dustbin level
	 * @param {string} id - Dustbin ID
	 * @param {number} level - New level (0-100)
	 * @returns {Promise<any>}
	 */
	updateLevel: async (id, level) => {
		return await apiRequest(`/dustbins/${id}`, {
			method: 'PUT',
			body: JSON.stringify({ level })
		});
	}
};

// Collection Centers API
export const centersAPI = {
	/**
	 * Get all collection centers
	 * @returns {Promise<any>}
	 */
	getAll: async () => {
		return await apiRequest('/centers');
	},

	/**
	 * Create new collection center
	 * @param {Object} centerData - Center data
	 * @returns {Promise<any>}
	 */
	create: async (centerData) => {
		return await apiRequest('/centers', {
			method: 'POST',
			body: JSON.stringify(centerData)
		});
	},

	/**
	 * Update collection center
	 * @param {string} id - Center ID
	 * @param {Object} centerData - Updated center data
	 * @returns {Promise<any>}
	 */
	update: async (id, centerData) => {
		return await apiRequest(`/centers/${id}`, {
			method: 'PUT',
			body: JSON.stringify(centerData)
		});
	},

	/**
	 * Delete collection center
	 * @param {string} id - Center ID
	 * @returns {Promise<any>}
	 */
	delete: async (id) => {
		return await apiRequest(`/centers/${id}`, {
			method: 'DELETE'
		});
	}
};

// Statistics API
export const statsAPI = {
	/**
	 * Get admin dashboard statistics
	 * @returns {Promise<any>}
	 */
	getAdminStats: async () => {
		return await apiRequest('/stats/admin');
	},

	/**
	 * Get executive dashboard statistics
	 * @returns {Promise<any>}
	 */
	getExecutiveStats: async () => {
		return await apiRequest('/stats/executive');
	},

	/**
	 * Get user dashboard statistics
	 * @returns {Promise<any>}
	 */
	getUserStats: async () => {
		return await apiRequest('/stats/user');
	}
};

// Location Tracking API
export const locationAPI = {
	/**
	 * Update current location
	 * @param {number} latitude - Latitude
	 * @param {number} longitude - Longitude
	 * @param {string | null} [pickupId] - Optional pickup ID
	 * @returns {Promise<any>}
	 */
	updateLocation: async (latitude, longitude, pickupId = null) => {
		/** @type {{ latitude: number; longitude: number; pickupId?: string }} */
		const body = { latitude, longitude };
		if (pickupId) {
			body.pickupId = pickupId;
		}
		return await apiRequest('/location/update', {
			method: 'POST',
			body: JSON.stringify(body)
		});
	},

	/**
	 * Get location for a pickup
	 * @param {string} pickupId - Pickup ID
	 * @returns {Promise<any>}
	 */
	getPickupLocation: async (pickupId) => {
		return await apiRequest(`/location/pickup/${pickupId}`);
	},

	/**
	 * Get executive location
	 * @param {string} executiveId - Executive ID
	 * @returns {Promise<any>}
	 */
	getExecutiveLocation: async (executiveId) => {
		return await apiRequest(`/location/executive/${executiveId}`);
	}
};

// Users Management API (Admin)
export const usersAPI = {
	/**
	 * Get all users
	 * @returns {Promise<any>}
	 */
	getAll: async () => {
		return await apiRequest('/users');
	},

	/**
	 * Get user statistics
	 * @returns {Promise<any>}
	 */
	getStats: async () => {
		return await apiRequest('/users/stats');
	},

	/**
	 * Create new user
	 * @param {Object} userData - User data
	 * @returns {Promise<any>}
	 */
	create: async (userData) => {
		return await apiRequest('/users', {
			method: 'POST',
			body: JSON.stringify(userData)
		});
	},

	/**
	 * Update user
	 * @param {string} id - User ID
	 * @param {Object} userData - Updated user data
	 * @returns {Promise<any>}
	 */
	update: async (id, userData) => {
		return await apiRequest(`/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(userData)
		});
	},

	/**
	 * Delete user
	 * @param {string} id - User ID
	 * @returns {Promise<any>}
	 */
	delete: async (id) => {
		return await apiRequest(`/users/${id}`, {
			method: 'DELETE'
		});
	}
};
