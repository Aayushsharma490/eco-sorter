<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { usersAPI, authAPI } from '$lib/api';

	let users = [];
	let loading = true;
	let showModal = false;
	let editingUser = null;
	let formData = {
		name: '',
		email: '',
		password: '',
		role: 'user',
		phone: '',
		credits: 0
	};

	onMount(async () => {
		if (browser) {
			const token = localStorage.getItem('token');
			const role = localStorage.getItem('userRole');
			
			if (!token || role !== 'admin') {
				goto('/login');
				return;
			}

			await loadUsers();
		}
	});

	const loadUsers = async () => {
		try {
			const response = await usersAPI.getAll();
			if (response.success) {
				users = response.data;
			}
		} catch (error) {
			console.error('Error fetching users:', error);
		} finally {
			loading = false;
		}
	};

	const openCreateModal = () => {
		editingUser = null;
		formData = {
			name: '',
			email: '',
			password: '',
			role: 'user',
			phone: '',
			credits: 0
		};
		showModal = true;
	};

	const openEditModal = (user) => {
		editingUser = user;
		formData = {
			name: user.name,
			email: user.email,
			password: '',
			role: user.role,
			phone: user.phone || '',
			credits: user.credits || 0
		};
		showModal = true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			if (editingUser) {
				const updateData = { ...formData };
				if (!updateData.password) delete updateData.password;
				
				const response = await usersAPI.update(editingUser.id, updateData);
				if (response.success) {
					alert('User updated successfully!');
					showModal = false;
					await loadUsers();
				}
			} else {
				const response = await usersAPI.create(formData);
				if (response.success) {
					alert('User created successfully!');
					showModal = false;
					await loadUsers();
				}
			}
		} catch (error) {
			alert('Error: ' + error.message);
		}
	};

	const handleDelete = async (userId) => {
		if (!confirm('Are you sure you want to delete this user?')) return;
		
		try {
			const response = await usersAPI.delete(userId);
			if (response.success) {
				alert('User deleted successfully!');
				await loadUsers();
			}
		} catch (error) {
			alert('Error: ' + error.message);
		}
	};

	const getRoleBadgeColor = (role) => {
		switch (role) {
			case 'admin': return 'bg-purple-100 text-purple-800';
			case 'executive': return 'bg-blue-100 text-blue-800';
			default: return 'bg-green-100 text-green-800';
		}
	};
</script>

<svelte:head>
	<title>Manage Users - Admin Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="flex justify-between items-center mb-8">
			<div>
				<button 
					on:click={() => goto('/dashboard/admin')}
					class="text-emerald-600 hover:text-emerald-700 mb-2 flex items-center gap-2"
				>
					← Back to Dashboard
				</button>
				<h1 class="text-4xl font-bold text-gray-900">Manage Users</h1>
				<p class="text-gray-600 mt-2">View and manage all system users</p>
			</div>
			<button
				on:click={openCreateModal}
				class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all"
			>
				+ Add New User
			</button>
		</div>

		<!-- Users Table -->
		<div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
			{#if loading}
				<div class="text-center py-12">
					<p class="text-gray-600">Loading users...</p>
				</div>
			{:else if users.length === 0}
				<div class="text-center py-12">
					<p class="text-gray-600">No users found</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 border-b border-gray-200">
							<tr>
								<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
								<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
								<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
								<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Credits</th>
								<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
								<th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200">
							{#each users as user}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 text-sm text-gray-900">{user.name}</td>
									<td class="px-6 py-4 text-sm text-gray-600">{user.email}</td>
									<td class="px-6 py-4">
										<span class="px-3 py-1 rounded-full text-xs font-semibold {getRoleBadgeColor(user.role)}">
											{user.role.toUpperCase()}
										</span>
									</td>
									<td class="px-6 py-4 text-sm font-semibold text-emerald-600">{user.credits || 0}</td>
									<td class="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
									<td class="px-6 py-4">
										<div class="flex gap-2">
											<button
												on:click={() => openEditModal(user)}
												class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-all"
											>
												Edit
											</button>
											<button
												on:click={() => handleDelete(user.id)}
												class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-all"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Create/Edit Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
			<h3 class="text-2xl font-bold text-gray-900 mb-6">
				{editingUser ? 'Edit User' : 'Create New User'}
			</h3>
			
			<form on:submit={handleSubmit} class="space-y-4">
				<div>
					<label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Name</label>
					<input 
						type="text" 
						id="name"
						bind:value={formData.name}
						required
						class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
					/>
				</div>

				<div>
					<label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
					<input 
						type="email" 
						id="email"
						bind:value={formData.email}
						required
						class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
						Password {editingUser ? '(leave blank to keep current)' : ''}
					</label>
					<input 
						type="password" 
						id="password"
						bind:value={formData.password}
						required={!editingUser}
						class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
					/>
				</div>

				<div>
					<label for="role" class="block text-sm font-semibold text-gray-700 mb-2">Role</label>
					<select 
						id="role"
						bind:value={formData.role}
						class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
					>
						<option value="user">User</option>
						<option value="executive">Executive</option>
						<option value="admin">Admin</option>
					</select>
				</div>

				<div>
					<label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
					<input 
						type="tel" 
						id="phone"
						bind:value={formData.phone}
						class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
					/>
				</div>

				<div>
					<label for="credits" class="block text-sm font-semibold text-gray-700 mb-2">Credits</label>
					<input 
						type="number" 
						id="credits"
						bind:value={formData.credits}
						min="0"
						class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
					/>
				</div>

				<div class="flex gap-3 mt-6">
					<button 
						type="submit"
						class="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl transition-all"
					>
						{editingUser ? 'Update' : 'Create'}
					</button>
					<button 
						type="button"
						on:click={() => showModal = false}
						class="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-xl transition-all"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
