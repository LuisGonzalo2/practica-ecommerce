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
        stage('Construir Imagen de React') {
            steps {
                // Construye la imagen de producción usando Nginx
                sh 'docker build -t e-commerce-react:latest .'
            }
        }

        stage('Desplegar E-commerce') {
            steps {
                sh '''
                    # Detener y eliminar versiones anteriores si existen
                    docker stop e-commerce-container || true
                    docker rm e-commerce-container || true

                    # Ejecutar el nuevo contenedor mapeando el puerto 80 de Nginx al puerto 8081 de tu Windows 11
                    docker run -d --name e-commerce-container -p 8081:80 e-commerce-react:latest
                '''
            }
        }
    }
}