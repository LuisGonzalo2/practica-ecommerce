pipeline {
    agent any

    environment {
        // Compatibilidad con Docker Desktop de Windows 11
        DOCKER_API_VERSION = '1.40'
    }

    tools {
        dockerTool 'Dockertool'  
    }

    stages {
        stage('Construir Imagen de Test') {
            steps {
                // Construye solo hasta la etapa "build" del Dockerfile (tiene Node + yarn + devDependencies)
                sh 'docker build --target build -t e-commerce-react:test .'
            }
        }

        stage('Ejecutar tests') {
            steps {
                // Corre Vitest dentro de un contenedor limpio y muestra el resultado en consola
                sh 'docker run --rm e-commerce-react:test yarn test'
            }
        }

        stage('Construir Imagen de React') {
            steps {
                // Construye la imagen completa de producción con Nginx
                sh 'docker build -t e-commerce-react:latest .'
            }
        }

        stage('Desplegar E-commerce') {
            steps {
                sh '''
                    docker stop e-commerce-container || true
                    docker rm e-commerce-container || true
                    docker run -d --name e-commerce-container -p 8081:80 e-commerce-react:latest
                '''
            }
        }
    }
}