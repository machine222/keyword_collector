import { EditorWorkspace } from "../components/EditorWorkspace";

export default function Page() {
  return (
    <main className="px-4 py-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <EditorWorkspace />
      </div>
    </main>
  );
}
