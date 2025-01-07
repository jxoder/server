# 빌드 스테이지
FROM postgres:17.2 as builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        git \
        build-essential \
        postgresql-server-dev-17

WORKDIR /tmp

# pgvector 빌드
RUN git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make \
    && make install

# pgmq 빌드
RUN git clone https://github.com/tembo-io/pgmq.git \
    && cd pgmq/pgmq-extension \
    && make \
    && make install

# 최종 스테이지
FROM postgres:17.2

# 빌드된 확장 파일들만 복사
COPY --from=builder /usr/share/postgresql/17/extension/ /usr/share/postgresql/17/extension/
COPY --from=builder /usr/lib/postgresql/17/lib/ /usr/lib/postgresql/17/lib/

EXPOSE 5432