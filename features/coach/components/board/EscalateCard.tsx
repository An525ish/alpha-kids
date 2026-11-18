import { getMessages, isRtlLocale } from "../../i18n";
import type { EscalateReply } from "../../types";

type Props = {
  reply: EscalateReply;
};

export function EscalateCard({ reply }: Props) {
  const t = getMessages(reply.language);
  const rtl = isRtlLocale(reply.language);

  return (
    <article
      className={`ak-escalate${rtl ? " ak-rtl" : ""}`}
      lang={reply.language}
      role="alert"
    >
      <p className="ak-escalate__eyebrow">{t.escalateEyebrow}</p>
      <p className="ak-summary">{reply.message}</p>
      <ul className="ak-resources">
        {reply.resources.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
