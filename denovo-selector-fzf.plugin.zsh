typeset -gaU DENOVO_PATH
DENOVO_PATH+=("${0:a:h}")

function denovo-fzf-ghq() {
  denovo_dispatch denovo-selector-fzf ghq_cd >/dev/null
}
zle -N denovo-fzf-ghq
