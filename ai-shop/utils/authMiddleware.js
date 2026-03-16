import { supabase } from "@/lib/supabaseClient";

/**
 * Middleware to verify Supabase session token from Authorization header.
 * Usage in API routes:
 *   const { user, error } = await authMiddleware(req);
 *   if (error) return res.status(401).json({ error });
 */
export async function authMiddleware(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "Missing or invalid Authorization header" };
  }

  const token = authHeader.split(" ")[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return { user: null, error: "Unauthorized: invalid or expired token" };
  }

  return { user: data.user, error: null };
}
