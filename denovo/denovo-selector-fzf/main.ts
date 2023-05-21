import type { Denovo } from "https://deno.land/x/denovo_core@v0.0.1/mod.ts";
import {
  assertArray,
  isString,
} from "https://deno.land/x/unknownutil@v2.1.1/mod.ts";

export function main(denovo: Denovo): Promise<void> {
  denovo.dispatcher = {
    fzf(...input: unknown[]): Promise<string> {
      assertArray(input, isString);
      return fzf(denovo, ...input);
    },
    ghq_cd(): Promise<void> {
      return ghq_cd(denovo);
    },
  };
  return Promise.resolve();
}

async function ghq_cd(denovo: Denovo): Promise<void> {
  const cmd = new Deno.Command("ghq", {
    args: ["list", "-p"],
    stdout: "piped",
  });
  const out = await cmd.output();
  if (!out.success) {
    return;
  }
  const target = await fzf(denovo, new TextDecoder().decode(out.stdout));
  await denovo.eval(`cd "${target.trim()}"; zle reset-prompt`);
}

async function fzf(denovo: Denovo, ...input: string[]): Promise<string> {
  const temp = await Deno.makeTempFile();
  await Deno.writeTextFile(temp, input.join("\n") + "\n");
  return denovo.eval(`fzf < ${temp}`).finally(() => {
    Deno.removeSync(temp);
  });
}
