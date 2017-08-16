import sys

filename = sys.argv[1]

with open(filename,'r') as f:
  lines = f.readlines()
  count = 0
  for line in lines:
    if line.strip() != '' and line.strip()[0:2] != '//':
      count += 1
  print filename, 'contains', count, 'non-trivial lines of code'
