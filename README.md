# Quick start

denovo-fzf is plugin of [denovo.zsh][denovo.zsh].
you need to install [Deno][deno] and [denovo.zsh][denovo.zsh].
 
[denovo.zsh]: https://github.com/Warashi/denovo.zsh/
[deno]: https://deno.land/

# Features
- `denovo-fzf-ghq-cd`: change directory to directory managed by [ghq][ghq]

[ghq]: https://github.com/x-motemen/ghq

# Bindings example
```zsh
bindkey '^x' denovo-fzf-ghq-cd
```

# Options
The following environment variables is used to controll fzf.

- `DENOVO_FZF_USE_TMUX`: set `1` to use fzf-tmux
- `DENOVO_FZF_TMUX_OPTIONS`: set options to pass to fzf-tmux

# License
The code follows MIT license written in [LICENSE][./LICENSE]. Contributors need to agree that any modifications sent in this repository follow the license.
