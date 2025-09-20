FROM node:18 AS builder
WORKDIR /home/node/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:18

# Set to a non-root built-in user `node`
USER node
# Create app directory (with user `node`)
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Bundle dist app
COPY --chown=node package*.json ./
COPY --from=builder --chown=node /home/node/app/dist ./dist
RUN npm ci

# Bind default port
ENV PORT=3000

EXPOSE ${PORT}
CMD [ "npm", "run", "start:prod" ]
