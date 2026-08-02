FROM node:22-bookworm-slim

WORKDIR /app

# The decision route executes the existing Python ML engine, so the runtime must
# include both the interpreter and its dependencies.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY ml/requirements.txt ./ml/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages -r ./ml/requirements.txt

COPY . .

ENV NODE_ENV=production \
    PYTHONUNBUFFERED=1 \
    PYTHON_BIN=python3

EXPOSE 8080

CMD ["npm", "start"]
