import os
HTTP_PORT = 5000

none_images = os.popen('docker images -f "dangling=true" -q')
for i in none_images:
    os.system(f'docker rmi {i}')
os.system('docker volume create motoin_de_media')
os.system('docker volume create motoin_de_db')
image_name = f"django_crawlers"
os.system(f'docker build -t {image_name} .')
os.system(f'docker rm -f {image_name}')
os.system(f'docker run -it -p {HTTP_PORT}:5000 -d'
          f' -v motoin_de_media:/app/motion_de/django_admin/motoin_parser/media'
          f' -v motoin_de_db:/app/motion_de/django_admin/motoin_parser/db'
          f' --restart always  --name {image_name}  {image_name} ')
