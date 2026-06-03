# Using a slim version of Python to keep it small
FROM python:3.11-slim

# Preventing Python from writing .pyc files and enable real-time logs
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Installing system tools needed for PostgreSQL and Celery
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    
    #added 'build-essential' and 'python3-dev' which are often needed for 'psycopg2' and 'twisted'
    python3-dev \  
    build-essential \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt /app/

# UPGRADING pip, setuptools, and wheel first to fix security bugs.
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt


COPY . /app/

# Opening port 8000 for the web server
EXPOSE 8000