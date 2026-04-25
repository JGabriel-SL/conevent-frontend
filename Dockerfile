# Etapa 1: Build da aplicação (Node)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Considerando que o Vite gera os arquivos na pasta 'dist'
RUN npm run build 

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copia os arquivos compilados da etapa anterior para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Expõe a porta 80 do container
EXPOSE 80
# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
