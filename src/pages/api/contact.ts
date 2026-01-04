import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = await request.json();
    const { name, company, phone, email, message, selectedOptions } = data;

    // Initialize Resend with your API key from Cloudflare runtime environment
    const resendApiKey =
      (locals as any).runtime?.env?.RESEND_API_KEY ||
      import.meta.env.RESEND_API_KEY;
    const resend = new Resend(resendApiKey);

    // Format selected options for email
    const optionsHtml =
      selectedOptions && selectedOptions.length > 0
        ? `<p><strong>Kiválasztott szolgáltatások:</strong></p>
         <ul>${selectedOptions
           .map((opt: string) => `<li>${opt}</li>`)
           .join("")}</ul>`
        : "";

    // Send email
    const recipientEmail =
      (locals as any).runtime?.env?.RECIPIENT_EMAIL ||
      import.meta.env.RECIPIENT_EMAIL ||
      "your-email@example.com";
    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev", // You'll need to change this to your verified domain
      to: recipientEmail,
      subject: `Credo weboldal új kapcsolatfelvétel: ${name}`,
      html: `
        <h2>Új kapcsolatfelvétel a Credo weboldalról</h2>
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>Cégnév:</strong> ${company}</p>
        <p><strong>Telefonszám:</strong> ${phone}</p>
        <p><strong>E-mail cím:</strong> ${email}</p>
        ${optionsHtml}
        <p><strong>Üzenet:</strong></p>
        <p>${message}</p>
      `,
    });

    return new Response(
      JSON.stringify({
        message: "Email sikeresen elküldve!",
        id: emailResponse.data?.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({
        message: "Hiba történt az email küldése során.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
