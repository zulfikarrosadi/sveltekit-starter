<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';

  let { form } = $props();
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<form
	method="post"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				goto(result.location, { invalidateAll: true });
			} else {
				await applyAction(result);
			}
		};
	}}
>
  {#if form?.status === 'fail'}
    <p>Error: {form.error.message}</p>
  {/if}
	<div>
		<label for="name">Name</label>
		<input
			type="text"
			name="name"
			id="name"
			placeholder="Your name"
			required
			aria-required="true"
		/>
	</div>
	<div>
		<label for="email">Email</label>
		<input
			type="email"
			name="email"
			id="email"
			placeholder="example@email.com"
			required
			aria-required="true"
		/>
    {#if form?.error?.details?.email}
      <p>{form.error.details.email}</p>
    {/if}
	</div>
	<div>
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required aria-required="true" />
    {#if form?.error?.details?.password}
      <p>{form.error.details.password}</p>
    {/if}
	</div>
	<div>
		<label for="passwordConfirmation">Password Confirmation</label>
		<input
			type="password"
			name="passwordConfirmation"
			id="passwordConfirmation"
			required
			aria-required="true"
		/>
	</div>
	<button>Sign Up</button>
</form>
