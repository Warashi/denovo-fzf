typeset -gaU DENOVO_PATH
DENOVO_PATH+=("${0:a:h}")

function denovo-fzf-ghq() {
  denovo_notify denovo-selector-fzf ghq_cd
}
zle -N denovo-fzf-ghq
