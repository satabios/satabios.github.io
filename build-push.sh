#! /bin/bash
<<<<<<< HEAD

=======
bundle exec jekyll liveserve
>>>>>>> 1acb8b4bbb8e8478768616d3291e0851b7908bd2
git_push(){
	git add .
	git commit -m "$1"
	git push -u origin master
	}

echo "Message to commit the changes made?"
read message

jekyll build
git_push "$message"
cd public
git_push "$message"

