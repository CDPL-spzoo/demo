from django.shortcuts import render
from django.http import HttpResponse
import subprocess
from pathlib import Path
from datetime import datetime
import os
from redis import Redis
from rq import Queue
q = Queue(connection=Redis())

# Create your views here.
def form_view(request):
    if request.method == 'POST':
        category_url = request.POST.get('category_url') or ''
        gender = request.POST.get('gender') or ''
        availability = request.POST.get('availability') or ''
        margin = request.POST.get('margin') or ''
        delivery = request.POST.get('delivery') or ''
        category_name = request.POST.get('category_name') or ''
        product_type = request.POST.get('product-type') or ''
        name_template = request.POST.get('name_template') or ''
        badge = request.POST.get('badge') or ''
        tags = request.POST.get('tags') or ''
        title = request.POST.get('title') or ''
        meta_desc = request.POST.get('meta_desc') or ''
        meta_keywords = request.POST.get('meta_keywords') or ''
        short_description = request.POST.get('short_description') or ''
        cat1_name = request.POST.get('category1-name') or ''
        cat1_title = request.POST.get('category1-title') or ''
        cat1_meta_keywords = request.POST.get('category1-meta-keywords') or ''
        cat1_meta_desc = request.POST.get('category1-meta-desc') or ''
        cat1_link = request.POST.get('category1-link') or ''
        cat1_id = request.POST.get('category1-id') or ''
        cat1_description = request.POST.get('category1-desc') or ''
        cat2_name = request.POST.get('category2-name') or ''
        cat2_title = request.POST.get('category2-title') or ''
        cat2_meta_keywords = request.POST.get('category2-meta-keywords') or ''
        cat2_meta_desc = request.POST.get('category2-meta-desc') or ''
        cat2_link = request.POST.get('category2-link') or ''
        cat2_id = request.POST.get('category2-id') or ''
        cat2_description = request.POST.get('category2-desc') or ''

        current_datetime = datetime.now()
        formatted_datetime = current_datetime.strftime('%Y-%m-%d %H:%M')
        file_name = f'motion_de_{formatted_datetime}.csv'.replace(' ', '_').replace(':', '-')
        csv_filename = f'../../spiders/{file_name}'
        i = ''
        while os.path.isfile(csv_filename):
            file_name = file_name.replace('.csv', '').replace('-copy', '').replace(f'{i}', '') + f'-copy{i}' + '.csv'
            csv_filename = f'../../spiders/{file_name}'
            i = 0 if not i else i
            i += 1

        result = subprocess.run(['python', '../../spiders/run_spider.py',
                                 file_name,
                                 category_url,
                                 gender,
                                 availability,
                                 margin,
                                 delivery,
                                 category_name,
                                 product_type,
                                 name_template,
                                 badge,
                                 tags,
                                 title,
                                 meta_desc,
                                 meta_keywords,
                                 short_description,
                                 cat1_name,
                                 cat1_title,
                                 cat1_meta_keywords,
                                 cat1_meta_desc,
                                 cat1_link,
                                 cat1_id,
                                 cat1_description,
                                 cat2_name,
                                 cat2_title,
                                 cat2_meta_keywords,
                                 cat2_meta_desc,
                                 cat2_link,
                                 cat2_id,
                                 cat2_description
                                 ], capture_output=True, text=True)
        current_path = Path(__file__).resolve().parent
        print(current_path)
        print(result.stdout, result.stderr)
        result.check_returncode()
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(file_name)
        response['filename'] = file_name
        with open(csv_filename, 'r', encoding='utf-8') as csv_file:
            response.write(csv_file.read())
        os.remove(csv_filename)
        return response
    else:
        return render(request, 'form.html')
