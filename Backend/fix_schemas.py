import glob
import re

schema_files = glob.glob('schemas/*.py')

for filepath in schema_files:
    if filepath == 'schemas/__init__.py':
        continue
        
    with open(filepath, 'r') as f:
        lines = f.readlines()

    # 1. Add imports if not present
    content = "".join(lines)
    if 'to_camel' not in content:
        lines.insert(0, "from pydantic.alias_generators import to_camel\n")
    
    if 'from pydantic import' in content and 'ConfigDict' not in content:
        for i, line in enumerate(lines):
            if line.startswith('from pydantic import'):
                lines[i] = line.replace('from pydantic import', 'from pydantic import ConfigDict,')
                break

    new_config = "    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)\n"
    
    out_lines = []
    in_class = False
    class_indent = ""
    skip_next_config = False
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # remove old model_config lines
        if re.match(r'^[ \t]*model_config[ \t]*=[ \t]*ConfigDict\(', line):
            i += 1
            continue
            
        out_lines.append(line)
        
        m = re.match(r'^(class\s+[A-Za-z0-9_]+\s*\(.*?\)\s*:)', line)
        if m:
            # Check for docstring in the next lines
            j = i + 1
            has_docstring = False
            while j < len(lines) and lines[j].strip() == "":
                j += 1
                
            if j < len(lines) and lines[j].strip().startswith('"""'):
                # it's a docstring
                # find the end of docstring
                doc_start = j
                if lines[doc_start].strip() == '"""':
                    # empty docstring or multi line starting on next line
                    j += 1
                    while j < len(lines) and '"""' not in lines[j]:
                        j += 1
                elif lines[doc_start].strip().count('"""') == 2:
                    # single line docstring
                    pass
                else:
                    # multi line docstring
                    j += 1
                    while j < len(lines) and '"""' not in lines[j]:
                        j += 1
                
                # copy docstring to out_lines
                for k in range(i + 1, j + 1):
                    out_lines.append(lines[k])
                    
                # insert new config
                out_lines.append("\n" + new_config)
                i = j + 1
                continue
            else:
                out_lines.append("\n" + new_config)
                i += 1
                continue
                
        i += 1

    with open(filepath, 'w') as f:
        f.writelines(out_lines)

print("Updated correctly.")
