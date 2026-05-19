export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-6 w-40 rounded-full bg-ink/10" />
      <div className="mt-5 h-12 max-w-2xl rounded-2xl bg-ink/10" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-3xl bg-white" />)}
      </div>
    </main>
  );
}
