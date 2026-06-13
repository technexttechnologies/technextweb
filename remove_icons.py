import re

file_path = "c:\\Users\\LENOVO\\Desktop\\web\\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove <div class="ap-icon"...>...</div>
content = re.sub(r'\s*<div class="ap-icon"[^>]*>.*?</div>', '', content, flags=re.DOTALL)

# Remove <div class="svc-icon"...>...</div>
content = re.sub(r'\s*<div class="svc-icon"[^>]*>.*?</div>', '', content, flags=re.DOTALL)

# Remove <div class="wc-icon"...>...</div>
content = re.sub(r'\s*<div class="wc-icon"[^>]*>.*?</div>', '', content, flags=re.DOTALL)

# Remove <div class="catalog-promo-icon"...>...</div>
content = re.sub(r'\s*<div class="catalog-promo-icon"[^>]*>.*?</div>', '', content, flags=re.DOTALL)

# Remove <div class="ac-icon"...>...</div> (from About intro)
content = re.sub(r'\s*<div class="ac-icon"[^>]*>.*?</div>', '', content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Icons removed successfully.")
