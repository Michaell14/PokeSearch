import json
import requests
import threading

# Opening JSON file

f = open('public\move.json')
data = json.load(f)["results"]

lst=[]

def addMove(start, end):

    for i in range(start, end):
        object=data[i]
        #get api url
        api_url=object["url"]
        print(api_url)

        response = requests.get(api_url).json()
        name=" ".join(object["name"].split("-")).title()

        flavor_text = response["flavor_text_entries"]
        description=None
        for x in range(len(flavor_text)):
            if flavor_text[x]["language"]["name"]=="en":
                description = " ".join(flavor_text[x]["flavor_text"].split("\n"))
                break
            
        curr_move = {
            "value": name,
            "label":name,
            "accuracy": response["accuracy"],
            "power": response["power"],
            "pp": response["pp"],
            "type": response["type"]["name"],
            "category": response["damage_class"]["name"],
            "description": description
        }

        lst.append(curr_move)

if __name__ =="__main__":
    # creating thread
    t1 = threading.Thread(target=addMove, args=(0, 200,))
    t2 = threading.Thread(target=addMove, args=(200, 400,))
    t3 = threading.Thread(target=addMove, args=(400, 600,))
    t4 = threading.Thread(target=addMove, args=(600, 800,))
    t5 = threading.Thread(target=addMove, args=(800, len(data),))
    
    # starting thread 1
    t1.start()
    t2.start()
    t3.start()
    t4.start()
    t5.start()

    t1.join()
    t2.join()
    t3.join()
    t4.join()
    t5.join()

    print("Done!")
    

    # Closing file
    f.close()

    newData = {
        "results": lst
    }

    with open('public/filteredmoves.json', 'w') as f:
        json.dump(newData, f, ensure_ascii=False)

    print("DONE!!!")