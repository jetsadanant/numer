
FROM node:alpine
RUN npm install
RUN mkdir root/data
COPY numerical /root/data