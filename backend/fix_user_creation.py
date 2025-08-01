#!/usr/bin/env python3
import re
import os

def fix_user_creation_in_file(filepath):
    """Fix User.objects.create_user calls to include username parameter"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match User.objects.create_user calls with email parameter
    pattern = r'User\.objects\.create_user\(\s*email=([^,\)]+)'
    
    # Replace with username=email, email=email
    def replacement(match):
        email_value = match.group(1)
        return f'User.objects.create_user(\n            username={email_value},\n            email={email_value}'
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
        return True
    return False

# Fix all test files
test_files = [
    'core/test_permissions.py',
    'core/test_views.py'
]

for file in test_files:
    if os.path.exists(file):
        fix_user_creation_in_file(file)
    else:
        print(f"File not found: {file}")
