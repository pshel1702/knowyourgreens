"""Server set up for KnowYourGreens"""

from flask import (Flask, render_template,request)
from model import connect_to_db
import crud, scraper, time

app = Flask(__name__)
app.secret_key = "RANDOM SECRETLY GENERATED KEY"

@app.route('/')
def homepage():
    """View Homepage"""

    return render_template('homepage.html')

@app.route('/results',methods=["POST"])
def results():
    """Show info about plant from database"""
    plant = request.form.get("plant_name")
    plant.lower()
    if ' ' in plant:
        plant_url = plant.split(' ')
        plant_url = '-'.join(plant_url)
    results = crud.check_if_plant_in_db(plant)
    if results == {} :
        scraper.get_plant_info(plant_url)
        results = crud.check_if_plant_in_db(plant)
        print(plant)
    
    return render_template('results.html', results=results)
    

if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
