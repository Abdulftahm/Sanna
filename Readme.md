## README  


Django Book Project  


Development Process:  
 - Ensure Docker & Docker Compose are installed  
 - Create a `.env` file in the repo root (it can be empty)
 - `docker compose up`
 - Access on port 8000


Deployment Process:  
 - Setup a mounted volume on /mnt/storage to hold persistent files
 - Add environment variables from `env.production` to the hosting provider
 - On first deploy, will need to manually run the commands:
    - `python3 manage.py migrate`
    - `python3 manage.py createsuperuser`



