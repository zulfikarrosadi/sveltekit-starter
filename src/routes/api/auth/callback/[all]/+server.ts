import type { RequestHandler } from "@sveltejs/kit";
import { toSvelteKitHandler } from "better-auth/svelte-kit";
import {auth} from '$lib/server/auth'


export const fallback: RequestHandler = toSvelteKitHandler(auth)