#!/bin/bash

while true; do
    # Check for conflicts
    if git diff --name-only --diff-filter=U | grep -q "."; then
        # Loop through each conflicting file
        git diff --name-only --diff-filter=U | while read -r file; do
            # Check if the file has an "our" version
            if git show :2:"$file" &>/dev/null; then
                # If it does, check out our version
                git checkout --ours -- "$file"
            else
                # If it doesn't, delete the file (as it doesn't exist in "our" version)
                git rm "$file"
            fi
        done

        # Add all changes and attempt to continue the rebase
        git add .
        if git rebase --continue | grep -q "No changes - did you forget to use 'git add'?"; then
            # If we encounter the "No changes" message, skip the current commit
            git rebase --skip
        fi

    else
        # No more conflicts, break out of the loop
        break
    fi
done
