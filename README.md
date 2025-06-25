# Tweeter clone with Adonis JS

## Introduction

Bienvenue sur le projet  ***Clone Tweeter***, développé avec le puissant framework **AdonisJS** !

Nous sommes ravis de vous accueillir dans cette aventure où nous explorons les possibilités offertes par **AdonisJS** pour recréer une plateforme de microblogging dynamique et performante.

## Objectifs pédagogiques
Nous allons :
- Configurer un projet **AdonisJS**.
- Définir des **routes** et des **contrôleurs**.
- Créer des **vues** avec le **moteur de template Edge**.
- Gérer une base de données avec un **ORM**
- Mettre en place un système d'**authentification**

> À la fin de ce projet, vous aurez une compréhension du **développement fullstack** et vous serez en mesure de développer des applications Web plus complexes.

## Prérequis
Avant de commencer ce projet, assurez-vous que vous avez les éléments suivants :
- **Node.js** version **20** minimum et **npm** installé sur votre ordinateur.
- Un éditeur de code (par exemple, **Visual Studio Code**).
- Des bonnes bases en **html**, **css**, **JavaScript** et **TypeScript**.

## Installation
Pour installer ce projet, suivez les étapes suivantes. :

-   Ouvrez donc le terminal à l'emplacement du dossier dans lequel vous voulez créer votre application et exécutez la commande suivante :
    ```
    git clone (url-de-mon-projet)
    ```
-   Dirigez-vous dans le dossier cloné :
    ```
    cd (nom-de-mon-projet)
    ```
    
-   Créez une nouvelle branche :
    ```
    git checkout -b nom-de-ma-branche
    ```

-   Installez les dépendances du projet :
    ```
    npm install
    ```
-   Commencez à coder :
    ```
    code .
    ```

- Créez un fichier **.env**

- Copier le contenu de **.env.exemple** et coller dans le fichier **.env** sauf la variable **APP_KEY** qui dois être générer en tapant la commande :
    ```
    node ace generate:key
    ``` 

## Lancez votre projet
Pour lancer votre projet en mode développement tapez la commande :
```
npm run dev
```



# x-clone

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![AdonisJS](https://img.shields.io/badge/AdonisJS-3E6E9A?style=flat-square&logo=adonisjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)

## Project Description

x-clone is a full-featured web application designed to replicate core functionalities of a social media platform. Built with a focus on user interaction, the application allows users to create and manage profiles, post tweets, retweet, like posts, and comment on tweets. The architecture is designed to be modular, making it easy to extend and maintain.

### Key Features
- User authentication and authorization
- Profile management
- Tweet creation and management
- Retweet and like functionalities
- Commenting on tweets
- Middleware support for enhanced security and functionality

## Tech Stack

| Technology       | Description                                      |
|------------------|--------------------------------------------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)  | JavaScript runtime built on Chrome's V8 engine |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | Typed superset of JavaScript that compiles to plain JavaScript |
| ![AdonisJS](https://img.shields.io/badge/AdonisJS-3E6E9A?style=flat-square&logo=adonisjs&logoColor=white) | Node.js MVC framework for building server-side applications |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) | Open-source relational database management system |

## Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- Git

### Step-by-Step Installation Guide
1. Clone the repository:
   ```bash
   git clone https://github.com/hkrene/x-clone.git
   cd x-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   - Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   - Edit the `.env` file to configure your database and other settings.

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the application:
   ```bash
   npm run start
   ```

## Usage

To run the application, navigate to the project directory and use the following command:
```bash
npm run start
```
The application will be accessible on `http://localhost:3000`.

### Basic Usage Examples
- **Register a new user**: Navigate to `/signup` to create a new account.
- **Log in**: Use the `/login` endpoint to authenticate.
- **Create a tweet**: After logging in, use the `/tweets` endpoint to post a new tweet.

## Project Structure

The project structure is organized as follows:

```
x-clone/
├── app/
│   ├── controllers/          # Contains controllers for handling requests
│   ├── exceptions/           # Custom exception handlers
│   ├── middleware/           # Middleware for authentication and request handling
│   ├── models/               # Data models for users, tweets, etc.
│   └── validators/           # Input validation logic
├── bin/                      # Entry points for the application (console, server)
├── config/                   # Configuration files for app settings, database, etc.
├── database/                 # Database migrations for schema setup
├── public/                   # Static assets (icons, images, uploads)
├── resources/                # Frontend resources (CSS, JS, views)
├── start/                    # Application startup files (environment, kernel, routes)
├── tests/                    # Test files for application
├── .env.example              # Example environment variable file
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

### Main Files
- **app/controllers/**: Contains the logic for handling requests related to authentication, profiles, tweets, etc.
- **app/models/**: Contains the data models for users, tweets, likes, comments, and retweets.
- **config/**: Holds configuration files for various settings including database and authentication.
- **database/migrations/**: Scripts for creating and updating database tables.

## Contributing

We welcome contributions to enhance the project! If you would like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

Thank you for considering contributing to x-clone!
