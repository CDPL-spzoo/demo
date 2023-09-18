from django.contrib import admin
from django.conf import settings
from .models import Category, Subcategory
from datetime import datetime
import subprocess
import os
import glob
import threading
from subprocess import Popen, PIPE, STDOUT, CalledProcessError
import logging


def delete_oldest_files(folder_path, num_files_to_keep):
    files = glob.glob(os.path.join(folder_path, '*'))
    files.sort(key=os.path.getmtime)
    num_files_to_delete = len(files) - num_files_to_keep
    for i in range(num_files_to_delete):
        os.remove(files[i])


def log_subprocess_output(pipe):
    try:
        for line in iter(pipe.readline, b''):
            print(line.decode("utf-8").strip())

    except CalledProcessError as e:
        print(f"{str(e)}")

def get_filename():
    current_datetime = datetime.now()
    formatted_datetime = current_datetime.strftime('%Y-%m-%d %H:%M')
    file_name = f'motion_de_{formatted_datetime}.csv'.replace(' ', '_').replace(':', '-')
    csv_folder = f'{settings.MEDIA_ROOT}/parser/parsed'
    csv_path = f'{csv_folder}/{file_name}'
    delete_oldest_files(csv_folder, 50)
    i = ''
    while os.path.isfile(csv_path):
        file_name = file_name.replace('.csv', '').replace('-copy', '').replace(f'{i}', '') + f'-copy{i}' + '.csv'
        csv_path = f'{settings.MEDIA_ROOT}/{file_name}'
        i = 0 if not i else i
        i += 1
    return file_name


class CategoryInline(admin.StackedInline):
    model = Subcategory
    extra = 1


@admin.register(Category)
class ProductAdmin(admin.ModelAdmin):
    change_form_template = 'change_form.html'
    list_display = ('name',
                    'category_url',
                    'gender',
                    'availability',
                    'margin',
                    'delivery',
                    'category_name',
                    'product_type',
                    'name_pattern',
                    'badge',
                    'tags',
                    'title',
                    'meta_description',
                    'meta_keywords',
                    'short_description',
                    'status',
                    'parsed_csv'
                    )
    readonly_fields = ('parsed_csv',)

    inlines = [CategoryInline]

    def save_model(self, request, obj, form, change):
        obj.status = 'status4'
        obj.save()

        def run_script():
            try:
                category_url = form.cleaned_data.get('category_url')
                gender = form.cleaned_data.get('gender')
                availability = form.cleaned_data.get('availability')
                margin = form.cleaned_data.get('margin')
                delivery = form.cleaned_data.get('delivery')
                category_name = form.cleaned_data.get('category_name')
                product_type = form.cleaned_data.get('product_type')
                name_pattern = form.cleaned_data.get('name_pattern')
                badge = form.cleaned_data.get('badge')
                tags = form.cleaned_data.get('tags')
                title = form.cleaned_data.get('title')
                meta_description = form.cleaned_data.get('meta_description')
                meta_keywords = form.cleaned_data.get('meta_keywords')
                short_description = form.cleaned_data.get('short_description')
                subcategory_args = []
                inl_n = 1
                for inline_formset in self.get_inline_instances(request):
                    if isinstance(inline_formset, CategoryInline):
                        formset = self.get_formset_kwargs(request, obj, inline=inline_formset, prefix=f"cat_{inl_n}")
                        for key in formset.get('data').keys():
                            if ('subcategory_set-0' in key or 'subcategory_set-1' in key or 'subcategory_set-2' in key) and key not in ['subcategory_set-0-category', 'subcategory_set-1-category', 'subcategory_set-0-id', 'subcategory_set-1-id', 'subcategory_set-2-category', 'subcategory_set-2-id']:
                                subcategory_args.append(formset.get('data').get(key))

                file_name = get_filename()
                args = ['python', 'motion_de/spiders/motoin_spider.py',
                        file_name,
                        category_url,
                        gender,
                        availability,
                        str(margin),
                        str(delivery),
                        category_name,
                        product_type,
                        name_pattern,
                        badge,
                        tags,
                        title,
                        meta_description,
                        meta_keywords,
                        short_description
                        ] + subcategory_args
                # process = Popen(args, stdout=PIPE, stderr=STDOUT)
                print('subprocess started')
                # with process.stdout:
                #     log_subprocess_output(process.stdout)
                # process.wait()
                # print('subprocess finished')
                result = subprocess.run(args, capture_output=True, text=True)
                try:
                    result.check_returncode()
                    obj.status = 'status2'
                    print(result.stdout)
                    print(result.stderr)
                except subprocess.CalledProcessError as error:
                    obj.status = 'status3'
                    print(result.stderr)
                    print(error.stderr)
                obj.parsed_csv = 'parser/parsed/'+file_name
                obj.save()

            except Exception as exp:
                obj.status = 'status3'
                logging.info(exp)
                obj.save()

        script_thread = threading.Thread(target=run_script)
        script_thread.start()
        # print(result.stdout)
        # print(result.stderr)
        super().save_model(request, obj, form, change)

