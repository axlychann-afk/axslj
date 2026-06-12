#!/bin/bash
while true
do
    echo "[$(date)] Starting bot..."
    node index.js
    echo "[$(date)] Bot stopped, restarting in 3 seconds..."
    sleep 3
done