FROM node:25.9-alpine AS build 
#wersja node 25.9 z build-sea


#ssh mount - na tym repozytorium sa tez dockerfile, których nie potrzebuje w srodku, ale nie chce teraz robic 2 repozytoriów, skoro na zajecia przyniosłam jedno
ADD git@github.com:afutera/af_pawcho_zad1.git /usr/lab8build
WORKDIR /usr/lab8build/src


RUN mkdir out &&\
node --build-sea build-config.json &&\
cp config.js out/config.js&&\
cp cities.js out/cities.js

#dla testow może zajść potrzeba uruchomienia z obrazu build
CMD ["/usr/lab8build/src/out/pogoda"]

FROM alpine:3.23.4 AS final

#Curl do healthchecka plus biblioteka, bez której exe node się nie uruchomi
#zakladam, ze jest zmieniany rzadziej, niż mój projekt, wiec wczesniejsza warstwa
#w curl 8.19.0 naprawiono CVE-2026-3805
RUN apk update &&\ 
apk add curl>8.18.0 &&\
apk add --no-cache libstdc++ &&\
rm -rf /var/cache/apk

COPY --from=build /usr/lab8build/src/out /usr/lab8

LABEL org.opencontainers.image.description="Rozwiązanie zadania 1 - aplikacja webowa wyświetlająca dane pogodowe."
LABEL org.opencontainers.image.authors="Aleksandra Futera"

EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=1s \
	CMD curl -f http://localhost:3000/?city=Lublin || exit 1

#Nie ma parametrow, wiec wszystko jedno, czy cmd czy entrypoint
ENTRYPOINT ["/usr/lab8/pogoda"]


