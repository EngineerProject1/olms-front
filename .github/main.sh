echo "$CODING_PRIVATE" > key
chmod 500 key
export GIT_SSH_COMMAND='ssh -i ./key -o IdentitiesOnly=yes -o StrictHostKeyChecking=no'
git remote add coding git@e.coding.net:gongchengshijian21/cuit9622cuit9622/olms-front.git
git push -u coding main
