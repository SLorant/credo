/**
 * Cloudflare Worker that triggers a Cloudflare Pages deployment
 * on a scheduled basis to fetch fresh Instagram posts.
 */

export default {
  async scheduled(event, env, ctx) {
    try {
      console.log("Triggering rebuild at:", new Date().toISOString());

      // Call the Cloudflare Pages deploy hook
      const response = await fetch(env.DEPLOY_HOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Successfully triggered rebuild");
      } else {
        console.error(
          "Failed to trigger rebuild:",
          response.status,
          await response.text(),
        );
      }
    } catch (error) {
      console.error("Error triggering rebuild:", error);
    }
  },

  // Optional: Allow manual triggers via HTTP request
  async fetch(request, env, ctx) {
    if (request.method === "POST") {
      try {
        const response = await fetch(env.DEPLOY_HOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        return new Response(
          JSON.stringify({
            success: response.ok,
            status: response.status,
            message: response.ok
              ? "Rebuild triggered successfully"
              : "Failed to trigger rebuild",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    return new Response("Send a POST request to trigger a manual rebuild", {
      status: 200,
    });
  },
};
