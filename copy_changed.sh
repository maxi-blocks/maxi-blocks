#!/bin/bash

# Destination folder
destination="/home/elzadj/Work/changes"

# Read the file line by line
while IFS= read -r file; do
  # Create the destination directory structure
  mkdir -p "$destination/$(dirname "$file")"

  # Copy the file to the destination directory
  cp "$file" "$destination/$file"
done < changed_files.txt
