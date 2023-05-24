import type { Denovo } from "https://deno.land/x/denovo_core@v0.0.3/mod.ts";
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
  if (Deno.env.get("DENOVO_FZF_USE_TMUX") === "1") {
    fzfCommand = "fzf-tmux";
  }
  const fzfTmuxOptions = Deno.env.get("DENOVO_FZF_TMUX_OPTIONS") ?? "";
  if (fzfTmuxOptions !== "") {
    fzfCommand = `${fzfCommand} ${fzfTmuxOptions}`;
  }

  const temp = await Deno.makeTempFile();
  await Deno.writeTextFile(temp, input.join("\n") + "\n");
  return denovo.eval(`${fzfCommand} < ${temp}`).finally(() => {
    Deno.removeSync(temp);
  });
}
