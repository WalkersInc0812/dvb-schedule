import { Resend } from "resend";
import { SendVerificationRequestParams } from "next-auth/providers/email";
import { db } from "@/lib/db";

function html(params: SendVerificationRequestParams) {
  const { url } = params;
  const host = new URL(url).host;
  const brandColor = "#0092FC";
  const buttonText = "#fff";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText,
  };
  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        <strong>${host}</strong> にログインする
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">ログイン</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        このメールにお心あたりがない場合は、無視していただいて問題ございません。
      </td>
    </tr>
  </table>
</body>
`;
}

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams
) => {
  let {
    identifier: email,
    url,
    provider: { from },
  } = params;

  try {
    // DBにメアドが無い場合は、エラーを返す
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const resend = new Resend(process.env.AUTH_RESEND_KEY!);
    await resend.emails.send({
      from: from,
      to: email,
      subject: "みらい学校ダビンチボックス",
      html: html(params),
    });
  } catch (error) {
    console.log({ error });

    throw error;
  }
};
