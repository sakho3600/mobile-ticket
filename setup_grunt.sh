#!/bin/bash
  echo "Updating npm..."
  npm update
  echo "Setting up grunt...."
  npm install -g grunt-cli 
  echo "Start installing grunt clean"
  npm install grunt-contrib-clean --save-dev
  echo "Start installing grunt uglify"
  npm install grunt-contrib-uglify --save-dev
  echo "Start installing grunt file copy"
  npm install grunt-contrib-copy --save-dev
  echo "Start installing grunt-replace"
  npm install grunt-replace --save-dev
  echo "Start installing grunt-war"
  npm install grunt-war --save-dev
  echo "Start installing grunt-shell"
  npm install --save-dev grunt-shell
  echo "Start installing grunt-ssh"
  npm install grunt-ssh --save-dev
  echo "Start installing grunt-contrib-concat"
  npm install grunt-contrib-concat --save-dev
  echo "Start installing grunt-contrib-htmlmin"
  npm install grunt-contrib-htmlmin --save-dev
  echo "Grunt setup complete."