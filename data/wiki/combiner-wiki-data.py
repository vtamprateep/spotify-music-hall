import pandas as pd
import csv

with open("final_creators.csv", "w", encoding='utf-8') as creators:
    writer = csv.writer(creators, delimiter=",")
    writer.writerow(["name", "id", "spotify_url", "followers", "genres", "popularity", "images", "type", "birth_name",
                     "birth_date", "birth_place", "years_active", "instrument", "page_title", "summary", "origin"])

    df_searched = pd.read_csv("creators.csv", encoding='utf-8')
    searched_name = list(df_searched["searched_name"])

    df_wiki = pd.read_csv("combo.csv", encoding='utf-8')
    df_wiki = df_wiki.fillna('')

    for i in range(len(searched_name)):
        for j in range(len(df_wiki)):
            if df_wiki.iloc[j]["Name"] == searched_name[i]:
                writer.writerow([df_searched.iloc[i]["name"], df_searched.iloc[i]["id"], df_searched.iloc[i]["spotify_url"],
                                 df_searched.iloc[i]["followers"], df_searched.iloc[i]["genres"], df_searched.iloc[i]["popularity"],
                                 df_searched.iloc[i]["images"], df_wiki.iloc[j]["Type"], df_wiki.iloc[j]["Birth Name"],
                                 df_wiki.iloc[j]["Birth Date"], df_wiki.iloc[j]["Birth Place"], df_wiki.iloc[j]["Years Active"],
                                 df_wiki.iloc[j]["Instrument"], df_wiki.iloc[j]["Page Title"], df_wiki.iloc[j]["Summary"],
                                 df_wiki.iloc[j]["Origin"]])
                break
            if j == len(df_wiki) - 1:
                print("Hit end of wiki data for " + searched_name[i] + " and did not find a match.")

    print("Completed.")
