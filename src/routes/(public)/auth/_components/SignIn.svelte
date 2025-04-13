<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import * as Alert from '$lib/components/ui/alert';
	import * as Card from '$lib/components/ui/card';

	type AuthError = {
		message: string;
		details: {
			email: string;
			password: string;
			name: string;
		};
	};

	let isLoading = $state<boolean>(false);
	let authError = $state<AuthError>({
		message: '',
		details: {
			email: '',
			name: '',
			password: ''
		}
	});
	let email = $state('');
	let password = $state('');

	async function onsubmit(event: Event) {
		event.preventDefault();

		try {
			await authClient.signIn.email(
				{
					email: email,
					password: password
				},
				{
					onRequest(context) {
						console.log('signin on request: ', context);

						isLoading = true;
					},
					onSuccess(context) {
						isLoading = false;
						toast.success('Sign in successfull');
						goto('/', { invalidateAll: true });
					},
					onError(context) {
						isLoading = false;

						(authError.message = context.error.message),
							(authError.details.email =
								context.error?.code === 'INVALID_EMAIL' ? context.error.message : ''),
							(authError.details.password =
								context.error?.code === 'PASSWORD_TOO_SHORT' ? context.error.message : ''),
							console.log('signup on error: ', context);
					}
				}
			);
		} catch (error) {
			console.log('error catch: ', error);
		}
	}

  const handleGoogleSignIn = async () => {
		const data = await authClient.signIn.social({
			provider: 'google',
		});
		toast.success('Continuing with Google');
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Sign In</Card.Title>
		<Card.Description>Enter your information to sign in</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		{#if authError.message}
			<Alert.Root variant="destructive">
				<Alert.Title>Sign Up failed!</Alert.Title>
				<Alert.Description>
					{authError.message}
				</Alert.Description>
			</Alert.Root>
		{/if}

		<form {onsubmit} class="space-y-4">
			<div class={[authError.details.email ? 'text-red-500' : '']}>
				<label for="email-signin">Email</label>
				<Input
					type="email"
					name="email-signin"
					bind:value={email}
					id="email-signin"
					placeholder="example@email.com"
					required
					aria-required="true"
					autofocus={!!authError.details.email}
				/>
				{#if authError.details.email}
					<p>{authError.details.email}</p>
				{/if}
			</div>
			<div class={[authError.details.password ? 'text-red-500' : '']}>
				<label for="password-signin">Password</label>
				<Input
					type="password"
					name="password-signin"
					id="password-signin"
					required
					aria-required="true"
					bind:value={password}
					autofocus={!!authError.details.password}
				/>
				{#if authError.details.password}
					<p>{authError.details.password}</p>
				{/if}
			</div>
			<button class="w-full">Sign In</button>
		</form>
    <div class="relative flex py-5 items-center">
      <div class="flex-grow border-t border-gray-400"></div>
      <span class="text-sm flex-shrink mx-4 text-gray-400">Or</span>
      <div class="flex-grow border-t border-gray-400"></div>
    </div>
    <div>
      <Button variant="outline" class="w-full cursor-pointer" onclick={(e) => handleGoogleSignIn()}>
        <img src="./google-icon.svg" width={24} alt="">
        <span>Sign in with Google</span>
      </Button>
    </div>
		<div class="mt-4 flex justify-center gap-1">
			<p>Don't have account?</p>
			<a href="/auth" class="underline">Sign In instead</a>
		</div>
	</Card.Content>
</Card.Root>
