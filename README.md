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
You can set options in config file: `$XDG_CONFIG_HOME/denovo/config.toml` or `$HOME/.config/denovo/config.toml`.
For example:

```toml
[plugins.denovo-fzf]
fzf-tmux = true
fzf-options = "-p 80%"
```

# License
The code follows MIT license written in [LICENSE][./LICENSE]. Contributors need to agree that any modifications sent in this repository follow the license.
