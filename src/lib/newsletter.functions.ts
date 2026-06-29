import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((input: { email: string }) =>
    z.object({ email: z.string().email() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("newsletter_subscribers").insert({ email: data.email });

    if (error) {
      if (error.code === "23505") {
        return { ok: true, message: "You're already on the list!" };
      }
      throw new Error(error.message);
    }

    return { ok: true, message: "Welcome to the miaw newsletter!" };
  });
