# --- ETAPA 1: Compilación de React ---
FROM node:22-alpine AS build

WORKDIR /usr/src/app

# Copiar archivos de dependencias dependidas :p
COPY package*.json ./

# Instalar dependencias con Yarn para evitar bloqueos en Windows
RUN yarn install --frozen-lockfile || yarn install

# Copiar el resto del código y compilar para producción
COPY . .
RUN yarn build

# --- ETAPA 2: Servidor de Producción con Nginx ---
FROM nginx:1.25-alpine

# Copiar los archivos estáticos generados por Vite (dist) a la carpeta de Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Exponer el puerto por defecto de Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
