# Dockerfile
FROM node:22-alpine

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Copiar los datos y el archivo de pruebas necesarios para Jest
COPY users.json ./
# Copiar la carpeta completa de pruebas 'test' al contenedor
COPY tests/ ./test/


# Copiar el código principal de la aplicación
COPY index.js .

# Usar Yarn para instalar dependencias (incluyendo Jest y Supertest)
RUN yarn install --frozen-lockfile || yarn install

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]