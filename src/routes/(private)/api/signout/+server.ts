import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { auth } from "$lib/server/auth";

export const POST: RequestHandler = async ({request, locals}) => {
  const response = await auth.api.signOut({headers: request.headers})
  if (!response.success) {
    return json({
      status: 'fail',
      code: 400,
      message: 'Sign out failed, please try again later'
    }, {status: 400})
  }
  locals.session = {}
  locals.user = {}

  return json({
    status: 'success',
    code: 200
  }, {status: 200})
}