typeset -gaU DENOVO_PATH
DENOVO_PATH+=("${0:a:h}")

: ${DENOVO_FZF_USE_TMUX:=0}
: ${DENOVO_FZF_TMUX_OPTIONS:=""}
export DENOVO_FZF_USE_TMUX DENOVO_FZF_TMUX_OPTIONS

function denovo-fzf-ghq-cd() {
  denovo_dispatch denovo-fzf ghq_cd >/dev/null
}
zle -N denovo-fzf-ghq
