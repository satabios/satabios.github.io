#! /bin/bash

git_push(){
	git add .
	git commit -m "$1"
	git push -u -f origin master
	}

echo "Message to commit the changes made?"
read message

git_push "$message"

