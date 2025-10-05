FROM python:3.12.2

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install vim less -y

COPY ./Book/requirements.txt /app/requirements.txt

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_SYSTEM_PYTHON=1
RUN uv pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./Book /app

WORKDIR /app

EXPOSE 8000
CMD ["gunicorn","--bind" ,"0.0.0.0:8000","BookProject.wsgi"]
