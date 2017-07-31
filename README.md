# Brokkoli
Web-Engineering Projekt 


Projektmitglieder: 
Nicolas Konle,
Hannes Karl, 
Luka Kröger


## Dev

### Installation (unter Windows)
* `Github Repo Clonen inkl. node_modules`
* `cmd -> node Webserver.js` -> Server starten

### Testen
mit Postman (https://getpostman.com/)


## API


### Allgemein
* Pfadpräfix für die einzelnen Endpoints: `/api/V1`
* Soll der Request authentifiziert werden, muss im Header ein Token angegeben werden. Dies wird über den Endpunkt `/login`realisiert.
* Header wird nach dem Key 'Token' durchsucht als Value muss der über den Login erhaltene Schhlüssel ohne "" verwendet werden. 
### Endpoints

#### User

##### Passwort ändern
* Endpoint: `PUT /passwordRecovery`
* Parameter:
  * `oldPassword`
  * `newpassword`
* Authentifizierung: ja
  
##### Login
* Endpoint `PUT /login`
* Parameter:
  * `username`
  * `password`

#### Blog

#### Blogeintrag anlegen
* Endpoint `POST /blog`
* nötige Parameter:
  * `title`
  * `picture`
  * `author`
  * `about`
  * `tags[]`
  * `hidden`
  * `released`
* Authentifizierung: ja

#### Blogeintrag bearbeiten
* Endpoint `PUT /blog/:id`
* Parameter (optional):
  * `title`
  * `picture`
  * `author`
  * `about`
  * `tags[]`
  * `hidden`
  * `released`
* Authentifizierung
  * für nicht-öffentliche Blogeinträge (hidden) muss der Request authentifiziert werden (sonst HTTP 401)

#### Alle Blogeinträge

* Endpoint `GET /blog`
* Authentifizierung:
  * ja: Rückgabe aller Blogeinträge
  * nein: nur die öffentlichen Einträge (ohne hidden)

#### Bestimmter Blogeintrag

* Endpoint `GET /blog/:id`
* Authentifizierung
  * für nicht-öffentliche Blogeinträge (hidden) muss der Request authentifiziert werden (sonst HTTP 401)

#### Blogeintrag löschen

* Endpoint `DELETE /blog/:id`
* Authentifizierung
  * für nicht-öffentliche Blogeinträge (hidden) muss der Request authentifiziert werden (sonst HTTP 401)
