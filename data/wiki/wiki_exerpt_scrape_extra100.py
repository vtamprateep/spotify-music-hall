import requests
import json
import pandas as pd
import csv

# do an iteration over the input file's artist column, need file io to open excel sheet
counter = 0

with open("bands3.csv", "w", encoding='utf-8') as band_file, open("artists3.csv", "w", encoding='utf-8') as artist_file:
    writer = csv.writer(band_file, delimiter=",")
    writer.writerow(["Band", "Type", "Origin", "Years Active", "Page Title", "Summary"])

    writer_a = csv.writer(artist_file, delimiter=",")
    writer_a.writerow(["Artist", "Type", "Birth Name", "Birth Date", "Birth Place", "Years Active", "Instrument", "Page Title", "Summary"])

    df = pd.read_csv("cleaned_500.csv", usecols=[0, 1, 2])
    artists = list(df["artist_mb"])
    # country = list(df["country_mb"])
    # for i in range(len(country)):
    #     if type(country[i]) != str:
    #         country[i] = ""
    #
    # tags_raw = list(df["tags_mb"])
    # tags = []
    # for i in range(len(tags_raw)):
    #     try:
    #         temp = tags_raw[i].split('; ')
    #         tags.append(temp[0:3])
    #         while len(tags[i]) < 3:
    #             tags[i].append("")
    #     except AttributeError:
    #         # skip if no tags
    #         # print(i)
    #         tags.append(["", "", ""])
    #         continue

    for i in range(1048, 1200):
        counter += 1
        title = ""
        content = ""
        extract = ""
        search_term = artists[i]
        temp_title = ""
        bool_band = False
        bool_individual = False
        edge_case = False
        failure = 0

        # misc infobox info
        origin_b = ""
        years_active_b = ""
        current_members_b = ""
        past_members_b = ""

        birth_name = ""
        birth_date = ""
        birth_place = ""
        years_active = ""
        instrument = ""

        # clean url to prevent broken searches
        ampersand = search_term.find("&")
        if ampersand != -1:
            search_term = search_term[0:ampersand] + "%26" + search_term[ampersand + 1::]

        # some edge cases
        if artists[i] == "Peaches":
            search_term = "Peaches (musician)"
            title = search_term
            temp_title = title
            bool_individual = True
            edge_case = True
        elif artists[i] == "Panda Bear":
            search_term = "Panda Bear (musician)"
            title = search_term
            temp_title = title
            bool_individual = True
            edge_case = True
        elif artists[i] == "HAIM":
            search_term = "Haim (band)"
            title = search_term
            temp_title = title
            bool_band = True
            edge_case = True
        elif artists[i] == "Say Anything":
            search_term = "Say Anything (band)"
            title = search_term
            temp_title = title
            bool_band = True
            edge_case = True
        elif artists[i] == "Future":
            search_term = "Future (rapper)"
            title = search_term
            temp_title = title
            bool_individual = True
            edge_case = True
        elif artists[i] == "Mew":
            search_term = "Mew (band)"
            title = search_term
            temp_title = title
            bool_band = True
            edge_case = True
        elif artists[i] == "Silverstein":
            search_term = "Silverstein (band)"
            title = search_term
            temp_title = title
            bool_band = True
            edge_case = True
        else:
            while title == "":
                # print("test")
                res = requests.get(
                    f"https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&srsearch="
                    f"{search_term}")
                resJson = json.loads(res.text)
                # print(f"{search_term} {tags[i]} {country[i]}")
                # get infobox items
                try:
                    # iterate over search results
                    for j in range(0, 4):
                        temp_title = resJson["query"]["search"][j]["title"]
                        page_id = resJson["query"]["search"][j]["pageid"]

                        # clean url to prevent broken searches
                        ampersand = temp_title.find("&")
                        if ampersand != -1:
                            temp_title = temp_title[0:ampersand] + "%26" + temp_title[ampersand + 1::]
                        comma = temp_title.find(",")
                        if comma != -1:
                            temp_title = temp_title[0:comma] + "%2C" + temp_title[comma + 1::]

                        res = requests.get(
                        f"https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=revisions&format=json"
                        f"&rvprop=content&rvsection=0&titles={temp_title}")
                        resJson_content = json.loads(res.text)
                        content = resJson_content["query"]["pages"][str(page_id)]["revisions"][0]["*"]

                        # filter non band/artist pages
                        bool_band = (content.find("origin") != -1 and
                                            content.find("genre") != -1 and content.find("years") != -1 and
                                            content.find("members") != -1)
                        bool_individual = (content.find("name") != -1 and
                                           (content.find("genre") != -1 or content.find("instrument") != -1 or
                                            content.find("works") != -1) and
                                           content.find("birth_date") != -1 and content.find("birth_place") != -1)
                        if not bool_individual and not bool_band:
                            bool_band = True

                        if ((temp_title.find("disambiguation") == -1 and temp_title.find("album)") == -1
                             and temp_title.find("ography") == -1 and temp_title.find("song)") == -1
                                and temp_title.find("film)") == -1) and
                                (content.find("Infobox musical artist") != -1 or
                                 content.find("Infobox person") != -1 or content.find("music") != -1) and
                                (content.find("runtime") == -1 or content.find("narrator") == -1 or content.find("screenplay") == -1)):
                            title = resJson["query"]["search"][j]["title"]
                            break

                    # second pass if first failed to procure result (probably a band with a common word for a
                    # name)
                    if title == "" and failure == 0:
                        search_term = search_term + " (band)"
                        failure = 1
                    elif title != "" and failure == 1:
                        failure = 0
                    elif title == "" and failure == 1:
                        break

                except KeyError:
                    print("KeyError: " + temp_title)

        if edge_case:
            res = requests.get(
                f"https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&srsearch="
                f"{search_term}")
            resJson = json.loads(res.text)
            page_id = resJson["query"]["search"][0]["pageid"]

            res = requests.get(
                f"https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=revisions&format=json"
                f"&rvprop=content&rvsection=0&titles={title}")
            resJson_content = json.loads(res.text)
            content = resJson_content["query"]["pages"][str(page_id)]["revisions"][0]["*"]

        # get misc info from infobox
        if bool_band:
            index = content.find("origin")
            first_index = index
            if index != -1:
                index = content[index::].find("= ")
                if index != -1:
                    first_index += index + 2
                    index = content[first_index:first_index+100].find("]]")
                    if index != -1:
                        origin_b = content[first_index:first_index + index]
                        if origin_b[0:2] == "[[":
                            origin_b = origin_b[2::]
                        index = origin_b.find(",")
                        if index != -1:
                            origin_b = origin_b[0:index]
                        index = origin_b.find("|")
                        if index != -1:
                            origin_b = origin_b[0:index]
                        index = origin_b.find("<!--")
                        if index != -1:
                            origin_b = origin_b[0:index]

            index = content.find("years_active")
            first_index = index
            if index != -1:
                index = content[first_index::].find("= ")
                if index != -1:
                    first_index += index + 2
                    index = content[first_index:first_index+100].find("\n")
                    if index != -1:
                        years_active_b = content[first_index:first_index+index]
                        index = years_active_b.find("list|")
                        if index != -1:
                            years_active_b = years_active_b[index + 5::]
                        if years_active_b[-2::] == "}}":
                            years_active_b = years_active_b[0:-2]
                        index = years_active_b.find("date|")
                        if index != -1:
                            years_active_b = years_active_b[index + 5::]
                            if years_active_b[4:6] == "}}":
                                years_active_b = years_active_b[0:4] + years_active_b[6::]
                        index = years_active_b.find("date|")
                        if index != -1:
                            years_active_b = years_active_b[0:index - 6] + years_active_b[index + 5::]
                            index = years_active_b.find("}}")
                            if index != -1:
                                years_active_b = years_active_b[0:index]
                        index = years_active_b.find("{{")
                        if index != -1:
                            years_active_b = years_active_b[0:index]
                        index = years_active_b.find("<")
                        if index != -1:
                            years_active_b = years_active_b[0:index]
                        index = years_active_b.find("<!--")
                        if index != -1:
                            years_active_b = years_active_b[0:index]

            #print(origin_b, years_active_b)

        elif bool_individual:
            index = content.find("birth_name")
            first_index = index
            if index != -1:
                index = content[first_index::].find("= ")
                if index != -1:
                    first_index += index + 2
                    index = content[first_index:first_index + 100].find("\n")
                    if index != -1:
                        birth_name = content[first_index:first_index + index]
                        index = birth_name.find("{{")
                        if index != -1:
                            birth_name = birth_name[0:index]
                        index = birth_name.find("<")
                        if index != -1:
                            birth_name = birth_name[0:index]
                        index = birth_name.find("<!--")
                        if index != -1:
                            birth_name = birth_name[0:index]

            index = content.find("birth_date")
            first_index = index
            if index != -1:
                index = content[first_index::].find("}}")
                if index != -1:
                    sec_index = first_index + index
                    while not content[sec_index].isnumeric():
                        sec_index -= 1
                    if content[sec_index].isnumeric():
                        sec_index += 1
                    first_index = sec_index - 13
                    if index != -1:
                        birth_date = content[first_index:sec_index]
                        index = birth_date.find("|")
                        if index != -1:
                            birth_date = birth_date[index+1::]

            index = content.find("birth_place")
            first_index = index
            if index != -1:
                index = content[index::].find("= ")
                if index != -1:
                    first_index += index + 2
                    index = content[first_index:first_index + 100].find("]]")
                    if index != -1:
                        birth_place = content[first_index:first_index + index]
                        if birth_place[0:2] == "[[":
                            birth_place = birth_place[2::]
                        index = birth_place.find(",")
                        if index != -1:
                            birth_place = birth_place[0:index]
                        index = birth_place.find("|")
                        if index != -1:
                            birth_place = birth_place[0:index]
                        index = birth_place.find("<!--")
                        if index != -1:
                            birth_place = birth_place[0:index]

            index = content.find("instrument")
            first_index = index
            if index != -1:
                index = content[first_index::].find("=")
                if index != -1:
                    first_index += index + 1
                    index = content[first_index-1:first_index + 100].find("\n|")
                    if index != -1:
                        instrument = content[first_index:first_index + index]
                        index = instrument.find("list|")
                        if index != -1:
                            instrument = instrument[index+5::]
                            if instrument[-2::] == "}}":
                                instrument = instrument[0:-2]
                        index = instrument.find("list |")
                        if index != -1:
                            instrument = instrument[index + 5::]
                            if instrument[-2::] == "}}":
                                instrument = instrument[0:-2]
                        index = instrument.find("}}")
                        if index != -1:
                            instrument = instrument[0:index]
                        index = instrument.find("<!--")
                        if index != -1:
                            instrument = instrument[0:index]
                        instrument = instrument.strip()

            index = content.find("years_active")
            first_index = index
            if index != -1:
                index = content[first_index::].find("= ")
                if index != -1:
                    first_index += index + 2
                    index = content[first_index:first_index + 200].find("\n")
                    if index != -1:
                        years_active = content[first_index:first_index + index]
                        index = years_active.find("&ndash;")
                        if index != -1:
                            years_active = years_active[0:index] + "-" + years_active[index+7::]
                        index = years_active.find("{{")
                        if index != -1:
                            years_active = years_active[0:index]
                        index = years_active.find("<")
                        if index != -1:
                            years_active = years_active[0:index]
                        index = years_active.find("<!--")
                        if index != -1:
                            years_active = years_active[0:index]

            #print(birth_name, birth_date, birth_place, years_active, instrument)

        if failure == 0:
            # get extract
            res_1 = requests.get(
                f"https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&titles={temp_title}&formatversion=2&exintro=1")
            resJson_ex = json.loads(res_1.text)
            extract = resJson_ex["query"]["pages"][0]["extract"]

            # filter out unnecessary comments in the extract
            comments = extract.find("<!--")
            if comments != -1:
                extract = extract[0:comments]
            # filter out unnecessary pronunciation listen button in the extract
            listen = extract.find("(<span><span><span></span>listen</span></span>)")
            if listen != -1:
                extract = extract[0:listen] + extract[listen + 47::]

        print(counter, artists[i], "-", title)
        if bool_band:
            writer.writerow([artists[i], "band", origin_b, years_active_b, title, extract])
        elif bool_individual:
            writer_a.writerow([artists[i], "artist", birth_name, birth_date, birth_place, years_active, instrument, title, extract])
        else:
            writer.writerow([artists[i], "band", origin_b, years_active_b, title, extract])
        #time.sleep(1)

print(f"Completed {counter} entries.")

# do a write to an output file for each item (just write the artist name, the title of page, and extract)
# remember to use domparser when displaying the contents in react
