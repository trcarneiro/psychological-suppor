import { Resend } from "resend";
const resend = new Resend("re_iWZkDFbY_JSEFAUfTwdwoDEtsFWMu9tKQ");
const { data, error } = await resend.emails.send({
  from: "Plataforma Psi <onboarding@resend.dev>",
  to: ["trcampos@gmail.com"],
  subject: " TESTE - Novo Lead Score 85",
  html: "<h1> Email de Teste</h1><p><b>Lead:</b> João da Silva<br><b>Score:</b> 85</p>"
});
if (error) { console.error("Erro:", error); } else { console.log(" Enviado! ID:", data.id); }
