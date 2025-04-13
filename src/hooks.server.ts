import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/server/auth';

export async function handle({ event, resolve }) {

  const response = await auth.api.getSession({
    headers: event.request.headers
  })
  event.locals.session = response?.session
  event.locals.user = response?.user

	return svelteKitHandler({ auth, event, resolve });
}
