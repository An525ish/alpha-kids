import type { EscalateReply } from "../types";

type Props = {
  reply: EscalateReply;
};

export function EscalateCard({ reply }: Props) {
  const rtl = reply.language === "ur";

  return (
    <article
      className={`ak-escalate${rtl ? " ak-rtl" : ""}`}
      lang={reply.language}
      role="alert"
    >
      <p className="ak-escalate__eyebrow">
        {rtl ? "ابھی حقیقی مدد" : "Get real help now"}
      </p>
      <p className="ak-summary">{reply.message}</p>
      <ul className="ak-resources">
        {reply.resources.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
