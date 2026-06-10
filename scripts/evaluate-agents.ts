import { AGENTS } from "../src/lib/agents/registry";

async function main() {
  const rows: { agent: string; ok: boolean; error?: string }[] = [];

  for (const agent of Object.values(AGENTS)) {
    try {
      const output = await agent.run(agent.spec.example.input as never);
      agent.spec.outputSchema.parse(output);
      rows.push({ agent: agent.name, ok: true });
    } catch (e) {
      rows.push({ agent: agent.name, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  const failed = rows.filter((row) => !row.ok);
  console.table(rows);
  if (failed.length) {
    console.error(`${failed.length} agent eval(s) failed`);
    process.exit(1);
  }
  console.log(`${rows.length} agent eval(s) passed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
