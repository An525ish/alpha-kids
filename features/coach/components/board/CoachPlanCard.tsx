import { formatMessage, getMessages, isRtlLocale } from "../../i18n";
import type { CoachReply } from "../../types";

type Props = {
  reply: CoachReply;
};

export function CoachPlanCard({ reply }: Props) {
  const t = getMessages(reply.language);
  const rtl = isRtlLocale(reply.language);
  const hasTimer = reply.checkIn.type === "time" && !!reply.checkIn.dueInMinutes;

  return (
    <article className={`ak-magnet${rtl ? " ak-rtl" : ""}`} lang={reply.language}>
      <span className="ak-magnet__tag">{t.planTag}</span>
      <p className="ak-summary">{reply.summary}</p>
      <ol className="ak-steps">
        {reply.steps.map((step, index) => (
          <li className="ak-step" key={step}>
            <span className="ak-step__num">{index + 1}</span>
            <span className="ak-step__body">{step}</span>
          </li>
        ))}
      </ol>
      <div className="ak-checkin">
        <span className="ak-checkin__label">
          {hasTimer ? t.checkInTimer : t.checkInQuestion}
        </span>
        <p>{reply.checkIn.text}</p>
        {hasTimer ? (
          <p className="ak-checkin__meta">
            {formatMessage(t.checkInTimerMeta, {
              minutes: reply.checkIn.dueInMinutes ?? 0,
            })}
          </p>
        ) : (
          <p className="ak-checkin__meta">{t.checkInQuestionMeta}</p>
        )}
      </div>
    </article>
  );
}
