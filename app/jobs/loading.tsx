export default function JobsLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-5 w-32 rounded-full bg-ink/10" />
      <div className="mt-4 h-10 max-w-lg rounded-2xl bg-ink/10" />
      <div className="mt-8 h-56 rounded-3xl bg-white" />
      <div className="mt-8 grid gap-4">
        {[0, 1, 2].map((item) => <div key={item} className="h-64 rounded-3xl bg-white" />)}
      </div>
    </main>
  );
}
