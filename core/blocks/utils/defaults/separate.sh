#!/bin/bash

# Input JSON file
file="default-group-attributes.json"

# Get all the top level keys, i.e., the 'targets'
keys=$(jq -r 'keys[]' $file)

# Iterate over each key
for key in $keys
do
  # Use jq to extract the value corresponding to each key and write to a new file
  jq -r --arg key "$key" '.[$key]' $file > "$key.json"
done

