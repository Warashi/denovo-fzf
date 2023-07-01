typeset -gaU DENOVO_PATH
DENOVO_PATH+=("${0:a:h}")

function denovo-fzf-ghq-cd() {
	denovo-dispatch fzf ghq-cd >/dev/null
}
zle -N denovo-fzf-ghq-cd
