## Update SSL Certificates (LAMP)

1. **Create a CRS and private key**
    1. `openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr`
    1. Use the following for the prompts:
        * _Country Name (2 letter code) [AU]:_ **US**
        * _State or Province Name (full name) [Some-State]:_ **Colorado**
        * _Organization Name (eg, company) [Internet Widgits Pty Ltd]:_ **Colorado State University**
        * _Organizational Unit Name (eg, section) []:_ **Research Integrity and Compliance Review Office**
        * _Common Name (e.g. server FQDN or YOUR name) []:_ **services.ricro.colostate.edu**
        * _Email Address []:_ **ricro_information_reply@mail.colostate.edu**
        * _A challenge password []:_ **leave blank**
        * _An optional company name []:_ **leave blank**
    * Two files will be generated in the directory that you ran the script.
    * `server.key` contains the private key. Ensure this is **never** public.
1. **Request the Certificates from ACNS**
    1. https://www.acns.colostate.edu/incommon/
        * _Contact Email:_ **ricro_information_reply@mail.colostate.edu**
        * _Cert Type:_ **Basic SSL (SHA-2)**
        * _CSR:_ **Paste the content from `server.csr` that was generated above**
        * _FQDN:_ **services.ricro.colostate.edu**
        * _Cert Term:_ **max available**
        * _Server Software:_ **Apache/ModSSL**
1. **Wait for approval from ACNS**
