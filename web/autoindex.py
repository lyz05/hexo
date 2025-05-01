# conding=utf8
import os
import re
import json


def save(filename, contents):
    fh = open(filename, 'w', encoding='utf-8')
    fh.write(contents)
    fh.close()


g = os.walk(".")
ans = {}
list = []

for path, dir_list, file_list in g:
    for file_name in file_list:
        if (file_name.find('.html') != -1):
            try:
                name = "第"+re.findall(r"\.\\(\d{1,2})", path)[0]+"章作业"
                if name not in ans:
                    ans[name] = []
                href = os.path.join(path, file_name)
                href = href.replace('\\', '/')
                file_name = file_name[:-5]
                obj = {'name': file_name, 'href': href}
                ans[name].append(obj)
            except IndexError:
                pass



js = json.dumps(ans, ensure_ascii=False, sort_keys=True,
                indent=4)
# print(js)
save('sidebar.json', js)
