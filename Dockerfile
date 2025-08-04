# Imagem base leve do Node.js
FROM node:20-alpine

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (para cache eficiente)
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --production

# Copia o restante do código
COPY . .

# Define a porta que o container vai expor
EXPOSE 3000

# Comando para iniciar a API
CMD ["node", "src/app.js"]
