FROM python:3.9

WORKDIR ./app

COPY main.py ./main.py
COPY files/default ./files/default

RUN python -m venv ./.venv
RUN . ./.venv/bin/activate
RUN pip install flask
RUN pip install markupsafe
RUN pip install werkzeug
RUN pip install -U flask-cors

CMD ["flask", "--app", "main", "run"]