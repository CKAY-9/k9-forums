from flask import Flask, flash, request, redirect, url_for, send_file
from markupsafe import escape
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)



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




UPLOAD_FOLDER = './cdn/'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('download_file', name=filename))