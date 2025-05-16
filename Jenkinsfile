pipeline {
    agent any

    stages {
        stage('Clonar Repositorio') {
            steps {
                git 'https://github.com/TU_USUARIO/agrotienda-web.git'
            }
        }
        stage('Construir Imagen Docker') {
            steps {
                sh 'docker build -t agrotienda .'
            }
        }
        stage('Levantar Contenedor') {
            steps {
                sh 'docker-compose down && docker-compose up -d'
            }
        }
    }
}
