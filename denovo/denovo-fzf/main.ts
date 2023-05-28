import type { Denovo } from "https://deno.land/x/denovo_core@v0.0.5/mod.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

type Config = z.infer<typeof Config>;
const Config = z.object({
  "fzf-tmux": z.boolean().optional(),
  "fzf-options": z.string().optional(),
  "ghq-cd-preview": z.string().optional(),
});

function isConfig(x: unknown): x is Config {
  return Config.safeParse(x).success;
}

let config: Config = {};

export function main(denovo: Denovo): Promise<void> {
  if (isConfig(denovo.config)) {
    config = denovo.config;
  }
  denovo.dispatcher = {
    fzf(...args: string[]): Promise<string> {
      return fzf(denovo, ...args);
    },
    "fzf-preview"(previewCommand: string, ...args: string[]): Promise<string> {
      return fzfPreview(denovo, previewCommand, ...args);
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
  const previewCommand = config["ghq-cd-preview"] ?? "cat {}/README.md";
  const target = await fzfPreview(
    denovo,
    previewCommand,
    new TextDecoder().decode(out.stdout).trim(),
  );
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
  return denovo.eval(`${fzfCommand} --tac --ansi ${fzfTmuxOptions} < ${temp}`)
    .finally(
      () => {
        Deno.removeSync(temp);
      },
    );
}

async function fzfPreview(
  denovo: Denovo,
  previewCommand: string,
  ...input: string[]
): Promise<string> {
  let fzfCommand = "fzf";
  if (config["fzf-tmux"] ?? false) {
    fzfCommand = "fzf-tmux";
  }
  const fzfTmuxOptions = config["fzf-options"] ?? "";

  const temp = await Deno.makeTempFile();
  await Deno.writeTextFile(temp, input.join("\n") + "\n");
  return denovo.eval(
    `${fzfCommand} --tac --ansi ${fzfTmuxOptions} --preview '${previewCommand}' < ${temp}`,
  ).finally(
    () => {
      Deno.removeSync(temp);
    },
  );
}
