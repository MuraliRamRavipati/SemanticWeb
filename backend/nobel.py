from flask import Flask
from flask import jsonify
import rdflib
from flask_cors import CORS

g = rdflib.Graph()
g.parse("nobeldata.owl")

app = Flask(__name__)

CORS(app)


@app.route("/nobel/nations", methods=['GET'])
def getNations():

    result = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n
            {
                ?g rdf:type table:PersonWinner;
                table:nationality ?n.
            }
            GROUP BY ?n
        """
    )

    nations = []
    for row in result:
        name = ("%s" % row).rsplit('/', 1)[-1]
        nations.append(name)

    nations.sort()

    return jsonify({'data': nations})


@app.route("/nobel/categories", methods=['GET'])
def getCategories():

    result = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?w
            {
                ?g rdf:type table:PersonWinner;
                table:WonPrize ?w.
            }
            GROUP BY ?w
        """
    )

    categories = []
    for row in result:
        category = ("%s" % row).split('/')[-4]
        if category not in categories:
            categories.append(category)
    
    categories.sort()

    return jsonify({'data': categories})


@app.route("/nobel/years", methods=['GET'])
def getYears():

    result = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?w
            {
                ?g rdf:type table:PersonWinner;
                table:WonPrize ?w.
            }
            GROUP BY ?w
        """
    )

    years = []
    for row in result:
        year = int(("%s" % row).split('/')[-2])
        if year not in years:
            years.append(year)

    years.sort()

    return jsonify({'data': years})


@app.route("/nobel/<string:year>", methods=['GET'])
def getWinnersByYear(year):

    result = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n
            {
                ?g rdf:type table:PersonWinner;
                table:name ?n;
                table:WonPrize ?w.
                ?w table:yearWon ?y.
                FILTER (?y = """ + year + """)
            }
        """
    )

    winners = []
    for row in result:
        winners.append("%s" % row)

    winners.sort()

    return jsonify({'data': winners})


@app.route("/nobel/nations/<string:nation>", methods=['GET'])
def getWinnersByNation(nation):

    result = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n ?d
            {
                ?g rdf:type table:PersonWinner;
                table:name ?n;
                table:nationality ?d.
            }
        """
    )

    winners = []
    for row in result:
        if nation in ("%s %s" % row):
            winners.append(("%s %s" % row).split("http", 1)[0])

    winners.sort()

    return jsonify({'data': winners})


@app.route("/nobel/categories/<string:category>", methods=['GET'])
def getWinnersByCategory(category):

    result = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n ?w
            {
                ?g rdf:type table:PersonWinner;
                table:name ?n;
                table:WonPrize ?w.
            }
        """
    )

    winners = []
    for row in result:
        if category in ("%s %s" % row):
            winners.append(("%s %s" % row).split("http", 1)[0])

    winners.sort()

    return jsonify({'data': winners})


@app.route("/nobel/<string:year>/<string:category>", methods=['GET'])
def getWinnersByYearAndCategory(year, category):

    result = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n ?w
            {
                ?g rdf:type table:PersonWinner;
                table:name ?n;
                table:WonPrize ?w.
                ?w table:yearWon ?y.
                FILTER (?y = """ + year + """)
            }
        """
    )

    winners = []
    for row in result:
        if (category in ("%s %s" % row)):
            winners.append(("%s %s" % row).split("http", 1)[0])
    winners.sort()

    return jsonify({'data': winners})


@app.route("/details/<string:name>")
def getUserDetails(name):

    userDetails = {
        "name": name,
        "nationality": '',
        "category": '',
        "nobelYear": '',
        "association": '',
        "birthYear": '',
        "deathYear": '',
        "motivation": '',
        "photo": ''
    }

    details = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n ?nt ?b ?p ?w ?y
            {
                ?g rdf:type table:PersonWinner;
                table:name ?n;
                table:nationality ?nt;
                table:birthYear ?b;
                table:photo ?p;
                table:WonPrize ?w.
                ?w table:yearWon ?y;   
            }
        """
    )

    associations = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n ?a
                {
                    ?g rdf:type table:PersonWinner;
                    table:name ?n;
                    table:Association ?a.
                }
        """
    )

    diedInfo = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n ?d
            {
                ?g rdf:type table:PersonWinner;
                table:name ?n;
                table:deathYear ?d.
            }
        """
    )

    motivations = g.query(
        """
            PREFIX table:<http://swat.cse.lehigh.edu/resources/onto/nobel.owl#>
            PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd:<http://www.w3.org/2001/XMLSchema#>
            SELECT ?n ?m
            {
                ?g rdf:type table:PersonWinner;
                table:name ?n;
                table:WonPrize ?w.
                ?w table:motivation ?m;
            }
        """
    )

    for row in details:
        if name in str(row.asdict()['n'].toPython()):
            userDetails["nationality"] = str(
                row.asdict()['nt'].toPython()).split('/')[-1]
            userDetails["birthYear"] = str(row.asdict()['b'].toPython())
            userDetails["photo"] = str(row.asdict()['p'].toPython())
            userDetails["category"] = str(
                row.asdict()['w'].toPython()).split('/')[-4]
            userDetails["nobelYear"] = str(row.asdict()['y'].toPython())

    for row in associations:
        if name in str(row.asdict()['n'].toPython()):
            userDetails["association"] = str(
                row.asdict()['a'].toPython()).split('#', 1)[-1]

    for row in diedInfo:
        if name in str(row.asdict()['n'].toPython()):
            userDetails["deathYear"] = str(row.asdict()['d'].toPython())

    for row in motivations:
        if name in str(row.asdict()['n'].toPython()):
            userDetails["motivation"] = str(row.asdict()['m'].toPython())

    return jsonify({'data': userDetails})


if __name__ == "__main__":
    app.run()
