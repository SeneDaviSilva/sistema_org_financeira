import { Button } from "@/presentation/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Organização Financeira MEI</h1>
      <p className="text-muted-foreground">Setup concluído.</p>
      <Button>Teste do shadcn/ui</Button>
    </main>
  );
}