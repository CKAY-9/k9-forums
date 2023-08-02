from flask import Flask, flash, request, jsonify, send_file
from flask_cors import CORS
from markupsafe import escape
from werkzeug.utils import secure_filename
from hashlib import md5
import random
import os

app = Flask(__name__)
CORS(app)



# SHOWING



@app.route("/<id>/<file>")
def get_file(id, file):
    id = escape(id)
    file = escape(file)

    try:
        return send_file("./files/" + id + "/" + file)
    except Exception as e:
        return str(e)
    


# UPLOADING


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if (request.method == 'POST'):
        # check if the post request has the file part
        if ('file' not in request.files):
            flash('No file part')
            return jsonify({
                "message": "File missing!"
            }), 400
        
        file = request.files['file']
        previous_file = ""

        if ('previous_file' in request.form):
            previous_file = request.form["previous_file"]

        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if (file.filename == ''):
            flash('No selected file')
            return jsonify({
                "message": "Filename invalid"
            }), 400
        
        if (file):
            unique_id = md5(bytes(str(random.randint(0, 1_000_000_000)).encode("ascii", "utf-8"))).hexdigest()
            filename = secure_filename(unique_id + file.filename)

            if (not os.path.exists(f"./files/{request.form['folder_id']}")):
                os.makedirs(f"./files/{request.form['folder_id']}")

            file.save(os.path.join(f"./files/{request.form['folder_id']}", filename))

            if (not previous_file == "" and not previous_file == "/default/default.png"):
                os.remove("./files" + previous_file)

            return jsonify({
                "message": "Uploaded file",
                "dest": f"/{request.form['folder_id']}/{filename}"
            }), 200