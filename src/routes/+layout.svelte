<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
  import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { toast } from 'svelte-sonner';

	let { data, children } = $props();

	async function handleLogout(event: Event) {
		event.preventDefault();

		const response = await authClient.signOut();
		if (response.error?.status) {
			console.log('signout error: ', response.error);
			return;
		}
    toast.success('Sign out successfull')
		goto('/', {
			invalidateAll: true
		});
	}
</script>

<header class="flex h-12 w-full items-center border-b-2">
	<nav class="mx-auto flex w-10/12 items-center justify-between">
		<div>
			<a href="/">Belajaro</a>
		</div>

		<div class="">
			{#if !data.auth?.user?.name}
				<div>
					<a href="/auth">Sign In</a>
				</div>
			{:else}
				<div class="flex gap-4">
          <form onsubmit={handleLogout}>
            <button class="cursor-pointer">Sign Out</button>
					</form>
          <div>
            <p class="font-bold">{data.auth.user.name}</p>
          </div>
				</div>
			{/if}
		</div>
	</nav>
</header>

<Toaster richColors closeButton expand={true} position="top-right"/>

<main class="w-full mx-auto">
  {@render children()}
</main>