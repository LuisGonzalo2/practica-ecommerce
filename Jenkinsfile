pipeline {
    agent any

    environment {
        // Mantiene la compatibilidad de comunicación con Docker Desktop en Windows 11
        DOCKER_API_VERSION = '1.40'
    }

    tools {
        dockerTool 'Dockertool'  
    }

    stages {
        stage('Construir Imagen Docker') {
            steps {
                // Se construye la imagen aislada usando Yarn incorporado en el Dockerfile
                sh 'docker build -t hola-mundo-node:latest .'
            }
        }

        stage('Ejecutar tests') {
            steps {
                // Ejecuta los tests de Jest usando la imagen limpia que se acaba de compilar
                sh 'docker run --rm hola-mundo-node:latest yarn test'
            }
        }

        stage('Ejecutar Contenedor Node.js') {
            steps {
                sh '''
                    # Detener y eliminar cualquier contenedor previo con el mismo nombre
                    docker stop hola-mundo-node || true
                    docker rm hola-mundo-node || true

                    # Ejecutar el nuevo contenedor de la aplicación en producción
                    docker run -d --name hola-mundo-node -p 3000:3000 hola-mundo-node:latest
                '''
            }
        }
    }
}