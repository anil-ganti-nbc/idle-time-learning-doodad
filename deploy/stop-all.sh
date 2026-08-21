#!/usr/bin/env bash
pkill -f "vite" 2>/dev/null && echo "all vite servers stopped" || echo "nothing running"
