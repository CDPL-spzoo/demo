# base image
FROM python:3.10.6-buster

EXPOSE 5000
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN pip install --upgrade pip
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
RUN ls
CMD ["python", "motion_de/django_admin/motoin_parser/manage.py", "runserver", "0.0.0.0:5000"]