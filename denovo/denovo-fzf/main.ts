import type { Denovo } from "https://deno.land/x/denovo_core@v0.0.4/mod.ts";
import {
  assertArray,
  isString,
} from "https://deno.land/x/unknownutil@v2.1.1/mod.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

type Config = z.infer<typeof Config>;
const Config = z.object({
  "fzf-tmux": z.boolean().optional(),
  "fzf-options": z.string().optional(),
});

function isConfig(x: unknown): x is Config {
  return Config.safeParse(x).success;
}

let config: Config = {};

export function main(denovo: Denovo): Promise<void> {
  if (isConfig(denovo.config)) {
    config = denovo.config;
  }
  console.log(config);
  denovo.dispatcher = {
    fzf(...input: unknown[]): Promise<string> {
      assertArray(input, isString);
      return fzf(denovo, ...input);
    },
    "ghq-cd"(): Promise<void> {
      return ghqCD(denovo);
    },
  };
  return Promise.resolve();
}

async function ghqCD(denovo: Denovo): Promise<void> {
  const cmd = new Deno.Command("ghq", {
    args: ["list", "-p"],
    stdout: "piped",
  });
  const out = await cmd.output();
  if (!out.success) {
    return;
  }
  const target = await fzf(denovo, new TextDecoder().decode(out.stdout));
  if (target != "") {
    await denovo.eval(`cd "${target.trim()}"; BUFFER=""; zle accept-line;`);
  }
}

async function fzf(denovo: Denovo, ...input: string[]): Promise<string> {
  let fzfCommand = "fzf";
  if (config["fzf-tmux"] ?? false) {
    fzfCommand = "fzf-tmux";
  }
  const fzfTmuxOptions = config["fzf-options"] ?? "";

  const temp = await Deno.makeTempFile();
  await Deno.writeTextFile(temp, input.join("\n") + "\n");
  return denovo.eval(`${fzfCommand} ${fzfTmuxOptions} < ${temp}`).finally(
    () => {
      Deno.removeSync(temp);
    },
  );
}
