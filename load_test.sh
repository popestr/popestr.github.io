#!/bin/bash

for var in "$@"
do
    cp "$var" "/var/www/html/$var"
done