export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8">

      {/* Header */}
      <section>
        <h2 className="text-2xl font-semibold text-slate-100">Settings</h2>
        <p className="mt-1 text-sm text-slate-400">
          Customize Titan Workflow Systems to match your workflow.
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          Preferences
        </h3>

        <div className="space-y-4 text-sm text-slate-300">
          <p>
            • Theme: Dark mode (locked tactical mode)  
          </p>
          <p>
            • Accent Color: Desert Ops Orange (#D48A36)  
          </p>
          <p>
            • Calendar Sync: Coming soon  
          </p>
          <p>
            • Notification Digest: Coming soon  
          </p>
        </div>
      </section>

    </div>
  );
}
