#!/bin/bash
openssl genrsa -des3 -out server.enc.key 1024
echo "Created private key.."
openssl req -new -key server.enc.key -out server.csr
echo "Created cert request using the private key..."
openssl rsa -in server.enc.key -out server.key
echo "Created public key 'server.key' using the private key..."
openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt
echo "Created dev certificate"
echo "***************************************************************"
echo "  NOTE : Please make sure you enable ssl in proxy-config.json"
echo "***************************************************************"