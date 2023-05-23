typeset -gaU DENOVO_PATH
DENOVO_PATH+=("${0:a:h}")

: ${DENOVO_SELECTOR_FZF_USE_TMUX:=0}
: ${DENOVO_SELECTOR_FZF_TMUX_OPTIONS:=""}
export DENOVO_SELECTOR_FZF_USE_TMUX DENOVO_SELECTOR_FZF_TMUX_OPTIONS

function denovo-fzf-ghq() {
  denovo_dispatch denovo-selector-fzf ghq_cd >/dev/null
}
zle -N denovo-fzf-ghq
