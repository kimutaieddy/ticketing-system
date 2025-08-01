#!/usr/bin/env python3
import re
import os

def fix_test_issues(filepath):
    """Comprehensive fix for test issues"""
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix 1: User.objects.create_user with email parameter
    pattern1 = r'User\.objects\.create_user\(\s*email=([^,\)]+)'
    def replacement1(match):
        email_value = match.group(1)
        return f'User.objects.create_user(\n            username={email_value},\n            email={email_value}'
    content = re.sub(pattern1, replacement1, content)
    
    # Fix 2: User.objects.create_superuser with email parameter
    pattern2 = r'User\.objects\.create_superuser\(\s*email=([^,\)]+)'
    def replacement2(match):
        email_value = match.group(1)
        return f'User.objects.create_superuser(\n            username={email_value},\n            email={email_value}'
    content = re.sub(pattern2, replacement2, content)
    
    # Fix 3: Event.objects.create with old field names
    # Replace title= with name=
    content = re.sub(r'(\s+)title=', r'\1name=', content)
    
    # Replace date=...timedelta(...) with start_time=...timedelta(...)
    content = re.sub(r'(\s+)date=(timezone\.now\(\)[^,\n]+)', r'\1start_time=\2,\n\1end_time=\2 + timedelta(hours=3)', content)
    
    # Remove price field from Event creation
    content = re.sub(r',?\s*price=[^,\n]+', '', content)
    
    # Fix 4: Ticket creation with price field -> status field
    content = re.sub(r'(\s+)price=([^,\n]+)', r'\1status=\'paid\'', content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Fixed {filepath}")
        return True
    else:
        print(f"⚪ No changes needed for {filepath}")
        return False

# Fix the test_views.py file
if os.path.exists('core/test_views.py'):
    fix_test_issues('core/test_views.py')
else:
    print("❌ core/test_views.py not found")
