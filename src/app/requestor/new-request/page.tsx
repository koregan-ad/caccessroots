import { createRequestAction } from "./actions";

const EVENT_TYPES = [
  { value: "medical", label: "Medical appointment" },
  { value: "funeral", label: "Funeral / memorial" },
  { value: "wedding", label: "Wedding" },
  { value: "family_event", label: "Family event" },
  { value: "school", label: "School / parent–teacher" },
  { value: "legal", label: "Legal / civic" },
  { value: "religious", label: "Religious service" },
  { value: "other", label: "Other" },
];

export default function NewRequestPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">New request</h1>
      <p className="text-ink-muted mt-1">
        Tell us the basics: date, location, and type of event. Keep sensitive
        details out of the form.
      </p>

      <form action={createRequestAction} className="card p-6 space-y-4 mt-6">
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" name="title" required className="input" placeholder="e.g. Grandma's 80th birthday dinner" />
        </div>

        <div>
          <label className="label" htmlFor="description">Practical details (optional)</label>
          <textarea id="description" name="description" className="input min-h-[88px]" placeholder="Share only practical details needed to make a match. Save names, signs, and family details for your interpreter after you're connected." />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="event_type">Event type</label>
            <select id="event_type" name="event_type" className="input">
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="modality">Modality</label>
            <select id="modality" name="modality" className="input">
              <option value="in_person">In person</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="languages_needed">Languages needed</label>
          <input id="languages_needed" name="languages_needed" defaultValue="ASL" className="input" placeholder="ASL, ProTactile, etc. — comma separated" />
        </div>

        <div>
          <label className="label" htmlFor="event_address">Event address</label>
          <input id="event_address" name="event_address" required className="input" placeholder="123 Main St, Springfield, VA" />
          <p className="text-xs text-ink-muted mt-1">We'll geocode this to find interpreters near the location.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="event_start">Start</label>
            <input id="event_start" name="event_start" type="datetime-local" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="event_end">End</label>
            <input id="event_end" name="event_end" type="datetime-local" required className="input" />
          </div>
        </div>

        <fieldset className="rounded-xl border border-slate-200 p-4">
          <legend className="px-2 text-sm font-medium">Sensitivity</legend>
          <div className="space-y-2 text-sm">
            <label className="flex items-start gap-2">
              <input type="radio" name="sensitivity" value="standard" defaultChecked className="mt-1" />
              <span><span className="font-medium">Standard.</span> Open to interpreters within your area.</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="sensitivity" value="sensitive" className="mt-1" />
              <span>
                <span className="font-medium">Sensitive.</span> Funeral, family
                conflict, a first meeting, or another intimate context. A
                coordinator will look at the request category before anyone is
                matched. You do not need to explain why it is sensitive.
              </span>
            </label>
          </div>
        </fieldset>

        <p className="text-xs text-ink-muted">
          Reminder: interpreters on your blocklist will never see this request.
          Manage your blocklist anytime from <strong>My blocklist</strong>.
        </p>

        <button className="btn-primary w-full">Submit request</button>
      </form>
    </div>
  );
}
