ARG BASE_IMAGE
FROM ${BASE_IMAGE} AS builder
WORKDIR /home/node/app

COPY . .
RUN npm run build


FROM ${BASE_IMAGE}

# Set to a non-root built-in user `node`
USER node
# Create app directory (with user `node`)
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Bundle dist app
COPY --chown=node package*.json ./
COPY --from=builder --chown=node /home/node/app/dist ./dist

# Bind default port
ENV PORT=3000

EXPOSE ${PORT}
CMD [ "npm", "run", "start:prod" ]
