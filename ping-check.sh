#!/bin/bash

while true
do
  echo "=============================="
  echo "Time: $(date)"
  echo "Pinging 10.8.12.28..."
  ping -c 4 10.8.12.28

  echo "------------------------------"
  echo "Pinging 10.8.9.9..."
  ping -c 4 10.8.9.9

  echo "Waiting 2 minutes..."
  sleep 120
done
