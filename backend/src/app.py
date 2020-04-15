from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

#inicilitacion
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/py_reactdb'
mongo = PyMongo(app)

#
# Midelware: interaccion entre servidores
# de flask y react
#
CORS(app)

#interaction with the database
db = mongo.db.users

#Routes


#create users
@app.route('/users', methods=['POST'])
def create_user():
    id = db.insert({
        'name': request.json['name'],
        'password': request.json['password'],
        'email': request.json['email']
    })
    res = jsonify(str(ObjectId(id)))
    return res


#get all users
@app.route('/users', methods=['GET'])
def get_users():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })
    return jsonify(users)


#get user
@app.route('/users/<id>', methods=['GET'])
def get_user(id):
    user = db.find_one({'_id': ObjectId(id)})
    print(user)
    res = jsonify({
        '_id': str(ObjectId(user['_id'])),
        'name': user['name'],
        'email': user['email'],
        'password': user['password']
    })
    return res


#delete users
@app.route('/users/<id>', methods=['DELETE'])
def delete_user(id):
    db.delete_one({'_id': ObjectId(id)})
    res = jsonify({'message': 'User ' + id + ' was deleted successfully'})
    return res


#create users
@app.route('/users/<id>', methods=['PUT'])
def update_user(id):
    db.update_one({'_id': ObjectId(id)}, {
        '$set': {
            'name': request.json['name'],
            'email': request.json['email'],
            'password': request.json['password']
        }
    })
    res = jsonify({'message': 'User ' + id + ' was updated successfully'})
    return res


#start app
if __name__ == "__main__":
    app.run(debug=True)
