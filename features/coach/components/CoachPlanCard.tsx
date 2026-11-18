import type { CoachReply } from "../types";

type Props = {
  reply: CoachReply;
};

export function CoachPlanCard({ reply }: Props) {
  const rtl = reply.language === "ur";
  const hasTimer = reply.checkIn.type === "time" && !!reply.checkIn.dueInMinutes;

  return (
    <article className={`ak-magnet${rtl ? " ak-rtl" : ""}`} lang={reply.language}>
      <span className="ak-magnet__tag">{rtl ? "آج کا منصوبہ" : "Today's plan"}</span>
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
          {hasTimer
            ? rtl
              ? "کچن ٹائمر"
              : "Kitchen timer"
            : rtl
              ? "ایک سوال"
              : "Quick question"}
        </span>
        <p>{reply.checkIn.text}</p>
        {hasTimer ? (
          <p className="ak-checkin__meta">
            {rtl
              ? `اوپر ${reply.checkIn.dueInMinutes} منٹ کا ٹائمر لگ رہا ہے۔`
              : `${reply.checkIn.dueInMinutes} min timer is up on the board.`}
          </p>
        ) : (
          <p className="ak-checkin__meta">
            {rtl
              ? "جب تیار ہوں، نیچے جواب لکھ دیں۔"
              : "When you're ready, type the answer below."}
          </p>
        )}
      </div>
    </article>
  );
}
