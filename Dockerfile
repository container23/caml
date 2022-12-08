FROM node:18.12-bullseye-slim as builder

WORKDIR /usr/src/kycaml-service

COPY . .

# Build: install deps, compile code, cleanup dev deps 
RUN set -x \
    && echo "Building release image" \
    && echo "Installing dependencies" \
    && npm install \
    && echo "Linting code..." \
    && npm run lint \
    && echo "Running unit tests..." \
    && npm run test \
    && echo "Building app..." \
    && npm run build \
    && echo "Cleaning dev dependencies..." \
    && npm prune --omit=dev \
    && echo "Build completed."

# Release 
FROM node:18.12.1-alpine3.16 as runtime

WORKDIR /usr/src/kycaml-service

ARG VERSION
ARG COMMIT_HASH
ARG BUILD_TIME 

ENV NODE_ENV=production
ENV VERSION=${VERSION}
ENV COMMIT_HASH=${COMMIT_HASH}
ENV BUILD_TIME=${BUILD_TIME}

EXPOSE 8080

# Copy only main app files required
COPY --from=builder /usr/src/kycaml-service/dist/ /usr/src/kycaml-service/dist/
COPY --from=builder /usr/src/kycaml-service/data-sources/ /usr/src/kycaml-service/data-sources/
COPY --from=builder /usr/src/kycaml-service/node_modules/ /usr/src/kycaml-service/node_modules/
COPY --from=builder /usr/src/kycaml-service/package.json /usr/src/kycaml-service/package.json

# Start app
CMD ["node", "dist/app.js"]