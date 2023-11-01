FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install flask uuid7

EXPOSE 5602

ENTRYPOINT [ "python" ]

CMD ["main.py"]
