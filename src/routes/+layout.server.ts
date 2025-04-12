import { auth } from "$lib/server/auth"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async (event) => {
  const response = await auth.api.getSession({
    headers: event.request.headers,
  })

  console.log('layout server root: ', response);


  event.locals.session = response?.session
  event.locals.user = response?.user

  return {
    auth: {
      session: response?.session,
      user: response?.user
    }
  }
}