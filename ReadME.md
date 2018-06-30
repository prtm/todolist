## Requirements
Python 3

```python

pip3 install pipenv
pipenv install

```

### create secrets.json in the root folder

```json
{
"SECRET_KEY": ""
}

```
### create database and add below lines in /etc/mysql/my.cnf
```
[client]
database = 
user = 
password = 
default-character-set = utf8
```



### activating pipenv environment and runserver

```python
pipenv shell
python manage.py runserver
```