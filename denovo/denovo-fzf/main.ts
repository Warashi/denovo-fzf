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
      return fzf(denovo, config, ...args);
    },
    "fzf-preview"(previewCommand: string, ...args: string[]): Promise<string> {
      return fzfPreview(denovo, config, previewCommand, ...args);
    },
    "fzf-with-options"(option: string, ...args: string[]): Promise<string> {
      const fzfOptions = [config["fzf-options"] ?? "", option].join(" ");
      return fzf(denovo, { ...config, "fzf-options": fzfOptions }, ...args);
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
    config,
    previewCommand,
    new TextDecoder().decode(out.stdout).trim(),
  );
  if (target != "") {
    await denovo.eval(`cd "${target.trim()}"; BUFFER=""; zle accept-line;`);
  }
}

async function fzf(
  denovo: Denovo,
  config: Config,
  ...input: string[]
): Promise<string> {
  let fzfCommand = "fzf";
  if (config["fzf-tmux"] ?? false) {
    fzfCommand = "fzf-tmux";
  }
  const fzfTmuxOptions = config["fzf-options"] ?? "";

  const temp = await Deno.makeTempFile();
  await Deno.writeTextFile(temp, input.join("\n") + "\n");
  const selected = await denovo.eval(
    `${fzfCommand} --ansi ${fzfTmuxOptions} < ${temp}`,
  ).finally(() => {
    Deno.removeSync(temp);
  });
  return selected ?? "";
}

function fzfPreview(
  denovo: Denovo,
  config: Config,
  previewCommand: string,
  ...input: string[]
) {
  const fzfOptions = (config["fzf-options"] ?? "") +
    ` --preview '${previewCommand}'`;
  return fzf(denovo, { ...config, "fzf-options": fzfOptions }, ...input);
}
