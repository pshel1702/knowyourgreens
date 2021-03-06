"""CRUD Operations"""

from model import db, Plant, User, Favorite, Varietal, connect_to_db
from passlib.hash import pbkdf2_sha256
import time

def create_user(username, name, password):
    """Create new user"""
    if not User.query.filter_by(username=username).first():
        user = User(username=username,name=name,password=password)
        db.session.add(user)
        db.session.commit()
        return user.user_id
    else:
        print('Username exists!')
        return 
    

def get_plant_info(name):
    """Get info about plant"""
    plant = Plant.query.filter(Plant.name.ilike(f'%{name}%')).first()
    if plant:
        return plant.img_src

def check_if_plant_in_db(name):
    """Check if plant info exists in db"""
    results = {}
    all_plants = Plant.query.options(db.joinedload('varietals'))
    all_name_instances = all_plants.filter(Plant.name.ilike(f'%{name}%')).all()

    for plant in all_name_instances:
        plant_varietals = plant.varietals
        for varietal in plant_varietals:
            results[varietal.varietal_name] = varietal.varietal_name
            results[varietal.varietal_name] = {}
            results[varietal.varietal_name]['Sunlight'] = varietal.sunlight
            results[varietal.varietal_name]['Water'] = varietal.water
            results[varietal.varietal_name]['Humidity'] = varietal.humidity
            results[varietal.varietal_name]['Temperature'] = varietal.temperature
            results[varietal.varietal_name]['Toxicity'] = varietal.toxicity
    
    return results


def get_favorites_by_userid(userid):
    """Return list of favorites for userid"""

    favorites = Favorite.query.filter_by(user_id=userid).all()
    favorite_plant_names = []

    for fav in favorites:
        p_id = fav.plant_id
        plant = Plant.query.filter_by(plant_id=p_id).one()
        if plant not in favorite_plant_names:
            favorite_plant_names.append({'img':plant.img_src, 'name':(plant.name).capitalize(), 'plant_id':plant.plant_id})
    return (favorite_plant_names)


def get_all_plants():
    """Return all plants from database."""
    all_plants = Plant.query.all()
    plants_dict = {}
    for plant in all_plants:
        plants_dict[plant.name] = {}
        plants_dict[plant.name]['name'] = plant.name.capitalize()
        plants_dict[plant.name]['img'] = plant.img_src
        plants_dict[plant.name]['id'] = plant.plant_id
    return plants_dict


def add_to_user_favorites(user_id,plant):
    """Add plant to favorites for user"""

    favorite_plant = Plant.query.filter_by(name=(plant).lower()).one()
    fav_plant_id = favorite_plant.plant_id
    all_favs = get_favorites_by_userid(user_id) 
    if plant.lower() in all_favs:
        return "Already in favs!"
    else:
        favorite = Favorite(user_id=user_id,plant_id=fav_plant_id)
    db.session.add(favorite)
    db.session.commit()
    return ({'img': favorite_plant.img_src, 'name': favorite_plant.name.capitalize()})
    
def remove_plant_from_favorites(user_id,plant):
    """Add plant to favorites for user"""

    favorite_plant = Plant.query.filter_by(name=(plant).lower()).one()
    fav_plant_id = favorite_plant.plant_id
    initial_favs = get_favorites_by_userid(user_id) 
    print(f'inital ones are {initial_favs}')
    Favorite.query.filter_by(user_id=user_id,plant_id=fav_plant_id).delete()
    db.session.commit()
    all_favs = get_favorites_by_userid(user_id) 
    print(f'then {all_favs}')
    return (all_favs)
    




