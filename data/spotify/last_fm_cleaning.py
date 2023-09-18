f = open('lastFMData.csv', mode='r')
output = open('cleaned.csv', 'w')

data = []
artistNames = {}
artistNames['0'] = [] #This key will handle any names that don't start with a letter
letters = 'abcdefghijklmnopqrstuvwxyz'
id = 0

for each in letters:
    artistNames[each] = []

for row in f:
    artist = {}
    artist['id'] = id
    id += 1

    cells = row.split(',')

    firstCharInName = cells[1][0].lower()
    if firstCharInName not in letters:
        firstCharInName = '0' 

    # check for duplicates
    # should speed this up by maintaining a sorted list
    if cells[1] in artistNames[firstCharInName]:
        continue

    artistNames[firstCharInName].append(cells[1])

    newline = []

    artist['name'] = cells[1]
    if not artist['name']:
        continue
    newline.append(cells[1])

    artist['country'] = cells[3]
    newline.append(cells[3])

    artist['genres?'] = cells[5]
    newline.append(cells[5])

    artist['listeners'] = cells[7]
    if not artist['listeners']:
        continue
    newline.append(cells[7])

    data.append(artist)
    output.write(",".join(newline) + "\n")

    if(id % 100000 == 0):
        print(f'{id} artists processed')
            
print("Done processing artists")
print(f'Total artists: {len(data)}')
print(f'Total rows removed: {id - len(data)}')
