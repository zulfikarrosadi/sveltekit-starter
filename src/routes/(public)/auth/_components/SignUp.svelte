<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import type { SignUp } from '$lib/auth-schema';
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
	let user = $state<SignUp>({
		name: '',
		email: '',
		password: '',
		passwordConfirmation: ''
	});
  let passwordConfirmationCheck = $derived(user.password !== user.passwordConfirmation ? 'Password and confirmation is not match' : null)

	async function onsubmit(event: Event) {
		event.preventDefault();

		try {
			await authClient.signUp.email(
				{
					email: user.email,
					name: user.name,
					password: user.password
				},
				{
					onRequest(context) {
						console.log('signup on request: ', context);

						isLoading = true;
					},
					onSuccess(context) {
						isLoading = false;
						toast.success('Sign up successfull');
						goto('/', { invalidateAll: true });
					},
					onError(context) {
						isLoading = false;

						(authError.message =
							context.error.code === 'USER_ALREADY_EXISTS'
								? 'User already exist, try to Sign In instead'
								: 'Sign up failed, make sure to enter correct information and try again'),
							(authError.details.email =
								context.error?.code === 'INVALID_EMAIL' ? context.error.message : ''),
							(authError.details.password =
								context.error?.code === 'PASSWORD_TOO_SHORT' ? `${context.error.message}. 8 characters minimum` : ''),
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
		<Card.Title>Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
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
		<form method="post" {onsubmit} class="space-y-4">
			<div class={[authError.details.name ? 'text-red-500' : '', 'space-y-2']}>
				<label for="name">Name</label>
				<Input
					type="text"
					name="name"
					id="name"
					bind:value={user.name}
					placeholder="Your name"
					required
					aria-required="true"
					autofocus={!!authError.details.name}
				/>
				{#if authError.details.name}
					<p class="text-sm">{authError.details.name}</p>
				{/if}
			</div>
			<div class={[authError.details.email ? 'text-red-500' : '', 'space-y-2']}>
				<label for="email">Email</label>
				<Input
					type="email"
					name="email"
					bind:value={user.email}
					id="email"
					placeholder="example@email.com"
					required
					aria-required="true"
					autofocus={!!authError.details.email}
					class={[authError.details.email ? 'text-red-500 outline outline-red-500' : '']}
				/>
				{#if authError.details.email}
					<p class="text-sm">{authError.details.email}</p>
				{/if}
			</div>
			<div class={[authError.details.password || passwordConfirmationCheck ? 'text-red-500' : '', 'space-y-2']}>
				<label for="password">Password</label>
				<Input
					type="password"
					name="password"
					id="password"
					required
					aria-required="true"
					bind:value={user.password}
					autofocus={!!authError.details.password}
					class={[authError.details.password || passwordConfirmationCheck ? 'text-red-500 outline outline-red-500' : '']}
				/>
				{#if authError.details.password || passwordConfirmationCheck}
					<p class="text-sm">{authError.details.password || passwordConfirmationCheck}</p>
				{/if}
			</div>
			<div>
				<label for="passwordConfirmation">Password Confirmation</label>
				<Input
					type="password"
					name="passwordConfirmation"
					id="passwordConfirmation"
					required
					bind:value={user.passwordConfirmation}
					aria-required="true"
				/>
			</div>
			<button class="w-full">Sign Up</button>
		</form>
    <div class="relative flex py-5 items-center">
      <div class="flex-grow border-t border-gray-400"></div>
      <span class="text-sm flex-shrink mx-4 text-gray-400">Or</span>
      <div class="flex-grow border-t border-gray-400"></div>
    </div>
    <div>
      <Button variant="outline" class="w-full cursor-pointer" onclick={(e) => handleGoogleSignIn()}>
        <img src="./google-icon.svg" width={24} alt="">
        <span>Sign up with Google</span>
      </Button>
    </div>
		<div class="mt-4 flex justify-center gap-1">
			<p>Already have an account?</p>
			<a href="/auth" class="underline">Sign In instead</a>
		</div>
	</Card.Content>
</Card.Root>
