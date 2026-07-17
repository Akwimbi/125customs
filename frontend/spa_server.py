#!/usr/bin/env python3
"""
Simple SPA server for React Router - serves index.html for all routes
"""
import http.server
import socketserver
import os

PORT = 8080
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    
    def do_GET(self):
        # Check if file exists
        file_path = os.path.join(DIST_DIR, self.path.lstrip('/'))
        
        # If file doesn't exist, return index.html (for React Router)
        if not os.path.exists(file_path) or os.path.isdir(file_path):
            self.path = '/index.html'
        
        super().do_GET()

with socketserver.TCPServer(("0.0.0.0", PORT), SPAHandler) as httpd:
    print(f"✅ SPA server running at http://localhost:{PORT}")
    print(f"   (All routes return index.html for React Router)")
    httpd.serve_forever()
